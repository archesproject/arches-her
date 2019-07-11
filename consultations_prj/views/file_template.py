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
from docx import Document
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
    tile_data = {}
    resource = None

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
        # pprint(resourceinstance_id)
        self.resource = Resource.objects.get(resourceinstanceid=resourceinstance_id)
        self.resource.load_tiles()
        consultation_instance_id = None
        consultation = None
        for tile in self.resource.tiles:
            if 'a5901911-6d1e-11e9-8674-dca90488358a' in tile.data.keys(): # related-consultation nodegroup
                consultation_instance_id = tile.data['a5901911-6d1e-11e9-8674-dca90488358a'][0]

        template_path = self.get_template_path(template_id)
        self.doc = Document(template_path)
        new_file_name = None
        new_file_path = None
        file_url = None

        if consultation_instance_id is not None:
            consultation = Resource.objects.get(resourceinstanceid=consultation_instance_id)
            consultation.load_tiles()
            self.get_tile_data(consultation)
            pprint(self.tile_data)
            for obj in self.tile_data.values():
                print ('iterating over',obj)
                self.replace_string(self.doc, obj['widget_label'], obj.items()[1][1])
            # media/docx
            new_file_name = 'A_edited.docx'
            new_file_path = os.path.join(settings.APP_ROOT, 'uploadedfiles/docx', new_file_name)
            file_url = os.path.join(settings.APP_ROOT, 'uploadedfiles/docx', new_file_name)
            self.doc.save(new_file_path)

        # self.get_tile_data(consultation)
        if resourceinstance_id is not None:
            return JSONResponse({'resource': self.resource, 'template_id': template_id, 'url': file_url })

        return HttpResponseNotFound()


    def get_template_path(self, template_id):
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

        for tile in consultation.tiles:
            # self.tile_data[tile.tileid] = {}
            # self.tile_data[tile.tileid]['widget_label'] = None
            # print ('has', len(tile.data.keys()), 'data keys')
            for key, value in tile.data.items():
                # print (key, value)
                key = str(key)
                tile.tileid = str(tile.tileid)
                self.tile_data[tile.tileid] = collections.OrderedDict()
                self.tile_data[tile.tileid]['widget_label'] = None
                self.tile_data[tile.tileid][key] = str(tile.data[key])
                widget = None
                try:
                    widget = models.CardXNodeXWidget.objects.get(node_id=key)
                except Exception as e:
                    print ('===NO WIDGET FOR===:', self.tile_data[tile.tileid])
                if widget is not None:
                    self.tile_data[tile.tileid]['widget_label'] = str(widget.label)
                    # pprint(self.tile_data[tile.tileid])
                    

    
    def collect_card_widget_node_data(self, graph_obj, graph, parentcard, nodegroupids=[]):
        nodegroupids.append(str(parentcard.nodegroup_id))
        for node in graph_obj['nodes']:
            if node['nodegroup_id'] == str(parentcard.nodegroup_id):
                found = False
                for widget in graph_obj['widgets']:
                    if node['nodeid'] == str(widget.node_id):
                        found = True
                        try:
                            collection_id = node['config']['rdmCollection']
                            concept_collection = Concept().get_child_collections_hierarchically(collection_id, offset=None)
                            widget.config['options'] = concept_collection
                        except Exception as e:
                            pass
                        break
                if not found:
                    for card in graph_obj['cards']:
                        if card['nodegroup_id'] == node['nodegroup_id']:
                            widget = models.DDataType.objects.get(pk=node['datatype']).defaultwidget
                            if widget:
                                widget_model = models.CardXNodeXWidget()
                                widget_model.node_id = node['nodeid']
                                widget_model.card_id = card['cardid']
                                widget_model.widget_id = widget.pk
                                widget_model.config = widget.defaultconfig
                                try:
                                    collection_id = node['config']['rdmCollection']
                                    if collection_id:
                                        concept_collection = Concept().get_child_collections_hierarchically(collection_id, offset=None)
                                        widget_model.config['options'] = concept_collection
                                except Exception as e:
                                    pass
                                widget_model.label = node['name']
                                graph_obj['widgets'].append(widget_model)
                            break

                if node['datatype'] == 'resource-instance' or node['datatype'] == 'resource-instance-list':
                    if node['config']['graphid'] is not None:
                        try:
                            graphuuid = uuid.UUID(node['config']['graphid'][0])
                            graph_id = unicode(graphuuid)
                        except ValueError as e:
                            graphuuid = uuid.UUID(node['config']['graphid'])
                            graph_id = unicode(graphuuid)
                        node['config']['options'] = []
                        for resource_instance in Resource.objects.filter(graph_id=graph_id):
                            node['config']['options'].append({'id': str(resource_instance.pk), 'name': resource_instance.displayname})

        for subcard in parentcard.cards:
            self.collect_card_widget_node_data(graph_obj, graph, subcard, nodegroupids)

        return graph_obj

    
    def replace_string(self, document, k, v):
        # this would be most efficient to iterate through a string list at once, 
        if v is not None and k is not None:
            print 'good'
            # print (k,v)

            doc = document

            if len(doc.paragraphs) > 0:
                for p in doc.paragraphs:
                    if k in p.text:
                        print (k,'key is in p:',p.text)
                        p.text.replace(k, v) # might need "<" or "{{" around k
                        print p.text

            if len(doc.tables) > 0:
                for table in doc.tables:
                    for row in table.rows:
                        for cell in row.cells:
                            if k in cell.text:
                                print (k, 'key is in cell:',cell.text)
                                cell.text.replace(k, v) # might need "<" or "{{" around k
                                print cell.text
            
            if len(doc.sections) > 0:
                for section in doc.sections:
                    for p in section.footer.paragraphs:
                        if k in p.text:
                            p.text.replace(k, v) # might need "<" or "{{" around k
                    for table in section.footer.tables:
                        for row in table.rows:
                            for cell in row.cells:
                                if k in cell.text:
                                    cell.text.replace(k, v) # might need "<" or "{{" around k
                
                    for p in section.header.paragraphs:
                        if k in p.text:
                            p.text.replace(k, v) # might need "<" or "{{" around k
                    for table in section.header.tables:
                        for row in table.rows:
                            for cell in row.cells:
                                if k in cell.text:
                                    cell.text.replace(k, v) # might need "<" or "{{" around k

    
    def insert_image(self, document, k, v, image_path=None, config=None):
        
        return True


    def insert_custom(self, document, k, v, config=None):
        # perhaps replaces {{custom_object}} with pre-determined text structure with custom style/format

        return True

