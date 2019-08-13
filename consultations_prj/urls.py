from django.conf.urls import include, url
from django.conf import settings
from django.conf.urls.static import static
from consultations_prj.views.main import ConsultationView
from consultations_prj.views.file_template import FileTemplateView
from django.views.generic import RedirectView
from consultations_prj.views.active_consultations import ActiveConsultationsView

urlpatterns = [
    url(r'^', include('arches.urls')),
    url(r'^consultations/', include('arches.urls', namespace='consultations')),
    # url(r'^consultations', ConsultationView.as_view(), name='consultations'),
    url(r'^filetemplate', FileTemplateView.as_view(), name='filetemplate'),
    url(r'^consultations/active', RedirectView.as_view(url='/plugins/active-consultations'),
        name='active-consultations'),
    url(r'^activeconsultations', ActiveConsultationsView.as_view(),
        name='activeconsultations'),
    url(r'^consultations/consultation-workflow', RedirectView.as_view(url='/plugins/consultation-workflow'),
        name='consultation-workflow'),
    url(r'^consultations/application-area', RedirectView.as_view(url='/plugins/application-area'),
        name='application-area'),
    url(r'^consultations/site-visit', RedirectView.as_view(url='/plugins/site-visit'), name='site-visit'),
    url(r'^consultations/correspondence-workflow', RedirectView.as_view(url='/plugins/correspondence-workflow'),
        name='correspondence-workflow'),
    url(r'^consultations/communication-workflow', RedirectView.as_view(url='/plugins/communication-workflow'),
        name='communication-workflow'),
    url(r'^consultations/init-workflow', RedirectView.as_view(url='/plugins/init-workflow'), name='init-workflow')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
