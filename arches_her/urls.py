from django.urls import include, path, re_path
from django.conf import settings
from django.conf.urls.static import static
#from django.conf.urls.i18n import i18n_patterns
from arches.app.views.plugin import PluginView
from arches_her.views.file_template import FileTemplateView
from arches_her.views.active_consultations import ActiveConsultationsView
from arches_her.views.index import IndexView
from arches_her.views.datatype_document import DatatypeDocumentView, ResourceDocumentView

uuid_regex = settings.UUID_REGEX

urlpatterns = [
    re_path(r'^$', IndexView.as_view(), name='root'),
    re_path(r'^index.htm', IndexView.as_view(), name='home'),
    path('', include('arches.urls')),
    re_path(r'^filetemplate', FileTemplateView.as_view(), name='filetemplate'),
    re_path(r'^plugins/active-consultations$', PluginView.as_view(), name='active-consultations'),
    re_path(r'^activeconsultations', ActiveConsultationsView.as_view(), name='activeconsultations'),
    re_path(r'^plugins/application-area', PluginView.as_view(), name='application-area'),
    re_path(r'^plugins/consultation-workflow', PluginView.as_view(), name='consultation-workflow'),
    re_path(r'^plugins/site-visit', PluginView.as_view(), name='site-visit'),
    re_path(r'^plugins/correspondence-workflow', PluginView.as_view(), name='correspondence-workflow'),
    re_path(r'^plugins/communication-workflow', PluginView.as_view(), name='communication-workflow'),
    re_path(r'^plugins/init-workflow', PluginView.as_view(), name='init-workflow'),
    re_path(
        r"^datatype_document/(?P<tileid>%s)$" % uuid_regex, DatatypeDocumentView.as_view(), name="datatype_document"
    ),
    re_path(
        r"^datatype_document/(?P<tileid>%s)/(?P<nodeid>%s|())$" % (uuid_regex, uuid_regex), DatatypeDocumentView.as_view(), name="datatype_document"
    ),
    re_path(
        r"^resource_document/(?P<resourceid>%s)$" % uuid_regex, ResourceDocumentView.as_view(), name="resource_document"
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# if settings.SHOW_LANGUAGE_SWITCH is True:
#     urlpatterns = i18n_patterns(*urlpatterns)