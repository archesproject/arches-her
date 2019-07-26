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

import json
import collections
import couchdb
import urlparse
from datetime import datetime
from datetime import timedelta
from django.db import transaction
from django.shortcuts import render
from django.db.models import Count
# from django.contrib.auth.models import User, Group
from django.contrib.gis.geos import MultiPolygon
from django.contrib.gis.geos import Polygon
from django.core.urlresolvers import reverse
from django.core.mail import EmailMultiAlternatives
from django.http import HttpRequest, HttpResponseNotFound
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils.translation import ugettext as _
from django.utils.decorators import method_decorator
from django.views.generic import View
from arches.app.utils.betterJSONSerializer import JSONSerializer, JSONDeserializer
from arches.app.utils.response import JSONResponse
# from arches.app.utils.decorators import group_required
# from arches.app.utils.geo_utils import GeoUtils
# from arches.app.utils.couch import Couch
from arches.app.models import models
from arches.app.models.card import Card
from arches.app.models.resource import Resource
from arches.app.models.tile import Tile
from arches.app.models.graph import Graph
from arches.app.models.system_settings import settings
from arches.app.datatypes.datatypes import DataTypeFactory
# from arches.app.views.base import BaseManagerView
# from arches.app.views.base import MapBaseManagerView
import arches.app.views.search as search
import os
from pprint import pprint


class ActiveConsultationsView(View):

    resource = None


    def get(self, request): 
        # data = JSONDeserializer().deserialize(request.body)
        datatype_factory = DataTypeFactory()
        ids = None
        exclude_list = []
        tiles = {}
        exclude_statuses = ["Aborted","Completed"]
        cons_status_node_id = '8d41e4d3-a250-11e9-8977-00224800b26d'
        # pprint(request.GET)
        ids = request.GET.get('instance_ids')
        ids = json.loads(ids)

        consultations = Resource.objects.filter(resourceinstanceid__in=ids)
        exclude_tiles = Tile.objects.filter(nodegroup_id='8d41e4c0-a250-11e9-a7e3-00224800b26d') # tiles w/ cons details, the nodegroup
        cons_status_node = models.Node.objects.get(nodeid=cons_status_node_id)
        datatype = datatype_factory.get_instance(cons_status_node.datatype)
        
        for tile in exclude_tiles:
            if cons_status_node_id in tile.data.keys():
                tile_status = datatype.get_display_value(tile, cons_status_node)
                # pprint(tile_status)
                if tile_status in exclude_statuses:
                    exclude_list.append(str(tile.resourceinstance.resourceinstanceid))

        filtered_consultations = None
        filtered_consultations = Resource.objects.filter(graph_id='8d41e49e-a250-11e9-9eab-00224800b26d').exclude(resourceinstanceid__in=exclude_list)
        print ('filtered=',len(filtered_consultations))
        print ('excluded=',len(exclude_list))
        for consultation in filtered_consultations:
            _id = str(consultation.resourceinstanceid)
            consultation.load_tiles()
            tiles[_id] = {}
            for tile in consultation.tiles:
                # print ('tile', tile.data)
                for k, v in tile.data.items():
                    node = models.Node.objects.get(nodeid=k)
                    try:
                        datatype = datatype_factory.get_instance(cons_status_node.datatype)
                        val = datatype.get_display_value(tile, node)
                    except Exception as e: # no known display_value for datatype
                        val = v
                    tiles[_id][node.name] = val

        # pprint(tiles)


        # consultation_details nodeid = '8d41e4c0-a250-11e9-a7e3-00224800b26d'
        # (child node) consultation_status = '8d41e4d3-a250-11e9-8977-00224800b26d'

        
        if filtered_consultations is not None:
            return JSONResponse({'tile_dict': tiles })

        return HttpResponseNotFound()

