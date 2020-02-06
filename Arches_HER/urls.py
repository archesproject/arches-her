from arches.app.views.plugin import PluginView
from django.conf.urls import include, url
from django.conf import settings
from django.conf.urls.static import static
from Arches_HER.views.main import ConsultationView
from Arches_HER.views.file_template import FileTemplateView
from Arches_HER.views.index import IndexView
from Arches_HER.views.consultations_help import HelpView
from Arches_HER.views.consultations_about import AboutView
from Arches_HER.views import search
from django.views.generic import RedirectView
from Arches_HER.views.resource import ResourceDescriptors
from Arches_HER.views.active_consultations import ActiveConsultationsView
from arches.app.views import main
from arches.app.views.user import UserManagerView

uuid_regex = settings.UUID_REGEX

urlpatterns = [
    url(r'^$', IndexView.as_view(), name='root'),
    url(r'^index.htm', IndexView.as_view(), name='home'),
    url(r'^Arches-HER/index.htm', IndexView.as_view(), name='consultations-home'),
    url(r'^Arches-HER/search$', search.SearchView.as_view(), name="search_home_consultations"),
    url(r'^Arches-HER/search/resources$', search.search_results, name="search_results"),
    url(r'^Arches-HER/', include('arches.urls')),
    url(r'^Arches-HER/consultations-help$', HelpView.as_view(), name="consultations-help"),
    url(r'^Arches-HER/consultations-about$', AboutView.as_view(), name="consultations-about"),
    url(r'^plugins/active-consultations$', RedirectView.as_view(url='/Arches-HER/plugins/active-consultations')),
    url(r'^resource/standard', RedirectView.as_view(url='/resource'), name='standard'),
    url(r'^resource/descriptors/(?P<resourceid>%s|())$' % uuid_regex, ResourceDescriptors.as_view(), name="resource_descriptors"),
    url(r'^Arches-HER/index.htm', IndexView.as_view(), name='home'),
    url(r'^', include('arches.urls')),
    # url(r'^consultations', ConsultationView.as_view(), name='consultations'),
    # url(r'^Arches-HER/index.htm', main.index, name='home'),
    url(r'^Arches-HER/user$', UserManagerView.as_view(), name="user_profile_manager"),
    url(r'^filetemplate', FileTemplateView.as_view(), name='filetemplate'),
    url(r'^Arches-HER/plugins/active-consultations', PluginView.as_view(), name='active-consultations'),
    url(r'^activeconsultations', ActiveConsultationsView.as_view(),
        name='activeconsultations'),
    url(r'^Arches-HER/plugins/consultation-workflow', PluginView.as_view(), name='consultation-workflow'),
    url(r'^Arches-HER/plugins/application-area', PluginView.as_view(), name='application-area'),
    url(r'^Arches-HER/plugins/site-visit', PluginView.as_view(), name='site-visit'),
    url(r'^Arches-HER/plugins/correspondence-workflow', PluginView.as_view(), name='correspondence-workflow'),
    url(r'^Arches-HER/plugins/communication-workflow', PluginView.as_view(), name='communication-workflow'),
    url(r'^Arches-HER/plugins/init-workflow', PluginView.as_view(), name='init-workflow'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
