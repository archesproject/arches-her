from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'arches_her.settings')
app = Celery('arches_her')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
