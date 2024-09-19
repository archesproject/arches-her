from arches.app.views.api import APIBase
from arches.app.models.models import Node, TileModel
from arches.app.datatypes.datatypes import DataTypeFactory
from arches.app.utils.response import JSONResponse


class DatatypeDocumentView(APIBase):

    def get(self, request, tileid=None, nodeid=None):
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
        node = Node.objects.get(pk=nodeid)
        tile = TileModel.objects.get(pk=tileid)
        datatype_instance = datatype_factory.get_instance(node.datatype) 
        datatype_instance.append_to_document(document, tile.data[nodeid], nodeid, tile)

        return JSONResponse(document)
