import re
from django.http import HttpResponseRedirect
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from arches.app.models.system_settings import settings


class RedirectToConsultations(MiddlewareMixin):
    """
    Redirects a user to the workflow environment if they came from that environment and
    their destination url passes one of several regex tests.

    """

    def process_request(self, request):
        project_name = settings.APP_PATHNAME
        source = request.META.get('HTTP_REFERER')
        host = request.META['HTTP_HOST']
        path = request.META['PATH_INFO']
        url_scheme = request.META['wsgi.url_scheme']
        destination_paths = (
            r'^/resource/(?P<resourceid>{0})'.format(settings.UUID_REGEX),
            r'^/add-resource',
            r'^/search$',
            r'^/report',
        )

        if source is not None and project_name in source and project_name not in path:
            urlmatch = any(map(lambda x: re.compile(x).match(path), destination_paths))
            if urlmatch:
                destination = '{0}://{1}/{2}{3}'.format(url_scheme, host, project_name, path)
                return HttpResponseRedirect(destination)
