from arches.app.views.api import APIBase
from arches.app.models.models import Node, TileModel
from arches.app.datatypes.datatypes import DataTypeFactory
from arches.app.utils.response import JSONResponse
from arches.app.models.resource import Resource


class DatatypeDocumentView(APIBase):

    def get(self, request, tileid, nodeid=''):
        document = {
            "resourceinstanceid": '',
            "graph_id": '',
            "map_popup": '',
            "displayname": '',
            "root_ontology_class": '',
            "legacyid": '',
            "displayname": [],
            "displaydescription": [],
            "tiles": [],
            "permissions": [],
            "strings": [],
            "dates": [],
            "domains": [],
            "geometries": [],
            "points": [],
            "numbers": [],
            "date": [],
            "ids": [],
        }

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
                    datatype_instance.append_to_document(document, value, nodeid, tile)
            except KeyError:
                pass
        return JSONResponse(document)


class ResourceDocumentView(APIBase):

    def get(self, request, resourceid):
        resource = Resource.objects.get(pk=resourceid)
        datatype_factory = DataTypeFactory()
        node_datatypes = {str(nodeid): datatype for nodeid, datatype in Node.objects.values_list("nodeid", "datatype")}
        document, terms = resource.get_documents_to_index(
            fetchTiles=True, datatype_factory=datatype_factory, node_datatypes=node_datatypes
        )
        return JSONResponse(document)
