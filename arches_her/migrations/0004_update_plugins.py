from django.db import migrations, models
from django.utils.translation import gettext as _


class Migration(migrations.Migration):

    dependencies = [("arches_her", "0003_add_bng_search_view")]

    accessibility_plugin = '8688eaf9-3605-4384-823c-d01c0d210f82'
    active_consultations = '76a27df9-6f16-47ed-bd47-bb95c0fe7173'

    add_plugin_show_true_accessibility_activecons = """
        UPDATE plugins 
        SET config = jsonb_set(config, '{show}', 'true'::jsonb, true) 
        WHERE pluginid in ('%s','%s');
        """ % (active_consultations, accessibility_plugin)

    remove_plugin_show_accessibility_activecons = """
        UPDATE plugins 
        SET config = config - 'show' 
        WHERE pluginid in ('%s','%s');
        """ % (active_consultations, accessibility_plugin)


    operations = [
        migrations.RunSQL(add_plugin_show_true_accessibility_activecons, remove_plugin_show_accessibility_activecons),
    ]
