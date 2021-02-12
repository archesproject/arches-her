from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

import platform

if platform.system().lower() == "windows":
	os.environ.setdefault("FORKED_BY_MULTIPROCESSING","1")

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'arches_her.settings')
app = Celery('arches_her')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
