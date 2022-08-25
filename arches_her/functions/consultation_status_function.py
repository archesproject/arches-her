from operator import truediv
import uuid
import json
import datetime
from arches.app.functions.base import BaseFunction
from arches.app.models import models
from arches.app.models.tile import Tile
from arches.app.datatypes.datatypes import DataTypeFactory


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

    def handle_boolean_tile(self,tile,nodegroupid,nodeid,status,create):
        try:
            nodeid_str = str(nodeid)
            cons_status_tile = None

            if create == True:
                cons_status_tile = Tile().get_blank_tile_from_nodegroup_id(resourceid = tile.resourceinstance_id,nodegroup_id = nodegroupid)

            else:
                cons_status_tile_filter = Tile.objects.filter(nodegroup_id=nodegroupid, resourceinstance_id=tile.resourceinstance_id)
                if len(cons_status_tile_filter) > 0:
                    cons_status_tile = cons_status_tile_filter[0]

            if cons_status_tile != None:

                cons_status_tile_data = cons_status_tile.data
                cons_status_tile_data[nodeid_str] = status
                try:
                    cons_status_tile.save()
                    return True

                except Exception as e:
                    print (e, "Could not create boolean tile")
                    return False

            else:
                return False

        except Exception as e:
                print (e, "Could not create boolean tile")
                return False


    def save_cons_tile(self, tile, request, is_function_save_method=True):

        if request is None and is_function_save_method == True:
            return

        cons_status_bool_nodeid = self.config["cons_status_bool_nodeid"]
        cons_status_bool_filter = Tile.objects.filter(resourceinstance_id=tile.resourceinstance_id,nodegroup_id=cons_status_bool_nodeid)
        date_comp_node = models.Node.objects.get(nodeid=self.config["cons_comp_date_nodeid"])
        today_date = datetime.date.today()
        if len(cons_status_bool_filter) > 0:
            date_comp_tile = None
            if tile.nodegroup_id == str(date_comp_node.nodegroup_id):
                    date_comp_tile = tile
            else:
                date_comp_tile_filter = Tile.objects.filter(resourceinstance_id=tile.resourceinstance_id,nodegroup_id=date_comp_node.nodegroup_id)
                if len(date_comp_tile_filter) > 0:
                    date_comp_tile = date_comp_tile_filter[0]
            if  date_comp_tile != None:
                date_comp_node_string = str(date_comp_node.nodeid)
                date_comp_value = date_comp_tile.data[date_comp_node_string]
                date_comp = datetime.datetime.strptime(date_comp_value, "%Y-%m-%d").date()
                try:
                    if today_date > date_comp:
                        self.handle_boolean_tile(tile,cons_status_bool_nodeid,cons_status_bool_nodeid,False,False)
                        return
                    else:
                        self.handle_boolean_tile(tile,cons_status_bool_nodeid,cons_status_bool_nodeid,True,False)
                        return
                except Exception as e:
                    print(e,"Could not compare today's date and completed date")
                    return
            else:
                if tile.nodegroup_id == date_comp_node.nodegroup_id:
                    date_comp = datetime.datetime.strptime(tile.data[["cons_comp_date_nodeid"]], "%m-%d-%Y").date()
                    if today_date < date_comp:
                        self.handle_boolean_tile(tile,cons_status_bool_nodeid,cons_status_bool_nodeid,False,True)
                        return
                else:
                    self.handle_boolean_tile(tile,cons_status_bool_nodeid,cons_status_bool_nodeid,False,False)
                    return

        else:
            self.handle_boolean_tile(tile,cons_status_bool_nodeid,cons_status_bool_nodeid,True,True)
            return

        return


    def save(self, tile, request, context=None):

        self.save_cons_tile(tile=tile, request=request, is_function_save_method=True)
        return


    def delete(self,tile,request):
        date_comp_node = models.Node.objects.get(nodeid=self.config["cons_comp_date_nodeid"])
        cons_status_bool_nodeid = self.config["cons_status_bool_nodeid"]
        if tile.nodegroup_id == date_comp_node.nodegroup_id:
            cons_status_bool_filter = Tile.objects.filter(resourceinstance_id=tile.resourceinstance_id,nodegroup_id=cons_status_bool_nodeid)
            if len(cons_status_bool_filter) > 0:
                self.handle_boolean_tile(tile,cons_status_bool_nodeid,cons_status_bool_nodeid,True,False)
                return
            else:
                return
        else:
            return


    def on_import(self,tile,request):
        print("========= on_import ===========")

        self.save_cons_tile(tile=tile, request=request, is_function_save_method=True)
        return


    def after_function_save(self,tile,request):
        raise NotImplementedError


    def get(self):
        raise NotImplementedError
