import re
from django.http import HttpResponseRedirect
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin

class RedirectToConsultations(MiddlewareMixin):
    """
    This middleware lets you match a specific url and redirect the request to a
    new url.

    """

    def process_request(self, request):
        project_name = 'consultations'
        source = request.META.get('HTTP_REFERER')
        host = request.META['HTTP_HOST']
        path = request.META['PATH_INFO']
        url_scheme = request.META['wsgi.url_scheme']
        destination_paths = (
            r'^/resource',
            r'^/add-resource',
            r'^/search$',
            r'^/report',
        )
        if source is not None and project_name in source and 'consultations' not in path:
            urlmatch = any(map(lambda x: re.compile(x).match(path), destination_paths))
            if urlmatch:
                destination = '{0}://{1}/{2}{3}'.format(url_scheme, host, project_name, path)
                return HttpResponseRedirect(destination)
