from django.urls import include, path, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns
from arches.app.views.plugin import PluginView
from arches_her.views.active_consultations import ActiveConsultationsView
from arches_her.views.index import IndexView
from arches_her.views.map import ApplicationAreas

uuid_regex = settings.UUID_REGEX

urlpatterns = [
    re_path(r"^$", IndexView.as_view(), name="root"),
    re_path(r"^index.htm", IndexView.as_view(), name="home"),
    path("", include("arches.urls")),
    re_path(
        r"^plugins/active-consultations$",
        PluginView.as_view(),
        name="active-consultations",
    ),
    re_path(
        r"^activeconsultations",
        ActiveConsultationsView.as_view(),
        name="activeconsultations",
    ),
    re_path(
        r"^application-areas/(?P<zoom>[0-9]+|\{z\})/(?P<x>[0-9]+|\{x\})/(?P<y>[0-9]+|\{y\}).pbf$",
        ApplicationAreas.as_view(),
        name="application-areas",
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


# Ensure Arches core urls are superseded by project-level urls
urlpatterns.append(path("", include("arches.urls")))

# Adds URL pattern to serve media files during development
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler400 = "arches.app.views.main.custom_400"
handler403 = "arches.app.views.main.custom_403"
handler404 = "arches.app.views.main.custom_404"
handler500 = "arches.app.views.main.custom_500"

# Only handle i18n routing in active project. This will still handle the routes provided by Arches core and Arches applications,
# but handling i18n routes in multiple places causes application errors.
if settings.ROOT_URLCONF == __name__:
    if settings.SHOW_LANGUAGE_SWITCH is True:
        urlpatterns = i18n_patterns(*urlpatterns)

    urlpatterns.append(path("i18n/", include("django.conf.urls.i18n")))
