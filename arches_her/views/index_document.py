from arches.app.views.api import APIBase
from arches.app.models.models import Node, TileModel
from arches.app.datatypes.datatypes import DataTypeFactory
from arches.app.utils.response import JSONResponse
from arches.app.models.resource import Resource

class IndexDocument():

    def __init__(self):
        self.resourceinstanceid = ''
        self.graph_id = ''
        self.map_popup = ''
        self.displayname = ''
        self.root_ontology_class = ''
        self.legacyid = ''
        self.displayname = []
        self.displaydescription = []
        self.tiles = []
        self.permissions = []
        self.strings = []
        self.dates = []
        self.domains = []
        self.geometries = []
        self.points = []
        self.numbers = []
        self.date = []
        self.ids = []


class DatatypeDocumentView(APIBase):

    def get(self, request, tileid, nodeid=''):
        document = IndexDocument()
        datatype_factory = DataTypeFactory()
        tile = TileModel.objects.get(pk=tileid)
        nodes = Node.objects.filter(nodegroup=tile.nodegroup)
        if nodeid is not '':
            nodes = nodes.filter(pk=nodeid)
        for node in nodes:
            datatype = node.datatype
            nodeid = str(node.pk)
            try:
                value = tile.data[nodeid]
                if value not in ("", [], {}, None):
                    datatype_instance = datatype_factory.get_instance(datatype)
                    datatype_instance.append_to_document(document.__dict__, value, nodeid, tile)
            except KeyError:
                pass
        return JSONResponse(document)


class ResourceDocumentView(APIBase):

    def get(self, request, resourceid):
        resource = Resource.objects.get(pk=resourceid)
        datatype_factory = DataTypeFactory()
        nodes = Node.objects.filter(graph_id=resource.graph_id)
        node_datatypes = {str(nodeid): datatype for nodeid, datatype in nodes.values_list("nodeid", "datatype")}
        document = resource.get_documents_to_index(
            fetchTiles=True, datatype_factory=datatype_factory, node_datatypes=node_datatypes
        )
        return JSONResponse(document)
