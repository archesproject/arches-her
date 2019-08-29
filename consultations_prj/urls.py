from arches.app.views.plugin import PluginView
from django.conf.urls import include, url
from django.conf import settings
from django.conf.urls.static import static
from consultations_prj.views.main import ConsultationView
from consultations_prj.views.file_template import FileTemplateView
from consultations_prj.views import search
from django.views.generic import RedirectView
from consultations_prj.views.active_consultations import ActiveConsultationsView

urlpatterns = [
    url(r'^consultations/search$', search.SearchView.as_view(), name="search_home"),
    url(r'^consultations/search/resources$', search.search_results, name="search_results"),
    url(r'^consultations/', include('arches.urls', namespace='consultations')),
    url(r'^', include('arches.urls')),
    # url(r'^consultations', ConsultationView.as_view(), name='consultations'),
    url(r'^filetemplate', FileTemplateView.as_view(), name='filetemplate'),
    url(r'^consultations/plugins/active-consultations', PluginView.as_view(), name='active-consultations'),
    url(r'^activeconsultations', ActiveConsultationsView.as_view(),
        name='activeconsultations'),
    url(r'^consultations/plugins/consultation-workflow', PluginView.as_view(), name='consultation-workflow'),
    url(r'^consultations/plugins/application-area', PluginView.as_view(), name='application-area'),
    url(r'^consultations/plugins/site-visit', PluginView.as_view(), name='site-visit'),
    url(r'^consultations/plugins/correspondence-workflow', PluginView.as_view(), name='correspondence-workflow'),
    url(r'^consultations/plugins/communication-workflow', PluginView.as_view(), name='communication-workflow'),
    url(r'^consultations/plugins/init-workflow', PluginView.as_view(), name='init-workflow'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
