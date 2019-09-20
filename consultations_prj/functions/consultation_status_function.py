import json
import uuid
import inspect
from pprint import pprint
from arches.app.functions.base import BaseFunction
from arches.app.models import models
from arches.app.models.tile import Tile
from arches.app.datatypes.datatypes import DataTypeFactory
from arches.app.views.tile import TileData
from django.http import HttpRequest, HttpResponseNotFound


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

    def save(self, tile, request):
        # frame = inspect.currentframe()
        # args, _, _, values = inspect.getargvalues(frame)
        # print 'function name "%s"' % inspect.getframeinfo(frame)[2]
        # for i in args:
        #     print "    %s = %s" % (i, values[i])
        
        cons_status_list_nodeid = "8d41e4d3-a250-11e9-8977-00224800b26d"
        cons_status_list_nodegroupid = "8d41e4c0-a250-11e9-a7e3-00224800b26d"
        cons_status_bool_nodeid = "6a773228-db20-11e9-b6dd-784f435179ea"
        pprint(tile)
        try:
            pprint(request.POST)
            # <QueryDict: {u'data': [
            #     u'{"tileid":"",
            #     "data":{"8d41e4de-a250-11e9-973b-00224800b26d":["f83f10f9-9db4-40b4-b427-79315691bd97"]},
            #     "nodegroup_id":"8d41e4ba-a250-11e9-9b20-00224800b26d",
            #     "parenttile_id":null,"sortorder":0,"tiles":{}}']}>
        except Exception as e:
            pprint(e)
            pass

        active_statuses = [
            "Mitigation",
            "Post-excavation assessment",
            "Pre-decision assessment/evaluation",
            "Project Initiation",
            "Dormant",
            "Publication & archiving"
        ]
        datatype_factory = DataTypeFactory()
        cons_status_list_node = models.Node.objects.get(nodeid=cons_status_list_nodeid)
        datatype = datatype_factory.get_instance(cons_status_list_node.datatype)
        if cons_status_list_nodeid in tile.data.keys():
            tile_status = datatype.get_display_value(tile, cons_status_list_node)
            status = True if tile_status in active_statuses else False

            # make new request
            new_req = HttpRequest()
            new_req.method = 'POST'
            new_req.user = request.user
            new_tile_data_instance = TileData()

            #TODO: case where triggering tile gets deleted, reset status to inactive

            # if tile does not exist
            resourceinstance_id = str(tile.resourceinstance.resourceinstanceid)
            tile_query = Tile.objects.filter(resourceinstance_id=resourceinstance_id, nodegroup_id=cons_status_bool_nodeid)
            if tile_query.exists(): # else check tile value, then overwrite
                print("re-save tile")
                status_tile = Tile.objects.get(resourceinstance_id=resourceinstance_id, nodegroup_id=cons_status_bool_nodeid)
                if status_tile.data[cons_status_bool_nodeid] is not status:
                    print("overwrite")
                    # updated_tile_data = tile.data
                    # updated_tile = tile
                    # tile.data[cons_status_bool_nodeid] = status
                    updated_tile = json.dumps({
                        "tileid":tile.tileid,
                        "data": { "6a773228-db20-11e9-b6dd-784f435179ea":status },
                        "nodegroup_id":cons_status_bool_nodeid,
                        "parenttile_id":None,
                        "resourceinstance_id":resourceinstance_id,
                        "sortorder":0
                    })
                    # updated_tile.data[cons_status_bool_nodeid] = status
                    new_req.POST['data'] = updated_tile
                    # new_req.POST['data'] = tile
                    # updated_tile_data[cons_status_bool_nodeid] = status
                    try:
                        post_resp = TileData.post(new_tile_data_instance, new_req)
                        if post_resp.status_code == 200:
                            print("successful overwrite")
                        else:
                            print("failed overwrite")
                    except Exception as e:
                        print(e)
                        print("failed overwrite")
                else:
                    print("do nothing -- no change needed")
            
            else:
                print("tile doesnt exist")
                new_tile = json.dumps({
                    "tileid":None,
                    "data": { "6a773228-db20-11e9-b6dd-784f435179ea":status },
                    "nodegroup_id":cons_status_bool_nodeid,
                    "parenttile_id":None,
                    "resourceinstance_id":resourceinstance_id,
                    "sortorder":0
                })

                new_req.POST['data'] = new_tile

                try:
                    post_resp = TileData.post(new_tile_data_instance, new_req)
                except Exception as e:
                    print(e)
                if post_resp.status_code == 200:
                    print("successful new save")
                else:
                    print("failed new save")
        
        else:
            print("not found")
            return

        return

    def get(self):
        print('===== get ====')
        raise NotImplementedError

    def delete(self,tile,request):
        raise NotImplementedError

    def on_import(self,tile):
        raise NotImplementedError

    def after_function_save(self,tile,request):
        raise NotImplementedError
    
