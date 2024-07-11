from django.contrib.auth import authenticate, login
from django.shortcuts import redirect
from django.utils.deprecation import MiddlewareMixin


class AutoLogin(MiddlewareMixin):
    def process_request(self, request):
        if (
            not request.user or request.user.username == "anonymous"
        ) and "/auth" not in request.path:
            anon_user = authenticate(anon_login=True)
            if anon_user is not None:
                login(request, anon_user)
                redirect(request.path)
