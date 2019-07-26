'''
ARCHES - a program developed to inventory and manage immovable cultural heritage.
Copyright (C) 2013 J. Paul Getty Trust and World Monuments Fund

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
'''

from django.http import HttpRequest, HttpResponseNotFound
from django.views.generic import View
from arches.app.utils.response import JSONResponse
from arches.app.models import models
from arches.app.models.resource import Resource
from arches.app.models.tile import Tile
from arches.app.datatypes.datatypes import DataTypeFactory


class ActiveConsultationsView(View):

    def get(self, request): 
        datatype_factory = DataTypeFactory()
        exclude_list = []
        tiles = {}
        exclude_statuses = ["Aborted","Completed"]
        cons_status_node_id = '8d41e4d3-a250-11e9-8977-00224800b26d'
        cons_details_tiles = Tile.objects.filter(nodegroup_id='8d41e4c0-a250-11e9-a7e3-00224800b26d')
        cons_status_node = models.Node.objects.get(nodeid=cons_status_node_id)
        datatype = datatype_factory.get_instance(cons_status_node.datatype)
        
        for tile in cons_details_tiles:
            if cons_status_node_id in tile.data.keys():
                tile_status = datatype.get_display_value(tile, cons_status_node)
                if tile_status in exclude_statuses:
                    exclude_list.append(str(tile.resourceinstance.resourceinstanceid))

        filtered_consultations = Resource.objects.filter(graph_id='8d41e49e-a250-11e9-9eab-00224800b26d').exclude(resourceinstanceid__in=exclude_list)
        for consultation in filtered_consultations:
            _id = str(consultation.resourceinstanceid)
            consultation.load_tiles()
            tiles[_id] = {}
            for tile in consultation.tiles:
                for k, v in tile.data.items():
                    node = models.Node.objects.get(nodeid=k)
                    try:
                        datatype = datatype_factory.get_instance(cons_status_node.datatype)
                        val = datatype.get_display_value(tile, node)
                    except Exception as e: # no known display_value for datatype
                        val = v
                    tiles[_id][node.name] = val

        
        if filtered_consultations is not None:
            return JSONResponse({'tile_dict': tiles })

        return HttpResponseNotFound()

