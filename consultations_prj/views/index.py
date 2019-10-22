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
from arches.app.models.resource import Resource
from arches.app.utils.betterJSONSerializer import JSONSerializer, JSONDeserializer
from django.shortcuts import render
from django.views.generic import TemplateView
from arches.app.datatypes.datatypes import DataTypeFactory
from arches.app.utils.permission_backend import get_createable_resource_types


class IndexView(TemplateView):

    template_name = ''

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context['system_settings_graphid'] = settings.SYSTEM_SETTINGS_RESOURCE_MODEL_ID
        context['graph_models'] = []
        context['graphs'] = '[]'
        context['plugins'] = []
        print('hello world')
        for plugin in models.Plugin.objects.all().order_by('sortorder'):
            print('iter plugins')
            if self.request.user.has_perm('view_plugin', plugin):
                context['plugins'].append(plugin)
        # context['createable_resources'] = JSONSerializer().serialize(
        #     get_createable_resource_types(self.request.user),
        #     exclude=['functions',
        #              'ontology',
        #              'subtitle',
        #              'color',
        #              'isactive',
        #              'isresource',
        #              'version',
        #              'deploymentdate',
        #              'deploymentfile',
        #              'author'])
        # context['nav'] = {
        #     'icon': 'fa fa-chevron-circle-right',
        #     'title': '',
        #     'help': {
        #         # title:'',template:'' (leave this commented out)
        #     },
        #     'menu': False,
        #     'search': True,
        #     'res_edit': False,
        #     'login': True,
        #     'print': False,
        # }
        context['user_is_reviewer'] = self.request.user.groups.filter(name='Resource Reviewer').exists()
        context['app_name'] = settings.APP_NAME
        return render(self.request,'index.htm',context)

