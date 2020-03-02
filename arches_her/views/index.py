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

from arches.app.models import models
from arches.app.models.system_settings import settings
from arches_her.settings import APP_TITLE
from arches.app.models.resource import Resource
from arches.app.utils.betterJSONSerializer import JSONSerializer, JSONDeserializer
from django.shortcuts import render
from django.views.generic import TemplateView
from arches.app.datatypes.datatypes import DataTypeFactory
from arches.app.utils.permission_backend import get_createable_resource_types


class IndexView(TemplateView):

    template_name = ''

    def get(self, request):
        context = {}
        context['system_settings_graphid'] = settings.SYSTEM_SETTINGS_RESOURCE_MODEL_ID
        context['graph_models'] = []
        context['graphs'] = '[]'
        context['app_title'] = APP_TITLE
        context['plugins'] = []
        context['plugin_labels'] = {
            'active-consultations':'Active',
            'init-workflow':'New'
        }
        context['main_script'] = 'index'
        user_check = request.user.is_authenticated and request.user.username != 'anonymous'
        for plugin in models.Plugin.objects.all().order_by('sortorder'):
            if plugin.slug in context['plugin_labels'].keys() and request.user.has_perm('view_plugin', plugin) and user_check:
                plugin.name = context['plugin_labels'][plugin.slug]
                context['plugins'].append(plugin)

        context['user_is_reviewer'] = request.user.groups.filter(name='Resource Reviewer').exists()

        return render(request, 'index.htm', context)
