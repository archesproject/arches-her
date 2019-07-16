from django.conf.urls import include, url
from django.conf import settings
from django.conf.urls.static import static
from consultations_prj.views.main import ConsultationView
from django.views.generic import RedirectView

urlpatterns = [
    url(r'^', include('arches.urls')),
    url(r'^consultations/', include('arches.urls', namespace='consultations')),
    url(r'^consultations/active', RedirectView.as_view(url='/plugins/active-consultations'),
        name='active-consultations'),
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
