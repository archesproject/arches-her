from django.contrib.auth.models import User
from django.conf import settings


class DemoAuthBackend(object):
    def authenticate(self, request, anon_login=False, **kwargs):
        try:
            if anon_login:
                user = User.objects.get(username=settings.ANONYMOUS_USER)
                return user
            else:
                return None
        except:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
