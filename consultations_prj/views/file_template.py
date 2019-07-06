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
from docx import Document
from arches.app.utils.betterJSONSerializer import JSONSerializer, JSONDeserializer
from arches.app.utils.response import JSONResponse
# from arches.app.utils.decorators import group_required
# from arches.app.utils.geo_utils import GeoUtils
# from arches.app.utils.couch import Couch
from arches.app.models import models
from arches.app.models.card import Card
from arches.app.models.resource import Resource
from arches.app.models.system_settings import settings
# from arches.app.views.base import BaseManagerView
# from arches.app.views.base import MapBaseManagerView
import arches.app.views.search as search
import os
from pprint import pprint

# first: iterate through the following:
# --sections (header.paragraphs/.tables, footer.paragraphs/.tables)...runs
# --document.paragraphs/.tables...runs


class FileTemplateView(View):

    doc = None
    tile_data = None

    # Presumably we get the following:
    # - concept_id of the selected letter
    # (Passed in via tile:)
    #   - resourceinstance_id for this resource
    #   - date value 

    def get(self, request): 
        # data = JSONDeserializer().deserialize(request.body)
        # pprint(data)
        # print request.method
        template_id = request.GET.get('template_id')
        resourceinstance_id = request.GET.get('resourceinstance_id', None)
        self.resource = Resource.objects.get(resourceinstanceid=resourceinstance_id)
        consultation_instance_id = resouce.tiles.data['a5901911-6d1e-11e9-8674-dca90488358a'] # iterate/fix this
        consultation = Resource.objects.get(resourceinstance_id=consultation_instance_id)
        template = self.get_template(template_id)
        self.doc = Document(template)
        self.get_tile_data(consultation)
        if resourceinstance_id is not None:
            return JSONResponse({'resource': self.resource, 'template_id': template_id})

        return HttpResponseNotFound()


    def get_template(self, template_id):
        template_path = None
        template_dict = {
            "a26c77ff-1d04-4b76-a45f-417f7ed24333":'', # Addit Cond Text
            "8c12a812-8000-4ec9-913d-c6fd516117f2":'', # Arch Rec Text
            "01dec356-e72e-40e6-b1b1-b847b9799d2f":'GLAAS Planning Letter A - No Progression - template.docx', # Letter A
            "320abc26-db82-44a6-be11-8d44aaa23365":'', # Letter A2
            "fd15c6c7-e94d-4914-8d51-a98bda6f4a7b":'', # Letter B1
            "8cc91474-11ce-47d9-b886-f0e3fc49d277":'GLAAS Planning Letter B2 - Predetermination - template.docx', # Letter B2
            "08bb630d-a27b-45bc-a13f-567b428018c5":'GLAAS Planning Letter C - Condition two stage - template.docx' # Letter C
            }
        for key, value in template_dict.items():
            if key == template_id:
                template_path = os.path.join(settings.APP_ROOT, 'docx', value)
                pprint(template_path)

        return template_path


    def get_tile_data(self, consultation):
        # need to lookup consultation using Communication.Related_Consultation node
        # need to get various consultation data as well, incl site visit, actors
        
        # from here need to lookup the widget labels and tile.data of each node
        # pseudo-code:
        # for tile in self.resource.tiles:
        #   self.tile_data[tile] = {}
        #   self.tile_data[tile][widgetid] = tile.data[widgetid]
        #   if tile.data[widgetlabel] is not None: 
        #       self.tile_data[tile][widgetlabel] = tile.data[widgetlabel]
        #   for datum in tile[data]:
        #       self.tile_data[tile][datum] = tile[data][datum]

        self.tile_data = {"name":"Bob", "Role":"Director"}

    
    def replace_string(self, document, k, v):
        # this would be most efficient to iterate through a string list at once, 
        doc = document

        if len(doc.paragraphs) > 0:
            for p in doc.paragraphs:
                if k in p.text:
                    p.text.replace("{{"+k+"}}", v)

        if len(doc.tables) > 0:
            for table in doc.tables:
                for row in table.rows:
                    for cell in row.cells:
                        if k in cell.text:
                            cell.text.replace("{{"+k+"}}", v)
        
        if len(doc.sections) > 0:
            for section in doc.sections:
                for p in section.footer.paragraphs:
                    if k in p.text:
                        p.text.replace("{{"+k+"}}", v)
                for table in section.footer.tables:
                    for row in table.rows:
                        for cell in row.cells:
                            if k in cell.text:
                                cell.text.replace("{{"+k+"}}", v)
            
                for p in section.header.paragraphs:
                    if k in p.text:
                        p.text.replace("{{"+k+"}}", v)
                for table in section.header.tables:
                    for row in table.rows:
                        for cell in row.cells:
                            if k in cell.text:
                                cell.text.replace("{{"+k+"}}", v)

    
    def insert_image(self, document, k, v, image_path=None, config=None):
        
        return True


    def insert_custom(self, document, k, v, config=None):
        # perhaps replaces {{custom_object}} with pre-determined text structure with custom style/format

        return True

