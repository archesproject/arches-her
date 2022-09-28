from arches.app.datatypes.base import BaseDataType
from arches.app.models.models import Widget
from arches.app.models.system_settings import settings
from arches.app.search.elasticsearch_dsl_builder import Match, Exists
import logging

bngpoint = Widget.objects.get(name="bngpoint")

details = {
    "datatype": "bngcentrepoint",
    "iconclass": "fa fa-location-arrow",
    "modulename": "bngcentrepoint.py",
    "classname": "BNGCentreDataType",
    "defaultwidget": bngpoint,
    "defaultconfig": None,
    "configcomponent": "views/components/datatypes/bngcentrepoint",
    "configname": "bngcentrepoint-datatype-config",
    "isgeometric": False,
    "issearchable": True,
}


class BNGCentreDataType(BaseDataType):
    def validate(self, value, row_number=None, source=None, node=None, nodeid=None, strict=False):

        errors = []
        if value is None:
            return errors
        
        gridSquareArray = [
            "NA",
            "NB",
            "NC",
            "ND",
            "NE",
            "NF",
            "NG",
            "NH",
            "NJ",
            "NK",
            "NL",
            "NM",
            "NN",
            "NO",
            "NP",
            "NR",
            "NS",
            "NT",
            "NU",
            "NV",
            "NW",
            "NX",
            "NY",
            "NZ",
            "OA",
            "OB",
            "OF",
            "OG",
            "OL",
            "OM",
            "OQ",
            "OR",
            "OV",
            "OW",
            "SA",
            "SB",
            "SC",
            "SD",
            "SE",
            "SF",
            "SG",
            "SH",
            "SJ",
            "SK",
            "SL",
            "SM",
            "SN",
            "SO",
            "SP",
            "SQ",
            "SR",
            "SS",
            "ST",
            "SU",
            "SV",
            "SW",
            "SX",
            "SY",
            "SZ",
            "TA",
            "TB",
            "TF",
            "TG",
            "TL",
            "TM",
            "TQ",
            "TR",
            "TV",
            "TW",
        ]
        try:
            # CS - Validation for datatype.  Replicates functionality in widget which will be removed once datatype validation is fixed.
            firstTwoCharacters = value[0:2]
            numberElement = value[2:]

            firstTwoCharacters in gridSquareArray
            isinstance(int(numberElement), int)
            len(value) == 12
        except Exception:
            errors.append({"type": "ERROR", "message": "Issue with input data"})

        return errors

    def append_to_document(self, document, nodevalue, nodeid, tile, provisional=False):

        document["strings"].append({"string": nodevalue, "nodegroup_id": tile.nodegroup_id})

    def get_search_terms(self, nodevalue, nodeid=None):
        return [nodevalue]

    def append_search_filters(self, value, node, query, request):
        self.logger = logging.getLogger(__name__)
        try:
            if value["op"] == "null" or value["op"] == "not_null":
                self.append_null_search_filters(value, node, query, request)
            elif value["val"] != "":
                match_type = "phrase_prefix" if "~" in value["op"] else "phrase"
                match_query = Match(field="tiles.data.%s" % (str(node.pk)), query=value["val"], type=match_type)
                if "!" in value["op"]:
                    query.must_not(match_query)
                    query.filter(Exists(field="tiles.data.%s" % (str(node.pk))))
                else:
                    query.must(match_query)
        except KeyError as e:
            self.logger.error(str(e))

