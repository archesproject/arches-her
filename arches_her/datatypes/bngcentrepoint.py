from arches.app.datatypes.base import BaseDataType
from arches.app.models.models import Widget
from arches.app.models.system_settings import settings

bngpoint = Widget.objects.get(name="bngpoint")

details = {
    "datatype": "bngcentrepoint",
    "iconclass": "fa fa-location-arrow",
    "modulename": "bngcentrepoint.py",
    "classname": "BNGCentreDataType",
    "defaultwidget": bngpoint,
    "defaultconfig": None,
    "configcomponent": None,
    "configname": None,
    "isgeometric": False,
    "issearchable": False,
}


class BNGCentreDataType(BaseDataType):
    def validate(self, value, row_number=None, source=None, node=None, nodeid=None, strict=False):

        errors = []
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
