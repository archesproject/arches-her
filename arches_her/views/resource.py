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

from django.http import HttpResponseNotFound
from django.utils.translation import get_language, ugettext as _
from django.views.generic import View
from arches.app.models.resource import Resource
from arches.app.utils.response import JSONResponse
from arches.app.search.search_engine_factory import SearchEngineFactory
from arches.app.datatypes.datatypes import DataTypeFactory
from arches.app.models.system_settings import settings
from arches_her.views.active_consultations import build_resource_dict
import logging

logger = logging.getLogger(__name__)


class ResourceDescriptors(View):
    def get_localized_descriptor(self, document, descriptor_type):
        language_codes = (get_language(), settings.LANGUAGE_CODE)

        descriptor = document["_source"][descriptor_type]
        result = descriptor[0] if len(descriptor) > 0 else { "value": _("Undefined") }
        for language_code in language_codes:
            for entry in descriptor:
                if entry["language"] == language_code and entry["value"] != "":
                    return entry["value"]
        return result["value"]

    def get(self, request, resourceid=None):
        if Resource.objects.filter(pk=resourceid).exists():
            try:
                active_cons_node_list = {
                    "Geospatial Location": "8d41e4d6-a250-11e9-accd-00224800b26d",
                    "Name": "8d41e4ab-a250-11e9-87d1-00224800b26d",
                    "Consultation Type": "8d41e4dd-a250-11e9-9032-00224800b26d",
                    "Proposal": "8d41e4bd-a250-11e9-89e8-00224800b26d",
                    "Casework Officer": "8d41e4d4-a250-11e9-a3ff-00224800b26d",
                    "Target Date": "8d41e4cb-a250-11e9-9cf2-00224800b26d",
                    "Consultation Log Date": "8d41e4cf-a250-11e9-a86d-00224800b26d",
                    "Completion Date": "8d41e4cd-a250-11e9-a25b-00224800b26d",
                    "Development Type": "8d41e4cc-a250-11e9-87b3-00224800b26d",
                    "Application Type": "8d41e4d5-a250-11e9-b968-00224800b26d",
                    "Application Area": "8d41e4de-a250-11e9-973b-00224800b26d",
                    "Casework Officer": "8d41e4d4-a250-11e9-a3ff-00224800b26d",
                    "Planning Officer": "8d41e4d7-a250-11e9-83c2-00224800b26d",
                    "Owner": "8d41e4e1-a250-11e9-8d14-00224800b26d",
                    "Applicant": "8d41e4ce-a250-11e9-b83c-00224800b26d",
                    "Agent": "8d41e4d9-a250-11e9-82dc-00224800b26d",
                }
                resource = Resource.objects.get(pk=resourceid)
                se = SearchEngineFactory().create()
                document = se.search(index='resources', id=resourceid)
                datatype_factory = DataTypeFactory()
                additional_data = {}
                if document['_source']['graph_id'] == '8d41e49e-a250-11e9-9eab-00224800b26d':
                    tiles = build_resource_dict([resource], active_cons_node_list, datatype_factory)
                    additional_data = tiles[0]
                ret = {
                    'graphid': document['_source']['graph_id'],
                    'graph_name': resource.graph.name,
                    'displaydescription': self.get_localized_descriptor(document, 'displaydescription'),
                    'map_popup': self.get_localized_descriptor(document, 'map_popup'),
                    'displayname': self.get_localized_descriptor(document, 'displayname'),
                    'geometries': document['_source']['geometries']
                }
                ret.update(additional_data)
                return JSONResponse(ret)
            except Exception as e:
                logger.exception(_('Failed to fetch resource instance descriptors'))

        return HttpResponseNotFound()