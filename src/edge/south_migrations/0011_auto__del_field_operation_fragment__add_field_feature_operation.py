# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):
    def forwards(self, orm):
        # Deleting field 'Operation.fragment'
        db.delete_column(u"edge_operation", "fragment_id")

        # Adding field 'Feature.operation'
        db.add_column(
            u"edge_feature",
            "operation",
            self.gf("django.db.models.fields.related.ForeignKey")(
                to=orm["edge.Operation"], null=True
            ),
            keep_default=False,
        )

    def backwards(self, orm):

        # User chose to not deal with backwards NULL issues for 'Operation.fragment'
        raise RuntimeError(
            "Cannot reverse this migration. 'Operation.fragment' and its values cannot be restored."
        )

        # The following code is provided here to aid in writing a correct migration        # Adding field 'Operation.fragment'
        db.add_column(
            u"edge_operation",
            "fragment",
            self.gf("django.db.models.fields.related.ForeignKey")(
                to=orm["edge.Fragment"]
            ),
            keep_default=False,
        )

        # Deleting field 'Feature.operation'
        db.delete_column(u"edge_feature", "operation_id")

    models = {
        "edge.chunk": {
            "Meta": {"object_name": "Chunk"},
            "id": (
                "django.db.models.fields.BigIntegerField",
                [],
                {"primary_key": "True"},
            ),
            "initial_fragment": (
                "django.db.models.fields.related.ForeignKey",
                [],
                {"to": "orm['edge.Fragment']", "on_delete": "models.PROTECT"},
            ),
            "sequence": ("django.db.models.fields.TextField", [], {"null": "True"}),
        },
        "edge.chunk_feature": {
            "Meta": {"object_name": "Chunk_Feature"},
            "chunk": (
                "django.db.models.fields.related.ForeignKey",
                [],
                {"to": "orm['edge.Chunk']", "on_delete": "models.PROTECT"},
            ),
            "feature": (
                "django.db.models.fields.related.ForeignKey",
                [],
                {"to": "orm['edge.Feature']", "on_delete": "models.PROTECT"},
            ),
            "feature_base_first": ("django.db.models.fields.IntegerField", [], {}),
            "feature_base_last": ("django.db.models.fields.IntegerField", [], {}),
            "id": (
                "django.db.models.fields.BigIntegerField",
                [],
                {"primary_key": "True"},
            ),
        },
        "edge.edge": {
            "Meta": {"object_name": "Edge"},
            "fragment": (
                "django.db.models.fields.related.ForeignKey",
                [],
                {"to": "orm['edge.Fragment']", "on_delete": "models.PROTECT"},
            ),
            "from_chunk": (
                "django.db.models.fields.related.ForeignKey",
                [],
                {
                    "related_name": "'out_edges'",
                    "on_delete": "models.PROTECT",
                    "to": "orm['edge.Chunk']",
                },
            ),
            "id": (
                "django.db.models.fields.BigIntegerField",
                [],
                {"primary_key": "True"},
            ),
            "to_chunk": (
                "django.db.models.fields.related.ForeignKey",
                [],
                {
                    "related_name": "'in_edges'",
                    "null": "True",
                    "on_delete": "models.PROTECT",
                    "to": "orm['edge.Chunk']",
                },
            ),
        },
        "edge.feature": {
            "Meta": {"object_name": "Feature"},
            "_qualifiers": (
                "django.db.models.fields.TextField",
                [],
                {"null": "True", "db_column": "'qualifiers'"},
            ),
            u"id": ("django.db.models.fields.AutoField", [], {"primary_key": "True"}),
            "length": ("django.db.models.fields.IntegerField", [], {}),
            "name": ("django.db.models.fields.CharField", [], {"max_length": "100"}),
            "operation": (
                "django.db.models.fields.related.ForeignKey",
                [],
                {"to": "orm['edge.Operation']", "null": "True"},
            ),
            "strand": ("django.db.models.fields.IntegerField", [], {"null": "True"}),
            "type": ("django.db.models.fields.CharField", [], {"max_length": "100"}),
        },
        "edge.fragment": {
            "Meta": {"object_name": "Fragment"},
            "active": ("django.db.models.fields.BooleanField", [], {"default": "True"}),
            "circular": ("django.db.models.fields.BooleanField", [], {}),
            "created_on": (
                "django.db.models.fields.DateTimeField",
                [],
                {"auto_now_add": "True", "null": "True", "blank": "True"},
            ),
            "est_length": (
                "django.db.models.fields.IntegerField",
                [],
                {"null": "True", "blank": "True"},
            ),
            u"id": ("django.db.models.fields.AutoField", [], {"primary_key": "True"}),
            "name": ("django.db.models.fields.CharField", [], {"max_length": "256"}),
            "parent": (
                "django.db.models.fields.related.ForeignKey",
                [],
                {
                    "to": "orm['edge.Fragment']",
                    "null": "True",
                    "on_delete": "models.PROTECT",
                },
            ),
            "start_chunk": (
                "django.db.models.fields.related.ForeignKey",
                [],
                {
                    "to": "orm['edge.Chunk']",
                    "null": "True",
                    "on_delete": "models.PROTECT",
                },
            ),
        },
        "edge.fragment_chunk_location": {
            "Meta": {
                "unique_together": "(('fragment', 'chunk'),)",
                "object_name": "Fragment_Chunk_Location",
                "index_together": "(('fragment', 'base_last'), ('fragment', 'base_first'))",
            },
            "base_first": ("django.db.models.fields.IntegerField", [], {}),
            "base_last": ("django.db.models.fields.IntegerField", [], {}),
            "chunk": (
                "django.db.models.fields.related.ForeignKey",
                [],
                {"to": "orm['edge.Chunk']", "on_delete": "models.PROTECT"},
            ),
            "fragment": (
                "django.db.models.fields.related.ForeignKey",
                [],
                {"to": "orm['edge.Fragment']", "on_delete": "models.PROTECT"},
            ),
            "id": (
                "django.db.models.fields.BigIntegerField",
                [],
                {"primary_key": "True"},
            ),
        },
        "edge.fragment_index": {
            "Meta": {"object_name": "Fragment_Index"},
            "fragment": (
                "django.db.models.fields.related.OneToOneField",
                [],
                {"to": "orm['edge.Fragment']", "unique": "True"},
            ),
            "fresh": ("django.db.models.fields.BooleanField", [], {}),
            u"id": ("django.db.models.fields.AutoField", [], {"primary_key": "True"}),
            "updated_on": (
                "django.db.models.fields.DateTimeField",
                [],
                {"null": "True"},
            ),
        },
        "edge.genome": {
            "Meta": {"object_name": "Genome"},
            "active": ("django.db.models.fields.BooleanField", [], {"default": "True"}),
            "created_on": (
                "django.db.models.fields.DateTimeField",
                [],
                {"auto_now_add": "True", "null": "True", "blank": "True"},
            ),
            "fragments": (
                "django.db.models.fields.related.ManyToManyField",
                [],
                {
                    "to": "orm['edge.Fragment']",
                    "through": "orm['edge.Genome_Fragment']",
                    "symmetrical": "False",
                },
            ),
            u"id": ("django.db.models.fields.AutoField", [], {"primary_key": "True"}),
            "name": ("django.db.models.fields.CharField", [], {"max_length": "256"}),
            "notes": (
                "django.db.models.fields.TextField",
                [],
                {"null": "True", "blank": "True"},
            ),
            "operations": (
                "django.db.models.fields.related.ManyToManyField",
                [],
                {"to": "orm['edge.Operation']", "symmetrical": "False"},
            ),
            "parent": (
                "django.db.models.fields.related.ForeignKey",
                [],
                {
                    "related_name": "'children'",
                    "null": "True",
                    "on_delete": "models.PROTECT",
                    "to": "orm['edge.Genome']",
                },
            ),
        },
        "edge.genome_fragment": {
            "Meta": {"object_name": "Genome_Fragment"},
            "fragment": (
                "django.db.models.fields.related.ForeignKey",
                [],
                {"to": "orm['edge.Fragment']"},
            ),
            "genome": (
                "django.db.models.fields.related.ForeignKey",
                [],
                {"to": "orm['edge.Genome']"},
            ),
            u"id": ("django.db.models.fields.AutoField", [], {"primary_key": "True"}),
            "inherited": ("django.db.models.fields.BooleanField", [], {}),
        },
        "edge.operation": {
            "Meta": {"object_name": "Operation"},
            u"id": ("django.db.models.fields.AutoField", [], {"primary_key": "True"}),
            "notes": (
                "django.db.models.fields.TextField",
                [],
                {"null": "True", "blank": "True"},
            ),
            "params": (
                "django.db.models.fields.TextField",
                [],
                {"null": "True", "blank": "True"},
            ),
            "type": ("django.db.models.fields.IntegerField", [], {}),
        },
    }

    complete_apps = ["edge"]
