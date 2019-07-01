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
from django.contrib.auth.models import User, Group
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
from arches.app.utils.decorators import group_required
from arches.app.utils.geo_utils import GeoUtils
from arches.app.utils.couch import Couch
from arches.app.models import models
from arches.app.models.card import Card
from arches.app.models.resource import Resource
from arches.app.models.system_settings import settings
from arches.app.views.base import BaseManagerView
from arches.app.views.base import MapBaseManagerView
import arches.app.views.search as search

# This should probably be added using a django app. 
# The view should take the name of a docx template file, 
# populate the template with tile data and return the processed xml (probably just as a string). 
# This consultations app may have a model that stores the the template name along with what tiles are needed to complete the template.

# basically: assume the template has {{variable}} written in it. Write a function to find and replace these, given tile data

# first: iterate through the following:
# --sections (header.paragraphs/.tables, footer.paragraphs/.tables)...runs
# --document.paragraphs/.tables...runs

# "Letter Type" is likely a concept in a concept-list

class FileTemplateView(View):

    doc = None
    tile_data = ''

    # Presumably we get the following:
    # - concept_id of the selected correspondence_type
    # (Passed in via tile:)
    #   - graph_id of correspondence
    #   - resourceinstance_id for this resource
    #   - date value 

    # Somehow get the docx file from the server

    def get(request): 
        # resource_instanceid, templateid 
        graphs = models.GraphModel.objects.filter(isresource=True).exclude(graphid=settings.SYSTEM_SETTINGS_RESOURCE_MODEL_ID)
        resources = []
        all_ordered_card_ids = []
        proj = MobileSurvey.objects.get(id=surveyid)
        all_ordered_card_ids = proj.get_ordered_cards()
        active_graphs = set([unicode(card.graph_id) for card in models.CardModel.objects.filter(cardid__in=all_ordered_card_ids)])
        for i, graph in enumerate(graphs):
            cards = []
            if unicode(graph.graphid) in active_graphs:
                cards = [Card.objects.get(pk=card.cardid) for card in models.CardModel.objects.filter(graph=graph)]
                resources.append({'name': graph.name, 'id': graph.graphid, 'subtitle': graph.subtitle, 'iconclass': graph.iconclass, 'cards': cards})

        return JSONResponse({'success': True, 'resources': resources})


    def get_template(self, concept_id):
        # not sure what the proper way to load the actual file onto the server is.
        # Lib docs say Document() needs either a path to the .docx file or a "file-like object". 

        template_file = models.CorrespondenceTemplate.objects.get(templateid=concept_id) # this model does not exist yet
        file_name = template_file["path"] # this step might be unnecessary
        self.doc = Document(file_name)

        # use dict to get file path, lookup in local dir in Proj


    def get_tile_data(self, resource_instance_id):
        resource_instance = Resource.objects.get(resourceinstanceid = resource_instance_id)
        # from here need to lookup the widget labels and tile.data of each node
        # pseudo-code:
        # for tile in resource_instance.tiles:
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




    # def get(self, request):
    #     mobile_survey_models = models.MobileSurveyModel.objects.order_by('name')
    #     mobile_surveys = []
    #     serializer = JSONSerializer()
    #     for survey in mobile_survey_models:
    #         survey.deactivate_expired_survey()
    #         serialized_survey = serializer.serializeToPython(survey)
    #         serialized_survey['edited_by'] = {
    #             'username': survey.lasteditedby.username,
    #             'first': survey.lasteditedby.first_name,
    #             'last': survey.lasteditedby.last_name,
    #             'id': survey.lasteditedby.id
    #             }
    #         serialized_survey['created_by'] = created_by = {
    #             'username': survey.createdby.username,
    #             'first': survey.createdby.first_name,
    #             'last': survey.createdby.last_name,
    #             'id': survey.createdby.id
    #             }
    #         mobile_surveys.append(serialized_survey)
    #     context = self.get_context_data(
    #         mobile_surveys=serializer.serialize(mobile_surveys, sort_ks=False),
    #         main_script='views/mobile-survey-manager',
    #     )
    #     context['nav']['title'] = _('Arches Collector Manager')
    #     context['nav']['icon'] = 'fa-server'
    #     context['nav']['help'] = {
    #         'title': _('Arches Collector Manager'),
    #         'template': 'arches-collector-manager-help',
    #     }

    #     return render(request, 'views/mobile-survey-manager.htm', context)



    # def post(self, request, templateid):
    #     data = JSONDeserializer().deserialize(request.body)
        

    #     return JSONResponse({'success': True, 'template': template})

