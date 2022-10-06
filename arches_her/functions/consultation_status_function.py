from operator import truediv
import uuid
import json
import datetime
from arches.app.functions.base import BaseFunction
from arches.app.models import models
from arches.app.models.tile import Tile
from arches.app.datatypes.datatypes import DataTypeFactory
import logging


details = {
    'name': 'Consultation Status',
    'type': 'node',
    'description': 'Triggers change in status node of consultation instance',
    'defaultconfig': {
        "cons_comp_date_nodeid":"40eff4ce-893a-11ea-ae2e-f875a44e0e11",
        "cons_status_bool_nodeid":"6a773228-db20-11e9-b6dd-784f435179ea",
        },
    'classname': 'ConsultationStatusFunction',
    'component': '',
    'functionid':'96efa95a-1e2c-4562-ac1f-b415796f9f75'
}

class ConsultationStatusFunction(BaseFunction):

    def handle_boolean_tile(self,tile,nodegroupid,nodeid,status):
        try:
            nodeid_str = str(nodeid)
            cons_status_tile = None

            cons_status_tile_filter = Tile.objects.filter(nodegroup_id=nodegroupid, resourceinstance_id=tile.resourceinstance_id)
            if len(cons_status_tile_filter) > 0:
                cons_status_tile = cons_status_tile_filter[0]
            else:
                cons_status_tile = Tile().get_blank_tile_from_nodegroup_id(resourceid = tile.resourceinstance_id,nodegroup_id = nodegroupid)

            if cons_status_tile != None:

                cons_status_tile_data = cons_status_tile.data
                cons_status_tile_data[nodeid_str] = status
                try:
                    cons_status_tile.save()
                    return True

                except Exception as e:
                    self.logger.error(e, "Could not save boolean tile")
                    return False

            else:
                return False

        except Exception as e:
                self.logger.error(e, "Could not create boolean tile")
                return False


    def save_cons_tile(self, tile, request, is_function_save_method=True):

        if request is None and is_function_save_method == True:
            return

        try:
            cons_status_bool_nodeid = self.config["cons_status_bool_nodeid"]
            cons_status_bool_filter = Tile.objects.filter(resourceinstance_id=tile.resourceinstance_id,nodegroup_id=cons_status_bool_nodeid)
            date_comp_node = models.Node.objects.get(nodeid=self.config["cons_comp_date_nodeid"])
            if len(cons_status_bool_filter) > 0:
                date_comp_tile = None
                if tile.nodegroup_id == str(date_comp_node.nodegroup_id):
                        date_comp_tile = tile
                else:
                    date_comp_tile_filter = Tile.objects.filter(resourceinstance_id=tile.resourceinstance_id,nodegroup_id=date_comp_node.nodegroup_id)
                    if len(date_comp_tile_filter) > 0:
                        date_comp_tile = date_comp_tile_filter[0]
                if  date_comp_tile != None:
                    datatype_factory = DataTypeFactory()
                    datatype = datatype_factory.get_instance(date_comp_node.datatype)
                    date_comp_value = datatype.get_display_value(tile,date_comp_node)
                    if date_comp_value != None:
                        try:
                            self.handle_boolean_tile(tile,cons_status_bool_nodeid,cons_status_bool_nodeid,False)
                            return
                        except Exception as e:
                            self.logger.error(e,"Could not handle boolean tile after confirmation completion date node is present")
                            return
                    else:
                        return
            else:
                self.handle_boolean_tile(tile,cons_status_bool_nodeid,cons_status_bool_nodeid,True)
                return

            return
        except Exception as e:
            self.logger.error(e,"Could not check boolean tile")
            return


    def save(self, tile, request, context=None):
        self.logger = logging.getLogger(__name__)
        try:
            self.save_cons_tile(tile=tile, request=request, is_function_save_method=True)
            return
        except Exception as e:
            self.logger.error(e, "Could not save tile")


    def delete(self,tile,request):
        self.logger = logging.getLogger(__name__)
        try:
            date_comp_node = models.Node.objects.get(nodeid=self.config["cons_comp_date_nodeid"])
            cons_status_bool_nodeid = self.config["cons_status_bool_nodeid"]
            if tile.nodegroup_id == date_comp_node.nodegroup_id:
                cons_status_bool_filter = Tile.objects.filter(resourceinstance_id=tile.resourceinstance_id,nodegroup_id=cons_status_bool_nodeid)
                if len(cons_status_bool_filter) > 0:
                        self.handle_boolean_tile(tile,cons_status_bool_nodeid,cons_status_bool_nodeid,True)
                        return
                else:
                    return
            else:
                return
        except Exception as e:
                self.logger.error(e, "Could not delete tile")


    def on_import(self,tile):
        raise NotImplementedError


    def after_function_save(self,tile,request):
        raise NotImplementedError


    def get(self):
        raise NotImplementedError
