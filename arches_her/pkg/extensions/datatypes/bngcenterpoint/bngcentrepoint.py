from arches.app.datatypes.base import BaseDataType
from arches.app.models.models import Widget
from arches.app.models.system_settings import settings

bngpoint = Widget.objects.get(name="bngpoint")

details = {
    'datatype': 'bngcentrepoint',
    'iconclass': 'fa fa-location-arrow',
    'modulename': 'bngcentrepoint.py',
    'classname': 'BNGCentreDataType',
    'defaultwidget': bngpoint,
    'defaultconfig': None,
    'configcomponent': None,
    'configname': None,
    'isgeometric': False,
    'issearchable': False
}

class BNGCentreDataType(BaseDataType):


    def validate(self, value, row_number=None, source=None):

        errors = []
        gridSquareArray = ["HP","HT","HU","HW","HX","HY","HZ","NA","NB","NC","ND","NF","NG","NH","NJ","NK","NL", "NM","NN","NO","NR","NS","NT","NU","NW","NX","NY","NZ","SC","SD","SE","SH","SJ","SK","SM","SN","SO","SP","SR","SS","ST","SU","SV","SW","SX","SY","SZ","TA","TF","TG","TL","TM","TQ","TR","TV"]
        try:
            # CS - Validation for datatype.  Replicates functionality in widget which will be removed once datatype validation is fixed.
            firstTwoCharacters =  value[0:2]
            numberElement = value[2:]

            firstTwoCharacters in gridSquareArray
            isinstance(int(numberElement),int)
            len(value) == 12
        except KeyError:
            errors.append({
                'type':'ERROR',
                'message': 'Issue with input data'
            })

        return errors 

    def default_es_mapping(self):
            bng_mapping = {"type": "text", "fields": {"keyword": {"ignore_above": 256, "type": "keyword"}}}
            return bng_mapping

    def append_to_document(self, document, nodevalue, nodeid, tile):

        document['strings'].append({
            'string': nodevalue,
            'nodegroup_id': tile.nodegroup_id
            })

    def get_search_terms(self, nodevalue, nodeid=None):
        return [
            nodevalue
        ]