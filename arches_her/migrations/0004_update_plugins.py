from django.db import migrations, models
from django.utils.translation import gettext as _


class Migration(migrations.Migration):

    dependencies = [("arches_her", "0003_add_bng_search_view")]

    # accessibility plugin = '8688eaf9-3605-4384-823c-d01c0d210f82'
    # active consultations = '76a27df9-6f16-47ed-bd47-bb95c0fe7173'

    add_plugin_show_true = """
        UPDATE plugins 
        SET config = jsonb_set(config, '{show}', 'true'::jsonb, true) 
        WHERE pluginid in ('76a27df9-6f16-47ed-bd47-bb95c0fe7173','8688eaf9-3605-4384-823c-d01c0d210f82');
        """

    remove_plugin_show = """
        UPDATE plugins 
        SET config = config - 'show' 
        WHERE pluginid in ('76a27df9-6f16-47ed-bd47-bb95c0fe7173','8688eaf9-3605-4384-823c-d01c0d210f82');
        """

    operations = [
        migrations.RunSQL(add_plugin_show_true, remove_plugin_show),
    ]
