from django.shortcuts import render
from arches.app.models.system_settings import settings
from arches.app.views.base import BaseManagerView
from arches.app.views.plugin import PluginView

class ConsultationView(PluginView):

    def get(self, request, pluginid=None, slug='consultation-workflow'):
        return super(ConsultationView, self).get(request, pluginid=pluginid, slug=slug)
