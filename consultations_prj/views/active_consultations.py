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
from django.core.paginator import Paginator
from arches.app.utils.response import JSONResponse
from arches.app.utils.pagination import get_paginator # unneeded?
from arches.app.models import models
from arches.app.models.resource import Resource
from arches.app.models.tile import Tile
from arches.app.datatypes.datatypes import DataTypeFactory
import json


class ActiveConsultationsView(View):

    def get(self, request): 
        datatype_factory = DataTypeFactory()
        cons_details_tiles = Tile.objects.filter(nodegroup_id='8d41e4c0-a250-11e9-a7e3-00224800b26d')
        exclude_list = self.build_exclude_list(cons_details_tiles, datatype_factory)
        filtered_consultations = Resource.objects.filter(graph_id='8d41e49e-a250-11e9-9eab-00224800b26d').exclude(resourceinstanceid__in=exclude_list)
        tiles = self.get_tile_dict(filtered_consultations, datatype_factory)
        page_ct = 10
        p = Paginator(tiles, page_ct)
        if filtered_consultations is not None:
            return JSONResponse({'tile_dict': tiles })

        return HttpResponseNotFound()

    
    def build_exclude_list(self, tiles, datatype_factory):
        exclude_list = []
        exclude_statuses = ["Aborted","Completed"]
        cons_status_node_id = '8d41e4d3-a250-11e9-8977-00224800b26d'
        cons_status_node = models.Node.objects.get(nodeid=cons_status_node_id)
        datatype = datatype_factory.get_instance(cons_status_node.datatype)
        for tile in tiles:
            if cons_status_node_id in tile.data.keys():
                tile_status = datatype.get_display_value(tile, cons_status_node)
                if tile_status in exclude_statuses:
                    exclude_list.append(str(tile.resourceinstance.resourceinstanceid))

        return exclude_list


    def get_tile_dict(self, consultations, datatype_factory):
        tiles = {}
        active_cons_node_list = {
            "Map":"8d41e4d6-a250-11e9-accd-00224800b26d",
            "Name":"8d41e4ab-a250-11e9-87d1-00224800b26d",
            "Consultation Type":"8d41e4dd-a250-11e9-9032-00224800b26d",
            "Proposal":"8d41e4bd-a250-11e9-89e8-00224800b26d",
            "Target Date":"8d41e4cb-a250-11e9-9cf2-00224800b26d",
            "Owner":"8d41e4e1-a250-11e9-8d14-00224800b26d"
        }
        active_cons_list_vals = active_cons_node_list.values()
        for consultation in consultations:
            _id = str(consultation.resourceinstanceid)
            consultation.load_tiles()
            tiles[_id] = {}
            for tile in consultation.tiles:
                for k, v in tile.data.items():
                    if k in active_cons_list_vals:
                        node = models.Node.objects.get(nodeid=k)
                        try:
                            datatype = datatype_factory.get_instance(node.datatype)
                            val = datatype.get_display_value(tile, node)
                            if k == active_cons_node_list["Map"]:
                                val = json.loads(val)
                        except Exception as e:
                            val = v

                        tiles[_id][node.name] = val

        return tiles


    def paginate_active_consultations(self, related_resources, page, request):
        total = related_resources['total']
        paginator, pages = get_paginator(request, related_resources, total, page, settings.RELATED_RESOURCES_PER_PAGE)
        page = paginator.page(page)
