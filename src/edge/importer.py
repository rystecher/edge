import time

from BCBio import GFF
from django.db import connection

from edge.models import Fragment, Fragment_Chunk_Location


class GFFImporter(object):
    def __init__(self, genome, gff_fasta_fn):
        self.__genome = genome
        self.__gff_fasta_fn = gff_fasta_fn

    def do_import(self):
        in_file = self.__gff_fasta_fn
        in_handle = open(in_file)

        # In DEBUG=True mode, Django keeps list of queries and blows up memory
        # usage when doing a big import. The following line disables this
        # logging.
        connection.use_debug_cursor = False

        for rec in GFF.parse(in_handle):
            if self.__genome.fragments.filter(name=rec.id).count() > 0:
                print("skipping %s, already imported" % rec.id)
            else:
                f = GFFFragmentImporter(rec).do_import()
                self.__genome.genome_fragment_set.create(fragment=f, inherited=False)

        # Be nice and turn debug cursor back on
        connection.use_debug_cursor = True
        in_handle.close()


class GFFFragmentImporter(object):
    def __init__(self, gff_rec):
        self.__rec = gff_rec
        self.__sequence = None
        self.__features = None
        self.__fclocs = None

    def do_import(self):
        self.parse_gff()
        t0 = time.time()
        f = self.build_fragment()
        print("build fragment: %.4f" % (time.time() - t0,))
        t0 = time.time()
        self.annotate(f)
        print("annotate: %.4f" % (time.time() - t0,))
        return f

    def parse_gff(self):
        name_fields = (
            "name",
            "Name",
            "gene",
            "locus",
            "locus_tag",
            "product",
            "protein_id",
        )

        self.__sequence = str(self.__rec.seq)
        seqlen = len(self.__sequence)
        print("%s: %s" % (self.__rec.id, seqlen))

        features = []
        for feature in self.__rec.features:
            # skip features that cover the entire sequence
            if feature.location.start == 0 and feature.location.end == seqlen:
                continue

            # get name
            name = feature.id
            if name == "":
                name = feature.type
            for field in name_fields:
                if field in feature.qualifiers:
                    v = feature.qualifiers[field]
                    if len(v) > 0:
                        name = v[0]
                        break
            name = name[0:100]

            # get qualifiers
            qualifiers = {}
            for field in feature.qualifiers:
                v = feature.qualifiers[field]
                if len(v) > 0:
                    qualifiers[field] = v

            # start in Genbank format is start after, so +1 here
            if feature.type.upper() != 'CDS' or len(feature.sub_features) == 0:
                features.append(
                    (
                        int(feature.location.start) + 1,
                        int(feature.location.end),
                        name,
                        feature.type,
                        feature.strand,
                        qualifiers,
                    )
                )

            # add sub features for chunking for CDS only
            for sub in feature.sub_features:
                if hasattr(sub, 'qualifiers') and 'Name' in sub.qualifiers:
                    name = sub.qualifiers['Name'][0]
                elif sub.id != '':
                    name = sub.id

                if sub.type.upper() in ['MRNA', 'CDS']:
                    features.append(
                        (
                            int(sub.location.start) + 1,
                            int(sub.location.end),
                            name,
                            sub.type,
                            sub.strand,
                            qualifiers,
                        )
                    )
                    for sub_sub in sub.sub_features:
                        if hasattr(sub, 'qualifiers') and 'Name' in sub.qualifiers:
                            name = sub_sub.qualifiers['Name'][0]
                        elif sub_sub.id != '':
                            name = sub_sub.id

                        features.append(
                            (
                                int(sub_sub.location.start) + 1,
                                int(sub_sub.location.end),
                                name,
                                sub_sub.type,
                                sub_sub.strand,
                                qualifiers,
                            )
                        )

        self.__features = features

    def build_fragment(self):
        # pre-chunk the fragment sequence at feature start and end locations.
        # there should be no need to further divide any chunk during import.
        break_points = list(
            set([f[0] for f in self.__features] + [f[1] + 1 for f in self.__features])
        )
        break_points = sorted(break_points)

        cur_len = 0
        chunk_sizes = []
        seq_len = len(self.__sequence)
        for i, bp in enumerate(break_points):
            if i == 0:
                if bp > 1:
                    chunk_sizes.append(break_points[i] - 1)
                    cur_len += chunk_sizes[-1]
            else:
                chunk_sizes.append(break_points[i] - break_points[i - 1])
                cur_len += chunk_sizes[-1]

        if cur_len < seq_len:
            chunk_sizes.append(seq_len - cur_len)

        new_fragment = Fragment(
            name=self.__rec.id, circular=False, parent=None, start_chunk=None
        )
        new_fragment.save()
        new_fragment = new_fragment.indexed_fragment()

        # divide chunks bigger than a certain threshold to smaller chunks, to
        # allow insertion of sequence into database. e.g. MySQL has a packet
        # size that prevents chunks that are too large from being inserted.
        chunk_size_limit = 1000000
        new_chunk_sizes = []
        for original_chunk_size in chunk_sizes:
            if original_chunk_size < chunk_size_limit:
                new_chunk_sizes.append(original_chunk_size)
            else:
                divided_chunks = []
                while original_chunk_size > 0:
                    divided_chunks.append(min(original_chunk_size, chunk_size_limit))
                    original_chunk_size -= chunk_size_limit
                new_chunk_sizes.extend(divided_chunks)
        chunk_sizes = new_chunk_sizes
        print("%d chunks" % (len(chunk_sizes),))

        prev = None
        fragment_len = 0
        for chunk_size in chunk_sizes:
            t0 = time.time()
            prev = new_fragment._append_to_fragment(
                prev,
                fragment_len,
                self.__sequence[fragment_len : fragment_len + chunk_size],
            )
            fragment_len += chunk_size
            print("add chunk to fragment: %.4f\r" % (time.time() - t0,), end="")

        return new_fragment

    def annotate(self, fragment):
        self.__fclocs = {
            c.base_first: c
            for c in Fragment_Chunk_Location.objects.select_related("chunk").filter(
                fragment=fragment
            )
        }

        for feature in self.__features:
            t0 = time.time()
            print(feature)
            f_start, f_end, f_name, f_type, f_strand, f_qualifiers = feature
            # print('  %s %s: %s-%s %s' % (f_type, f_name, f_start, f_end, f_strand))
            self._annotate_feature(
                fragment, f_start, f_end, f_name, f_type, f_strand, f_qualifiers
            )
            print("annotate feature: %.4f\r" % (time.time() - t0,), end="")
        print("\nfinished annotating feature")

    def _annotate_feature(
        self, fragment, first_base1, last_base1, name, type, strand, qualifiers
    ):
        if fragment.circular and last_base1 < first_base1:
            # has to figure out the total length from last chunk
            length = len(self.__sequence) - first_base1 + 1 + last_base1
        else:
            length = last_base1 - first_base1 + 1
            if length <= 0:
                raise Exception("Annotation must have length one or more")

        if first_base1 not in self.__fclocs or (
            (last_base1 < len(self.__sequence) and last_base1 + 1 not in self.__fclocs)) or (
            last_base1 > len(self.__sequence)):
            raise Exception(
                "Cannot find appropriate sequence for feature: %s, start %s, end %s"
                % (name, first_base1, last_base1)
            )

        bases = []
        for key in self.__fclocs:
            fcloc = self.__fclocs[key]
            if fcloc.base_first >= first_base1 and fcloc.base_last <= last_base1:
                bases.append((fcloc.base_first, fcloc.base_last))

        assert bases[0][0] >= first_base1 and bases[-1][1] <= last_base1
        assert fragment.annotate_chunks(bases, name, type, strand, qualifiers=qualifiers) != None