from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from datetime import datetime
import time
from celery.schedules import crontab
import consultations_prj.tasks as tasks

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'consultations_prj.settings')
app = Celery('consultations_prj')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(60.0, delete_file.s(), name='deleting file')
    sender.add_periodic_task(25.0, test.s('The celery beat is running'))

@app.task
def delete_file():
    now = datetime.timestamp(datetime.now())
    CURRENT_DIR = '/Users/njk/Dropbox/arches_projects/arches_py3/miscellaneous/subdir/'
    EXPIRES = 30
    file_list = []
    counter = 0
    with os.scandir(CURRENT_DIR) as current_files:
        for file in current_files:
            file_stat = os.stat(os.path.join(CURRENT_DIR,file))
            if now-file_stat.st_ctime > EXPIRES:
                file_list.append(file.name)
    for file in file_list:
        os.remove(os.path.join(CURRENT_DIR,file))
        counter += 1
    return "{} files deleted".format(counter)

@app.task
def test(arg):
    return arg
