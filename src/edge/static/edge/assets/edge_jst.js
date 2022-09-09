window.JST = window.JST || {};
var template = function(str){var fn = new Function('obj', 'var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push(\''+str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/<%=([\s\S]+?)%>/g,function(match,code){return "',"+code.replace(/\\'/g, "'")+",'";}).replace(/<%([\s\S]+?)%>/g,function(match,code){return "');"+code.replace(/\\'/g, "'").replace(/[\r\n\t]/g,' ')+"__p.push('";}).replace(/\r/g,'\\r').replace(/\n/g,'\\n').replace(/\t/g,'\\t')+"');}return __p.join('');");return fn;};
window.JST['blast-results'] = template("<table class=\"table table-condensed table-bordered\">\n  <tr class=\"success\">\n    <th>Query</th>\n    <th>Fragment</th>\n    <th>e-value</th>\n    <th>Alignment</th>\n  </tr>\n\n  <tr ng-repeat=\"hit in blast_results\">\n    <td>Query {{ hit.query_start }}-{{ hit.query_end }}</td>\n    <td>\n      {{ hit.hit_def }}\n      <a\n        href=\"#/genomes/{{ genome.id }}/fragments/{{ hit.fragment_id }}?bp={{ hit.subject_start }}\"\n        >{{ hit.subject_start }}-{{ hit.subject_end }}</a\n      >\n    </td>\n    <td>{{ hit.evalue.toExponential(4) }}</td>\n    <td>\n      <div class=\"alignment\">\n        <div>{{ hit.alignment.subject }}</div>\n        <div>{{ hit.alignment.matchi }}</div>\n        <div>{{ hit.alignment.query }}</div>\n      </div>\n    </td>\n  </tr>\n</table>\n");
window.JST['fragment-annotation-list'] = template("<div class=\"well\" ng-show=\"annotate_error\">\n  <span class=\"text-danger\">Error: {{ annotate_error.message }}</span>\n</div>\n\n<form class=\"form-inline\" role=\"form\">\n  From\n  <div class=\"form-group\">\n    <input\n      required\n      class=\"form-control\"\n      type=\"text\"\n      ng-model=\"annotation.base_first\"\n      size=\"6\"\n      placeholder=\"Bp\"\n    />\n  </div>\n  To\n  <div class=\"form-group\">\n    <input\n      required\n      class=\"form-control\"\n      type=\"text\"\n      ng-model=\"annotation.base_last\"\n      size=\"6\"\n      placeholder=\"Bp\"\n    />\n  </div>\n  <div class=\"form-group space-left-small\">\n    <select\n      required\n      class=\"form-control select-mini\"\n      ng-model=\"annotation.strand\"\n    >\n      <option value=\"1\">Fwd</option>\n      <option value=\"-1\">Rev</option>\n    </select>\n  </div>\n  <div class=\"form-group space-left-small\">\n    <input\n      required\n      class=\"form-control\"\n      type=\"text\"\n      ng-model=\"annotation.name\"\n      size=\"8\"\n      placeholder=\"Name\"\n    />\n  </div>\n  <div class=\"form-group space-left-small\">\n    <button class=\"btn btn-primary\" ng-click=\"addAnnotation(annotation)\">\n      Annotate\n    </button>\n  </div>\n</form>\n\n<div class=\"space-top annotation-control\">\n  <div class=\"input-group\">\n    <span class=\"input-group-addon\"> Search: </span>\n    <input ng-model=\"query\" class=\"form-control\" />\n    <span class=\"input-group-addon\"> Sort by: </span>\n    <select ng-model=\"annotationOrderProp\" class=\"form-control\">\n      <option value=\"base_first\">Position</option>\n      <option value=\"name\">Alphabetical</option>\n    </select>\n  </div>\n</div>\n\n<div ng-if=\"display_summary == false || (query && query.length >= 2)\">\n  <table class=\"table table-striped table-condensed\">\n    <thead>\n      <tr>\n        <th>Start</th>\n        <th>End</th>\n        <th>Name</th>\n        <th>Type</th>\n        <th>Strand</th>\n      </tr>\n    </thead>\n    <tr\n      ng-repeat=\"annotation in zoom.annotations | filter:query | orderBy:annotationOrderProp\"\n    >\n      <td>{{ annotation.base_first }}</td>\n      <td>{{ annotation.base_last }}</td>\n      <td>\n        <a\n          class=\"fs-block\"\n          href=\"javascript:void(0);\"\n          ng-click=\"zoomAt(annotation)\"\n          title=\"{{ annotation.formatted_qualifiers }}\"\n          >{{ annotation.display_name }}</a\n        >\n      </td>\n      <td>{{ annotation.type }}</td>\n      <td>{{ annotation.strand }}</td>\n    </tr>\n  </table>\n</div>\n");
window.JST['fragment-detail'] = template("<header>\n  <div class=\"container\">\n    <ol class=\"breadcrumb\">\n      <li>Edge</li>\n      <li><a href=\"#/fragments\">Fragments</a></li>\n      <li class=\"fs-block\" ng-bind-html=\"fragment.name\"></li>\n    </ol>\n  </div>\n</header>\n\n<div class=\"container container-wide\">\n  <h3>\n    <div class=\"dropdown pull-right\" ng-if=\"!genomes\">\n      <a\n        class=\"btn btn-default\"\n        href=\"javascript:void(0);\"\n        data-toggle=\"dropdown\"\n        >Operations <span class=\"caret\"></span\n      ></a>\n      <ul class=\"dropdown-menu\">\n        <li>\n          <a href=\"/admin/edge/fragment/{{ fragment.id }}/\"\n            >Edit Name, Status</a\n          >\n        </li>\n      </ul>\n    </div>\n\n    Fragment {{ fragment.id }}:\n    <span class=\"fs-block\" ng-bind-html=\"fragment.name\"></span>, {{\n    fragment.length | number }} bps\n  </h3>\n\n  <p ng-if=\"genomes\" class=\"lead space-top\">\n    <span ng-repeat=\"genome in genomes\">\n      Genome:\n      <a\n        class=\"fs-block\"\n        href=\"#/genomes/{{ genome.id }}\"\n        ng-bind-html=\"genome.name\"\n      ></a>\n      <br />\n    </span>\n  </p>\n\n  <partial template=\"fragment-layout\"></partial>\n</div>\n<!-- container -->\n");
window.JST['fragment-layout'] = template("<div class=\"row\">\n  <!-- left -->\n  <div class=\"col-md-7\">\n    <partial template=\"fragment-left\"></partial>\n    <div\n      ng-if=\"!fetchedAnnotations\"\n      class=\"progress progress-striped active space-top\"\n    >\n      <div\n        class=\"progress-bar\"\n        role=\"progressbar\"\n        aria-valuenow=\"45\"\n        aria-valuemin=\"0\"\n        aria-valuemax=\"100\"\n        style=\"width: 45%\"\n      >\n        <span class=\"sr-only\">45% Complete</span>\n      </div>\n    </div>\n  </div>\n  <!-- left -->\n\n  <!-- right -->\n  <div class=\"col-md-5\">\n    <partial template=\"fragment-annotation-list\"></partial>\n  </div>\n  <!-- right -->\n</div>\n<!-- row -->\n");
window.JST['fragment-left'] = template("<div ng-show=\"display_summary\">\n  <span\n    ng-repeat=\"annotation in summary_annotations | orderBy:base_first\"\n    class=\"pull-left {{ annotation.display_css }} fs-block\"\n    ng-click=\"zoomAt(annotation)\"\n    title=\"bp {{ annotation.base_first | number }}\"\n  >\n    {{ annotation.display_name }}\n  </span>\n  <div class=\"clearfix\"></div>\n  <div ng-if=\"fragment.length < 10000\">\n    <button class=\"btn btn-primary\" ng-click=\"fetchAllSequence()\">\n      Show Sequence\n    </button>\n    <textarea class=\"sequence fs-block\" readonly ng-if=\"sequence\">\n{{ sequence.sequence }}</textarea\n    >\n  </div>\n</div>\n\n<div ng-show=\"display_summary == false\">\n  <form class=\"form-inline bp-control\">\n    <button class=\"btn btn-default\" ng-click=\"zoomOut()\">\n      <span class=\"glyphicon glyphicon-zoom-out\"></span>\n    </button>\n\n    <button class=\"btn btn-default\" ng-click=\"zoomMoveLeft()\">\n      <span class=\"glyphicon glyphicon-arrow-left\"></span>\n    </button>\n\n    Bps:\n    <div class=\"form-group\">\n      <input\n        class=\"form-control\"\n        type=\"text\"\n        ng-model=\"zoom.base_first\"\n        size=\"6\"\n        ng-change=\"updateBaseInput()\"\n      />\n    </div>\n    <div class=\"form-group\">\n      <input\n        class=\"form-control\"\n        type=\"text\"\n        ng-model=\"zoom.base_last\"\n        size=\"6\"\n        ng-change=\"updateBaseInput()\"\n      />\n    </div>\n    <button class=\"btn btn-default\" ng-click=\"userGoto()\">Go</button>\n\n    <button class=\"btn btn-default\" ng-click=\"zoomMoveRight()\">\n      <span class=\"glyphicon glyphicon-arrow-right\"></span>\n    </button>\n\n    <button class=\"btn btn-default\" ng-click=\"zoomIn()\">\n      <span class=\"glyphicon glyphicon-zoom-in\"></span>\n    </button>\n\n    <button class=\"btn btn-default\" ng-click=\"showSummary()\">\n      <span class=\"glyphicon glyphicon-fullscreen\"></span>\n    </button>\n  </form>\n\n  <div class=\"zoom-container\">\n    <span\n      ng-repeat=\"display in zoom.display\"\n      class=\"{{ display.css }} fs-block\"\n      style=\"left:{{ display.left }}; top:{{ display.top }}; width:{{ display.width }};\"\n      ng-click=\"zoomAtExact(display.annotation)\"\n      title=\"{{ display.formatted_qualifiers }}\"\n    >\n      {{ display.title }}\n    </span>\n  </div>\n\n  <div class=\"clearfix\"></div>\n\n  <div class=\"sequence-container\">\n    <button class=\"btn btn-primary\" ng-click=\"fetchSequence()\">\n      Show Sequence\n    </button>\n    <div class=\"fs-block\" ng-show=\"zoom.has_sequence\">\n      <div id=\"sequence-viewer\"></div>\n    </div>\n  </div>\n</div>\n");
window.JST['fragment-list'] = template("<partial template=\"header\"></partial>\n\n<div class=\"container\">\n  <p class=\"lead\">Fragments</p>\n\n  <p>\n    Define an insertion cassette as a fragment first, annotate the fragment,\n    then easily insert the fragment into a genome.\n  </p>\n\n  <div class=\"well\">\n    <div class=\"input-group\">\n      <span class=\"input-group-addon\"> Search: </span>\n      <input ng-model=\"query\" class=\"form-control\" ng-change=\"delayFetch()\" />\n    </div>\n  </div>\n\n  <div class=\"pull-right\">\n    <button\n      class=\"btn btn-primary btn-xs\"\n      ng-if=\"hasPrev\"\n      ng-click=\"prevPage()\"\n    >\n      Prev Page\n    </button>\n    &nbsp;\n    <button\n      class=\"btn btn-primary btn-xs\"\n      ng-if=\"hasMore\"\n      ng-click=\"nextPage()\"\n    >\n      Next Page\n    </button>\n  </div>\n\n  <table class=\"table table-striped table-condensed\">\n    <thead>\n      <tr>\n        <th>ID</th>\n        <th>Name</th>\n        <th>Length</th>\n      </tr>\n    </thead>\n    <tr ng-repeat=\"fragment in fragments\">\n      <td><a href=\"#/fragments/{{fragment.id}}\">{{ fragment.id }}</a></td>\n      <td>\n        <a class=\"fs-block\" href=\"#/fragments/{{fragment.id}}\"\n          >{{ fragment.name }}</a\n        >\n      </td>\n      <td>{{ fragment.length }}</td>\n    </tr>\n  </table>\n\n  <p class=\"lead space-top\">\n    Add new fragment\n  </p>\n\n  <div class=\"well\" ng-show=\"add_fragment_error\">\n    <span class=\"text-danger\">Error: {{ add_fragment_error.message }}</span>\n  </div>\n\n  <form role=\"form\">\n    <div class=\"form-group\">\n      <label for=\"fragment_name\">Name:</label>\n      <input\n        class=\"fs-block\"\n        id=\"fragment_name\"\n        type=\"text\"\n        ng-model=\"fragment.name\"\n      />\n    </div>\n    <div class=\"form-group\">\n      <label for=\"fragment_sequence\">Sequence:</label><br />\n      <textarea\n        id=\"fragment_sequence\"\n        class=\"sequence\"\n        ng-model=\"fragment.sequence\"\n      ></textarea>\n    </div>\n    <button class=\"btn btn-primary\" ng-click=\"addFragment(fragment)\">\n      Create Fragment\n    </button>\n  </form>\n</div>\n<!-- container -->\n");
window.JST['genome-blast'] = template("<header>\n  <div class=\"container\">\n    <ol class=\"breadcrumb\">\n      <li>Edge</li>\n      <li><a href=\"#/genomes\">Genomes</a></li>\n      <li>\n        <a class=\"fs-block\" href=\"#/genomes/{{ genome.id }}\"\n          ><span ng-bind-html=\"genome.name\"></span\n        ></a>\n      </li>\n      <li>Blast</li>\n    </ol>\n  </div>\n</header>\n\n<div class=\"container\">\n  <h3>\n    BLAST on Genome {{ genome.id }}:\n    <span class=\"fs-block\" ng-bind-html=\"genome.name\"></span>\n  </h3>\n\n  <div\n    role=\"form\"\n    id=\"blast-inputs\"\n    class=\"space-top\"\n    ng-init=\"program = 'blastn'\"\n  >\n    <div class=\"form-inline\">\n      Program\n      <div class=\"form-group\">\n        <select class=\"form-control\" ng-model=\"program\">\n          <option value=\"blastn\">blastn</option>\n          <option value=\"tblastn\">tblastn</option>\n        </select>\n      </div>\n    </div>\n    Query\n    <br />\n    <textarea class=\"form-control sequence\" ng-model=\"query\"></textarea>\n    <button class=\"btn btn-primary\" ng-click=\"Blast(query, program)\">\n      BLAST\n    </button>\n  </div>\n\n  <div ng-if=\"waiting === true\">\n    <p>\n      <br />\n      <em>Waiting for server to respond ...</em>\n      <br />\n    </p>\n  </div>\n\n  <div ng-if=\"results\" class=\"space-top\">\n    <partial template=\"blast-results\" ng-init=\"blast_results=results\"></partial>\n  </div>\n</div>\n");
window.JST['genome-detail'] = template("<header>\n  <div class=\"container\">\n    <ol class=\"breadcrumb\">\n      <li>Edge</li>\n      <li><a href=\"#/genomes\">Genomes</a></li>\n      <li class=\"fs-block\" ng-bind-html=\"genome.name\"></li>\n    </ol>\n  </div>\n</header>\n\n<div class=\"container\">\n  <h3>\n    <div class=\"dropdown pull-right\">\n      <a\n        class=\"btn btn-default\"\n        href=\"javascript:void(0);\"\n        data-toggle=\"dropdown\"\n        >Operations <span class=\"caret\"></span\n      ></a>\n      <ul class=\"dropdown-menu\">\n        <li><a href=\"#/genomes/{{ genome.id }}/blast\">Blast</a></li>\n        <li><a href=\"#/genomes/{{ genome.id }}/pcr\">PCR</a></li>\n        <li>\n          <a href=\"#/genomes/{{ genome.id }}/recombination\">Recombination</a>\n        </li>\n        <li class=\"divider\"></li>\n        <li>\n          <a href=\"/admin/edge/genome/{{ genome.id }}/\">Edit Name, Status</a>\n        </li>\n        <li>\n          <a href=\"/edge/genomes/{{ genome.id }}/export-fasta\">Export to Fasta</a>\n        </li>\n        <li>\n          <a href=\"/edge/genomes/{{ genome.id }}/export-gff\">Export to GFF</a>\n        </li>\n      </ul>\n    </div>\n\n    Genome {{ genome.id }}:\n    <span class=\"fs-block\" ng-bind-html=\"genome.name\"></span>\n  </h3>\n\n  <div class=\"lead space-top\">\n    <p>Parent: <span class=\"fs-block\" ng-bind-html=\"parent\"></span></p>\n    <p ng-if=\"genome.notes\">Notes: {{ genome.notes }}</p>\n  </div>\n\n  <div ng-if=\"genome.operations\">\n    <p class=\"lead\">History:</p>\n    <div ng-repeat=\"op in genome.operations\">\n      <p>\n        {{ op.type }} on\n        <a class=\"fs-block\" href=\"#/genomes/{{genome.parent_id}}\"\n          >Genome {{ genome.parent_id }}: {{ genome.parent_name }}</a\n        >\n      </p>\n      <ul>\n        <li ng-repeat=\"a in op.annotations\">\n          <a href=\"#/genomes/{{genome.id}}/fragments/{{a.fragment_id}}\"\n            >{{ a.fragment_name }}: {{ a.name }} [{{ a.base_first }}, {{\n            a.base_last }}]</a\n          >\n        </li>\n        <li ng-repeat=\"(k,v) in op.params\" class=\"op-params fs-block\">\n          {{ k }}: {{ v }}\n        </li>\n      </ul>\n    </div>\n  </div>\n\n  <table class=\"table table-striped table-condensed space-top\">\n    <thead>\n      <tr>\n        <th>Fragment</th>\n        <th>Length (bps)</th>\n        <th>Changes</th>\n      </tr>\n    </thead>\n    <tr ng-repeat=\"fragment in genome.fragments | orderBy:id\">\n      <td>\n        <a\n          class=\"fs-block\"\n          href=\"#/genomes/{{genome.id}}/fragments/{{fragment.id}}\"\n          ng-bind-html=\"fragment.name\"\n        ></a>\n      </td>\n      <td>\n        <span ng-if=\"fragment.length\">{{fragment.length | number}}</span>\n        <span ng-if=\"!fragment.length\"><em>Not indexed</em></span>\n      </td>\n      <td>\n        <span ng-repeat=\"op in genome.operations\">\n          <span ng-repeat=\"annotation in op.annotations\">\n            <span ng-if=\"annotation.fragment_id === fragment.id\">\n              {{ annotation.base_first }}-{{ annotation.base_last }}\n            </span>\n          </span>\n        </span>\n      </td>\n    </tr>\n  </table>\n</div>\n<!-- container -->\n");
window.JST['genome-fragment-layout'] = template("<div class=\"row\">\n  <!-- left -->\n  <div class=\"col-md-7\">\n    <partial template=\"fragment-left\"></partial>\n  </div>\n  <!-- left -->\n\n  <!-- right -->\n  <div class=\"col-md-5\">\n    <partial template=\"fragment-annotation-list\"></partial>\n  </div>\n  <!-- right -->\n</div>\n<!-- row -->\n");
window.JST['genome-fragment'] = template("<header>\n  <div class=\"container container-wide\">\n    <ol class=\"breadcrumb\">\n      <li>Edge</li>\n      <li><a href=\"#/genomes\">Genomes</a></li>\n      <li>\n        <a\n          class=\"fs-block\"\n          href=\"#/genomes/{{ genome.id }}\"\n          ng-bind-html=\"genome.name\"\n        ></a>\n      </li>\n      <li class=\"fs-block\" ng-bind-html=\"fragment.name\"></li>\n    </ol>\n  </div>\n</header>\n\n<div class=\"container container-wide\">\n  <h3>\n    Fragment {{ fragment.id }}:\n    <span class=\"fs-block\" ng-bind-html=\"fragment.name\"></span>, {{\n    fragment.length | number }} bps\n  </h3>\n\n  <div class=\"lead space-top\">\n    <p>\n      Genome:\n      <a\n        class=\"fs-block\"\n        href=\"#/genomes/{{ genome.id }}\"\n        ng-bind-html=\"genome.name\"\n      ></a>\n    </p>\n    <p>\n      Changes:\n      <span ng-repeat=\"op in genome.operations\">\n        <span ng-repeat=\"annotation in op.annotations\">\n          <span ng-if=\"annotation.fragment_id === fragment.id\">\n            <a href=\"javascript:void(0);\" ng-click=\"zoomAt(annotation)\"\n              >{{ annotation.name }} ({{ annotation.base_first }}-{{\n              annotation.base_last }})</a\n            >\n          </span>\n        </span>\n      </span>\n    </p>\n  </div>\n\n  <partial template=\"genome-fragment-layout\"></partial>\n</div>\n<!-- container -->\n");
window.JST['genome-list'] = template("<partial template=\"header\"></partial>\n\n<div class=\"container\">\n  <p class=\"lead\">Genomes</p>\n\n  <div class=\"well\">\n    <div class=\"input-group\">\n      <span class=\"input-group-addon\"> Search: </span>\n      <input class=\"form-control\" ng-model=\"query\" ng-change=\"delayFetch()\" />\n    </div>\n  </div>\n\n  <div class=\"pull-right\">\n    <button\n      class=\"btn btn-primary btn-xs\"\n      ng-if=\"hasPrev\"\n      ng-click=\"prevPage()\"\n    >\n      Prev Page\n    </button>\n    &nbsp;\n    <button\n      class=\"btn btn-primary btn-xs\"\n      ng-if=\"hasMore\"\n      ng-click=\"nextPage()\"\n    >\n      Next Page\n    </button>\n  </div>\n\n  <table class=\"table table-striped table-condensed\">\n    <thead>\n      <tr>\n        <th>ID</th>\n        <th>Name</th>\n        <th>Parent</th>\n      </tr>\n    </thead>\n    <tr ng-repeat=\"genome in genomes\">\n      <td><a href=\"#/genomes/{{genome.id}}\">{{ genome.id }}</a></td>\n      <td>\n        <a\n          class=\"fs-block\"\n          href=\"#/genomes/{{genome.id}}\"\n          ng-bind-html=\"genome.name\"\n        ></a>\n      </td>\n      <td>\n        <a\n          class=\"fs-block\"\n          href=\"#/genomes/{{genome.parent_id}}\"\n          ng-bind-html=\"genome.parent_name\"\n        ></a>\n      </td>\n    </tr>\n  </table>\n</div>\n<!-- container -->\n");
window.JST['genome-pcr'] = template("<header>\n  <div class=\"container\">\n    <ol class=\"breadcrumb\">\n      <li>Edge</li>\n      <li><a href=\"#/genomes\">Genomes</a></li>\n      <li>\n        <a href=\"#/genomes/{{ genome.id }}\"\n          ><span class=\"fs-block\" ng-bind-html=\"genome.name\"></span\n        ></a>\n      </li>\n      <li>PCR</li>\n    </ol>\n  </div>\n</header>\n\n<div class=\"container\">\n  <h3>\n    PCR on Genome {{ genome.id }}:\n    <span class=\"fs-block\" ng-bind-html=\"genome.name\"></span>\n  </h3>\n\n  <form role=\"form\" class=\"space-top\">\n    <div class=\"form-inline\">\n      Primers\n      <div class=\"form-group\">\n        <input\n          required\n          class=\"form-control\"\n          type=\"text\"\n          ng-model=\"primer_a\"\n          size=\"40\"\n        />\n      </div>\n      and\n      <div class=\"form-group\">\n        <input\n          required\n          class=\"form-control\"\n          type=\"text\"\n          ng-model=\"primer_b\"\n          size=\"40\"\n        />\n      </div>\n      <button class=\"btn btn-primary\" ng-click=\"Pcr(primer_a, primer_b)\">\n        PCR\n      </button>\n    </div>\n  </form>\n\n  <div ng-if=\"results\" class=\"space-top\">\n    <div ng-if=\"results[0]\">\n      <p>\n        <span class=\"label label-success\"\n          >PCR Product: {{ results[0].length }} bps</span\n        >\n      </p>\n      <div class=\"sequence sequence-break\">{{ results[0] }}</div>\n      <p>\n        Genomic region amplified:\n        <a\n          class=\"fs-block\"\n          href=\"#/genomes/{{ genome.id }}/fragments/{{ results[3].fragment_id }}?bp={{ results[3].region[0] }},{{ results[3].region[1] }}\"\n          >{{ results[3].fragment_name }} {{ results[3].region[0] }}-{{\n          results[3].region[1] }}</a\n        >\n      </p>\n    </div>\n\n    <div ng-if=\"!results[0]\">\n      <p>\n        <span class=\"label label-danger\"\n          >Cannot compute PCR product. Too many or too few binding sites.</span\n        >\n      </p>\n    </div>\n\n    <partial\n      template=\"blast-results\"\n      ng-init=\"blast_results=results[1].concat(results[2])\"\n    ></partial>\n  </div>\n</div>\n");
window.JST['genome-recombination'] = template("<header>\n  <div class=\"container\">\n    <ol class=\"breadcrumb\">\n      <li>Edge</li>\n      <li><a href=\"#/genomes\">Genomes</a></li>\n      <li>\n        <a href=\"#/genomes/{{ genome.id }}\"\n          ><span class=\"fs-block\" ng-bind-html=\"genome.name\"></span\n        ></a>\n      </li>\n      <li>Recombination</li>\n    </ol>\n  </div>\n</header>\n\n<div class=\"container\">\n  <h3>\n    Recombination on Genome {{ genome.id }}:\n    <span class=\"fs-block\" ng-bind-html=\"genome.name\"></span>\n  </h3>\n\n  <form role=\"form\" class=\"space-top\" id=\"recombine-inputs\">\n    <div class=\"form-inline\">\n      Homology arm length\n      <div class=\"form-group\">\n        <input\n          required\n          class=\"form-control\"\n          type=\"text\"\n          ng-model=\"homology_arm_length\"\n          size=\"5\"\n        />\n      </div>\n      New genome name\n      <div class=\"form-group\">\n        <input\n          required\n          class=\"form-control fs-block\"\n          type=\"text\"\n          ng-model=\"new_genome_name\"\n          size=\"20\"\n        />\n      </div>\n    </div>\n    Cassette (including homology arms)\n    <br />\n    <textarea\n      class=\"form-control sequence fs-block\"\n      ng-model=\"cassette\"\n    ></textarea>\n    <button class=\"btn btn-primary\" ng-click=\"FindRegions()\">Preview</button>\n  </form>\n\n  <div id=\"recombine-primer3-opts\" class=\"space-top\">\n    <p>\n      Primer3 params (for verification primers)\n    </p>\n\n    <table class=\"table table-condensed\">\n      <tr>\n        <td>OPT_SIZE:</td>\n        <td><input ng-model=\"primer3_opts.PRIMER_OPT_SIZE\" /></td>\n        <td>MIN_SIZE:</td>\n        <td><input ng-model=\"primer3_opts.PRIMER_MIN_SIZE\" /></td>\n        <td>MAX_SIZE:</td>\n        <td><input ng-model=\"primer3_opts.PRIMER_MAX_SIZE\" /></td>\n      </tr>\n      <tr>\n        <td>OPT_TM:</td>\n        <td><input ng-model=\"primer3_opts.PRIMER_OPT_TM\" /></td>\n        <td>MIN_TM:</td>\n        <td><input ng-model=\"primer3_opts.PRIMER_MIN_TM\" /></td>\n        <td>MAX_TM:</td>\n        <td><input ng-model=\"primer3_opts.PRIMER_MAX_TM\" /></td>\n      </tr>\n      <tr>\n        <td>MIN_GC:</td>\n        <td><input ng-model=\"primer3_opts.PRIMER_MIN_GC\" /></td>\n        <td>MAX_GC:</td>\n        <td><input ng-model=\"primer3_opts.PRIMER_MAX_GC\" /></td>\n      </tr>\n      <tr>\n        <td>SALT_MONOVALENT:</td>\n        <td><input ng-model=\"primer3_opts.PRIMER_SALT_MONOVALENT\" /></td>\n        <td>DNA_CONC nM:</td>\n        <td><input ng-model=\"primer3_opts.PRIMER_DNA_CONC\" /></td>\n      </tr>\n    </table>\n  </div>\n\n  <div class=\"clearfix\"></div>\n\n  <div ng-if=\"waiting === true\">\n    <p>\n      <br />\n      <em>Waiting for server to respond ...</em>\n      <br />\n    </p>\n  </div>\n\n  <div ng-if=\"regions !== undefined\" class=\"results\">\n    <p ng-if=\"regions.length === 0\"><em>No matching region</em></p>\n    <div ng-if=\"regions.length > 0\">\n      <div ng-repeat=\"region in regions\" class=\"recombine-candidate\">\n        <h5>\n          Found integration region on fragment\n          <a\n            class=\"fs-block\"\n            href=\"#/genomes/{{ genome.id }}/fragments/{{ region.fragment_id }}?bp={{ region.start }},{{ region.end }}\"\n            >{{ region.fragment_name }}: {{ region.start }}-{{ region.end }}</a\n          >\n          Post integration region length: {{ region.cassette.length }} bps\n          <span ng-if=\"region.cassette_reversed\">\n            (cassette will be integrated in reverse direction)\n          </span>\n        </h5>\n\n        <div ng-if=\"region.verification_front.length > 0\" class=\"primers\">\n          <p>\n            PCR primers to verify 5' junction\n            <br />\n            (product on modified genome only, no product on WT)\n          </p>\n          <ul>\n            <li ng-repeat=\"primer in region.verification_front\">\n              <partial template=\"primer\" />\n            </li>\n          </ul>\n        </div>\n        <div ng-if=\"region.verification_back.length > 0\" class=\"primers\">\n          <p>\n            PCR primers to verify 3' junction\n            <br />\n            (product on modified genome only, no product on WT)\n          </p>\n          <ul>\n            <li ng-repeat=\"primer in region.verification_back\">\n              <partial template=\"primer\" />\n            </li>\n          </ul>\n        </div>\n        <div ng-if=\"region.verification_cassette.length > 0\" class=\"primers\">\n          <p>\n            PCR primers to verify whole cassette\n            <br />\n            (product on modified genome and WT)\n          </p>\n          <ul>\n            <li ng-repeat=\"primer in region.verification_cassette\">\n              <partial template=\"primer\" />\n            </li>\n          </ul>\n        </div>\n        <div ng-if=\"region.cassette_annotations.length > 0\">\n          <p>\n            Inherited and new annotations on cassette\n          </p>\n          <ul>\n            <li class=\"fs-block\" ng-repeat=\"a in region.cassette_annotations\">\n              {{ a.base_first }}-{{a.base_last }} bps on cassette, {{\n              a.feature_name }} ({{ a.feature_type }})\n              <span ng-if=\"a.feature_strand === -1\">reversed</span>\n            </li>\n          </ul>\n        </div>\n      </div>\n    </div>\n    <p ng-if=\"regions.length === 1\">\n      <button class=\"btn btn-primary\" ng-click=\"Recombine()\">\n        Create post-recombination genome\n      </button>\n    </p>\n  </div>\n</div>\n");
window.JST['header'] = template("<header>\n  <div class=\"container\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"#/\">Edge</a></li>\n      <li><a href=\"#/genomes\">Genomes</a></li>\n      <li><a href=\"#/fragments\">Fragments</a></li>\n      <li><a href=\"#/import\">Import</a></li>\n    </ol>\n  </div>\n</header>\n");
window.JST['import'] = template("<partial template=\"header\"></partial>\n\n<div class=\"container\">\n  <p class=\"lead\">Genomes Import</p>\n\n  <div class=\"well\" ng-show=\"addGenomeStatus.error\">\n    <span class=\"text-danger\">\n      Error: {{ addGenomeStatus.error }}\n    </span>\n  </div>\n\n  <div class=\"well\" ng-show=\"addGenomeStatus.pending\">\n    <span class=\"text-info\">\n      Pending: Importing Genome: {{ $scope.genome.name }}. It may take a few\n      minutes for large gff file. Please wait.\n    </span>\n  </div>\n\n  <div class=\"well\" ng-show=\"addGenomeStatus.results\">\n    <span\n      class=\"fs-block\"\n      class=\"text-success\"\n      ng-repeat=\"genome in addGenomeStatus.results.imported_genomes\"\n    >\n      Success: Added in Edge as\n      <a ng-href=\"#/genomes/{{ genome.id }}\"\n        >Genome {{ genome.id }}: {{ genome.name }}</a\n      >\n    </span>\n  </div>\n\n  <form name=\"userForm\" novalidate>\n    <div class=\"form-group\">\n      <label for=\"genomeName\">Genome Name:</label>\n      <input\n        class=\"fs-block\"\n        id=\"genomeName\"\n        name=\"name\"\n        type=\"text\"\n        ng-model=\"genome.name\"\n        required\n      />\n    </div>\n    <div class=\"form-group\">\n      <label for=\"gffFile\">GFF File (GFF3 format):</label><br />\n      <input id=\"gffFile\" type=\"file\" file-model=\"gffFile\" />\n    </div>\n    <button\n      class=\"btn btn-primary\"\n      type=\"submit\"\n      ng-disabled=\"userForm.$invalid\"\n      ng-click=\"addGenome()\"\n    >\n      Import\n    </button>\n  </form>\n</div>\n<!-- container -->\n");
window.JST['primer'] = template("Left: {{ primer.PRIMER_LEFT_SEQUENCE }} ({{ primer.PRIMER_LEFT_GC_PERCENT }} GC,\n{{ primer.PRIMER_LEFT_TM }} Tm<span\n  ng-if=\"primer.PRIMER_LEFT_SEQUENCE_DISTANCE_TO_JUNCTION\"\n  >, {{ primer.PRIMER_LEFT_SEQUENCE_DISTANCE_TO_JUNCTION }} bps to\n  junction</span\n>)\n<br />\nRight: {{ primer.PRIMER_RIGHT_SEQUENCE }} ({{ primer.PRIMER_RIGHT_GC_PERCENT }}\nGC, {{ primer.PRIMER_RIGHT_TM }} Tm<span\n  ng-if=\"primer.PRIMER_RIGHT_SEQUENCE_DISTANCE_TO_JUNCTION\"\n  >, {{ primer.PRIMER_RIGHT_SEQUENCE_DISTANCE_TO_JUNCTION }} bps to\n  junction</span\n>)\n");
