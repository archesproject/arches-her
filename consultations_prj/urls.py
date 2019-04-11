from django.conf.urls import include, url
from django.conf import settings
from django.conf.urls.static import static
from consultations_prj.views.main import ConsultationView

urlpatterns = [
    url(r'^', include('arches.urls')),
    url(r'^consultations/', include('arches.urls', namespace='consultations')),
    url(r'^consultations', ConsultationView.as_view(), name='consultations')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
