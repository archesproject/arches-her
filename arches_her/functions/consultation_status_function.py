import uuid
import json
from arches.app.functions.base import BaseFunction
from arches.app.models import models
from arches.app.models.tile import Tile
from arches.app.datatypes.datatypes import DataTypeFactory


details = {
    'name': 'Consultation Status',
    'type': 'node',
    'description': 'Triggers change in status node of consultation instance',
    'defaultconfig': {
        "cons_status_list_nodegroupid":"8d41e4c0-a250-11e9-a7e3-00224800b26d",
        "cons_status_list_nodeid":"8d41e4d3-a250-11e9-8977-00224800b26d"
        },
    'classname': 'ConsultationStatusFunction',
    'component': '',
    'functionid':'96efa95a-1e2c-4562-ac1f-b415796f9f75'
}

class ConsultationStatusFunction(BaseFunction): 

    def save(self, tile, request, context=None):
        cons_status_list_nodeid = "8d41e4d3-a250-11e9-8977-00224800b26d"
        cons_status_bool_nodeid = "6a773228-db20-11e9-b6dd-784f435179ea"

        active_statuses = [
            "Mitigation",
            "Post-excavation assessment",
            "Pre-decision assessment/evaluation",
            "Project Initiation",
            "Dormant",
            "Publication & archiving"
        ]
        if tile.data is not None:
            if cons_status_list_nodeid in list(tile.data.keys()):
                datatype_factory = DataTypeFactory()
                cons_status_list_node = models.Node.objects.get(nodeid=cons_status_list_nodeid)
                datatype = datatype_factory.get_instance(cons_status_list_node.datatype)
                tile_status = datatype.get_display_value(tile, cons_status_list_node)

                status = True if tile_status in active_statuses else False
                resourceinstance_id = str(tile.resourceinstance.resourceinstanceid)
                cons_status_tile, created = Tile.objects.get_or_create(
                    resourceinstance_id=resourceinstance_id,
                    nodegroup_id=cons_status_bool_nodeid,
                    defaults = {'data':{"6a773228-db20-11e9-b6dd-784f435179ea":status}}
                )

                if created is False:
                    try:
                        # cons_status_tile.data = json.dumps({ "6a773228-db20-11e9-b6dd-784f435179ea":status })
                        cons_status_tile.data = { "6a773228-db20-11e9-b6dd-784f435179ea":status }
                    except Exception as e:
                        print('tile.data assignment error: ',e)
                    try:
                        cons_status_tile.save(request=request)
                    except Exception as e:
                        print('tile.save error: ',e)

        return

    
    def delete(self,tile,request):
        cons_status_list_nodeid = "8d41e4d3-a250-11e9-8977-00224800b26d"
        cons_status_bool_nodeid = "6a773228-db20-11e9-b6dd-784f435179ea"
        
        if tile.data is not None:
            if cons_status_list_nodeid in list(tile.data.keys()):
                status = False

                resourceinstance_id = str(tile.resourceinstance.resourceinstanceid)
                cons_status_tile, created = Tile.objects.get_or_create(
                    resourceinstance_id=resourceinstance_id,
                    nodegroup_id=cons_status_bool_nodeid,
                    defaults = {'data':{"6a773228-db20-11e9-b6dd-784f435179ea":status}}
                )

                if created is False:
                    try:
                        # cons_status_tile.data = json.dumps({ "6a773228-db20-11e9-b6dd-784f435179ea":status })
                        cons_status_tile.data = { "6a773228-db20-11e9-b6dd-784f435179ea":status }
                    except Exception as e:
                        print('tile.data assignment error: ',e)
                    try:
                        cons_status_tile.save(request=request)
                    except Exception as e:
                        print('tile.save error: ',e)

        return

    
    def on_import(self,tile):
        print("========= on_import ===========")
        cons_status_list_nodeid = "8d41e4d3-a250-11e9-8977-00224800b26d"
        cons_status_bool_nodeid = "6a773228-db20-11e9-b6dd-784f435179ea"

        active_statuses = [
            "Mitigation",
            "Post-excavation assessment",
            "Pre-decision assessment/evaluation",
            "Project Initiation",
            "Dormant",
            "Publication & archiving"
        ]
        if tile.data is not None:
            if cons_status_list_nodeid in list(tile.data.keys()):
                datatype_factory = DataTypeFactory()
                cons_status_list_node = models.Node.objects.get(nodeid=cons_status_list_nodeid)
                datatype = datatype_factory.get_instance(cons_status_list_node.datatype)
                tile_status = datatype.get_display_value(tile, cons_status_list_node)

                status = True if tile_status in active_statuses else False
                resourceinstance_id = str(tile.resourceinstance.resourceinstanceid)
                cons_status_tile, created = Tile.objects.get_or_create(
                    resourceinstance_id=resourceinstance_id,
                    nodegroup_id=cons_status_bool_nodeid,
                    defaults = {'data':{"6a773228-db20-11e9-b6dd-784f435179ea":status}}
                )

        return

    
    def after_function_save(self,tile,request):
        raise NotImplementedError
    
    
    def get(self):
        raise NotImplementedError
