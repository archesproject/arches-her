from django.shortcuts import render
from arches.app.models.system_settings import settings
from arches.app.views.base import BaseManagerView
from arches.app.views.plugin import PluginView


class ConsultationView(PluginView):

    def get(self, request, pluginid=None, slug='consultation-workflow'):
        return super(ConsultationView, self).get(request, pluginid=pluginid, slug=slug)

    def index(self, request):
        context = {}
        context['plugins'] = []
        context['main_script'] = 'index'
        context['active_page'] = 'Home'
        context['app_title'] = settings.APP_TITLE
        context['copyright_text'] = settings.COPYRIGHT_TEXT
        context['copyright_year'] = settings.COPYRIGHT_YEAR
        print('hello world')
        for plugin in models.Plugin.objects.all().order_by('sortorder'):
            print('iter plugins')
            if self.request.user.has_perm('view_plugin', plugin):
                context['plugins'].append(plugin)

        return render(request, 'index.htm', context)
