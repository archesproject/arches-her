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
        graph_id = request.GET.get('graph_id')
        # resourceinstance_id = request.GET.get('resourceinstance_id', None)

        consultations = Resource.objects.filter(graphid=graph_id)

        # consultation_details nodeid = '8d41e4c0-a250-11e9-a7e3-00224800b26d'
        # (child node) consultation_status = '8d41e4d3-a250-11e9-8977-00224800b26d'

        for consultation in consultations:
            consultation.load_tiles()
            tile_dict = {consultation.tiles}
            pprint(tile_dict)

        if graph_id is not None:
            return JSONResponse({'thing':'okay' })

        return HttpResponseNotFound()
                


    #     self.resource = Resource.objects.get(resourceinstanceid=resourceinstance_id)
    #     self.resource.load_tiles()
    #     consultation_instance_id = None
    #     consultation = None
    #     for tile in self.resource.tiles: # self.resource is of communication model
    #         if 'a5901911-6d1e-11e9-8674-dca90488358a' in tile.data.keys(): # related-consultation nodegroup
    #             consultation_instance_id = tile.data['a5901911-6d1e-11e9-8674-dca90488358a'][0]

    # def replace_in_letter(self, tiles, template_dict, datatype_factory):
    #     for tile in tiles:
    #         for key, value in template_dict.items():
    #             if value in tile.data:
    #                 # print 'success!'
    #                 # print (tile.data)
    #                 my_node = models.Node.objects.get(nodeid=value)
    #                 datatype = datatype_factory.get_instance(my_node.datatype)
    #                 lookup_val = datatype.get_display_value(tile, my_node)
    #                 self.replace_string(self.doc, key, lookup_val)

