"""
Django settings for arches_her project.
"""

import json
import os
import sys
from arches import __version__
import inspect
from django.utils.translation import gettext_lazy as _

try:
    from arches.settings import *
except ImportError:
    pass

APP_NAME = 'arches_her'
APP_ROOT = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
APP_PATHNAME = "arches-her"

DATATYPE_LOCATIONS.append("arches_her.datatypes")
FUNCTION_LOCATIONS.append("arches_her.functions")
TEMPLATES[0]["DIRS"].append(os.path.join(APP_ROOT, "functions", "templates"))
TEMPLATES[0]["DIRS"].append(os.path.join(APP_ROOT, "widgets", "templates"))
TEMPLATES[0]["DIRS"].insert(0, os.path.join(APP_ROOT, "templates"))
TEMPLATES[0]["OPTIONS"]["context_processors"].append(
    "arches_her.utils.context_processors.project_settings"
)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "vwo1!nn5s0m)89@pn7^!4a^+_+7mdhk^=&$zrwi(n2lisgi0_w"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ROOT_URLCONF = "arches_her.urls"

# a prefix to append to all elasticsearch indexes, note: must be lower case
ELASTICSEARCH_PREFIX = "arches_her"

SEARCH_EXPORT_IMMEDIATE_DOWNLOAD_THRESHOLD = 2000  # The maximum number of instances a user can download from search export without celery
SEARCH_EXPORT_LIMIT = 15000  # The maximum documents ElasticSearch will return in an export - **System Settings**

BYPASS_CARDINALITY_TILE_VALIDATION = False
ETL_MODULE_LOCATIONS.append("arches_her.etl_modules")

CELERY_BROKER_URL = "amqp://guest:guest@localhost"
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_RESULT_BACKEND = "django-db"
CELERY_TASK_SERIALIZER = "json"
CELERY_SEARCH_EXPORT_EXPIRES = 60 * 3  # seconds
CELERY_SEARCH_EXPORT_CHECK = 15  # seconds

CELERY_BEAT_SCHEDULE = {
    "delete-expired-search-export": {
        "task": "arches.app.tasks.delete_file",
        "schedule": CELERY_SEARCH_EXPORT_CHECK,
    },
    "notification": {
        "task": "arches.app.tasks.message",
        "schedule": CELERY_SEARCH_EXPORT_CHECK,
        "args": ("Celery Beat is Running",),
    },
}

DATABASES = {
    "default": {
        "ATOMIC_REQUESTS": False,
        "AUTOCOMMIT": True,
        "CONN_MAX_AGE": 0,
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "HOST": "localhost",
        "NAME": "arches_her",
        "OPTIONS": {},
        "PASSWORD": "postgis",
        "PORT": "5432",
        "POSTGIS_TEMPLATE": "template_postgis",
        "TEST": {"CHARSET": None, "COLLATION": None, "MIRROR": None, "NAME": None},
        "TIME_ZONE": None,
        "USER": "postgres",
    }
}


ALLOWED_HOSTS = []

SYSTEM_SETTINGS_LOCAL_PATH = os.path.join(
    APP_ROOT, "system_settings", "System_Settings.json"
)
WSGI_APPLICATION = "arches_her.wsgi.application"

STATIC_ROOT = os.path.join(ROOT_DIR, "staticfiles")
STATIC_URL = "/static/"
STATICFILES_DIRS =  (
    os.path.join(APP_ROOT, 'media', 'build'),
    os.path.join(APP_ROOT, 'media'),
) + STATICFILES_DIRS

WEBPACK_LOADER = {
    "DEFAULT": {
        "STATS_FILE": os.path.join(APP_ROOT, 'webpack/webpack-stats.json'),
    },
}

RESOURCE_IMPORT_LOG = os.path.join(APP_ROOT, "logs", "resource_import.log")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "console": {
            "format": "%(asctime)s %(name)-12s %(levelname)-8s %(message)s",
        },
    },
    "handlers": {
        "file": {
            "level": "WARNING",  # DEBUG, INFO, WARNING, ERROR
            "class": "logging.FileHandler",
            "filename": os.path.join(APP_ROOT, "arches.log"),
            "formatter": "console",
        },
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "console",
        },
    },
    "loggers": {
        "arches": {"handlers": ["file", "console"], "level": "DEBUG", "propagate": True}
    },
}

MIDDLEWARE = [
    #'debug_toolbar.middleware.DebugToolbarMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    #'arches.app.utils.middleware.TokenMiddleware',
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "arches.app.utils.middleware.ModifyAuthorizationHeader",
    "oauth2_provider.middleware.OAuth2TokenMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "arches.app.utils.middleware.SetAnonymousUser",
]


# Absolute filesystem path to the directory that will hold user-uploaded files.

MEDIA_ROOT = os.path.join(APP_ROOT)

TILE_CACHE_CONFIG = {
    "name": "Disk",
    "path": os.path.join(APP_ROOT, "tileserver", "cache")
    # to reconfigure to use S3 (recommended for production), use the following
    # template:
    # "name": "S3",
    # "bucket": "<bucket name>",
    # "access": "<access key>",
    # "secret": "<secret key>"
}

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.memcached.MemcachedCache",
        "LOCATION": "127.0.0.1:11211",
    },
    "user_permission": {
        "BACKEND": "django.core.cache.backends.db.DatabaseCache",
        "LOCATION": "user_permission_cache",
    },
}

# Identify the usernames and duration (seconds) for which you want to cache the time wheel
CACHE_BY_USER = {"anonymous": 3600 * 24}

OAUTH_CLIENT_ID = ""
MOBILE_DEFAULT_ONLINE_BASEMAP = {"default": "mapbox://styles/mapbox/streets-v9"}

LANGUAGES = [
    # ("de", _("German")),
    ("en", _("English")),
    # ("en-gb", _("British English")),
    # ("es", _("Spanish")),
    # ("ar", _("Arabic")),
]

SESSION_COOKIE_NAME = f"{APP_NAME}_{__version__}"
APP_TITLE = "Arches-HER"
COPYRIGHT_TEXT = "All Rights Reserved."
COPYRIGHT_YEAR = "2020"
DOCKER = False

try:
    from .package_settings import *
except ImportError:
    pass

try:
    from .settings_local import *
except ImportError:
    pass

if DOCKER:
    try:
        from .settings_docker import *
    except ImportError:
        pass

# returns an output that can be read by NODEJS
if __name__ == "__main__":
    print(
        json.dumps({
            'ARCHES_NAMESPACE_FOR_DATA_EXPORT': ARCHES_NAMESPACE_FOR_DATA_EXPORT,
            'STATIC_URL': STATIC_URL,
            'ROOT_DIR': ROOT_DIR,
            'APP_ROOT': APP_ROOT,
            'WEBPACK_DEVELOPMENT_SERVER_PORT': WEBPACK_DEVELOPMENT_SERVER_PORT,
        })
    )
    sys.stdout.flush()