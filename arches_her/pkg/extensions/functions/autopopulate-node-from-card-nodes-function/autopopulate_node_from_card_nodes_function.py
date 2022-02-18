import uuid
from arches.app.functions.base import BaseFunction
from arches.app.models.system_settings import settings
from arches.app.models import models
from arches.app.models.tile import Tile
from arches.app.models.resource import Resource
from arches.app.datatypes.datatypes import DataTypeFactory
from django.contrib.gis.geos import GEOSGeometry
from django.db import connection, transaction
import json
from datetime import datetime


details = {
    "name": "Autopopulate Node From Card Nodes",
    "type": "node",
    "description": "Autopopulates a Node in a Card with the values from other Nodes within that Card",
    "defaultconfig": {"autopopulate_configs": [], "triggering_nodegroups": []},
    "classname": "AutopopulateNodeFromCardNodes",
    "component": "views/components/functions/autopopulate-node-from-card-nodes-function",
    "functionid": "184332d6-687d-4bcb-ae41-9aeb467fbdad",
}


class AutopopulateNodeFromCardNodes(BaseFunction):

    def autopopulate_nodes(self, tile, request, is_function_save_method=True):

        if request is None and is_function_save_method == True:
            return

        tile_nodegroup = tile.nodegroup_id
        stored_configs = self.config["autopopulate_configs"]


        for auto_pop_config in stored_configs:

            node_to_populate = ""
            autopopulated_string = ""
            populating_nodes = {}
            write_to_node = False


            if auto_pop_config["nodegroup"] == tile_nodegroup:

                node_to_populate = auto_pop_config["target_node"]
                autopopulated_string = auto_pop_config["string_template"]
                autopopulate_nodegroup = auto_pop_config["nodegroup"]
                autopopulate_overwrite = auto_pop_config["overwrite"]


                nodes_in_card = models.Node.objects.filter(nodegroup_id=uuid.UUID(autopopulate_nodegroup))

                for card_node in nodes_in_card:
                    if card_node.datatype != 'semantic':
                        if card_node.nodeid != node_to_populate:
                            populating_nodes[card_node.nodeid] = card_node.name



                if node_to_populate != "" and autopopulated_string != "":

                    data_in_tile = tile.data

                    if tile.data[node_to_populate] != None and tile.data[node_to_populate] != "":

                        if autopopulate_overwrite != False:
                            write_to_node = True

                    else:

                        write_to_node = True


                if write_to_node == True:
                    for n in populating_nodes:
                        node_id_from_card = str(n)
                        node_name_from_card = str(populating_nodes[n])
                        if node_name_from_card in autopopulated_string:
                            node_value_from_tile = ""
                            if data_in_tile[node_id_from_card] != None:
                                node_info = models.Node.objects.get(nodeid=n)
                                datatype_factory_object = DataTypeFactory().get_instance(node_info.datatype)
                                node_object =  models.Node.objects.get(pk=n)
                                node_value_from_tile = datatype_factory_object.get_display_value(tile,node_object)
                            autopopulated_string = autopopulated_string.replace("<%s>" % node_name_from_card, node_value_from_tile)

                    tile.data[node_to_populate] = autopopulated_string
                    tile.save()
                    return

        return

    def get(self):
        raise NotImplementedError

    def save(self, tile, request):
        self.autopopulate_nodes(tile=tile, request=request, is_function_save_method=True)
        return

    def post_save(self, *args, **kwargs):
        raise NotImplementedError

    def delete(self, tile, request):
        raise NotImplementedError

    def on_import(self, tile):
        raise NotImplementedError

    def after_function_save(self, tile, request):
        raise NotImplementedError
