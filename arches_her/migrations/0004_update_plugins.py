from django.db import migrations, models
from django.utils.translation import gettext as _


class Migration(migrations.Migration):

    dependencies = [("arches_her", "0003_add_bng_search_view")]

    def update_plugins(apps, scheme_editor):
        Plugin = apps.get_model("models", "Plugin")

        active_consultations = Plugin.objects.get(pluginid="76a27df9-6f16-47ed-bd47-bb95c0fe7173")
        active_consultations.config["show"] = True
        active_consultations.save()

        accessibility_statement = Plugin.objects.get(pluginid="8688eaf9-3605-4384-823c-d01c0d210f82")
        accessibility_statement.config["show"] = True
        accessibility_statement.save()

    def remove_plugin_updates(apps, scheme_editor):
        Plugin = apps.get_model("models", "Plugin")

        active_consultations = Plugin.objects.get(pluginid="76a27df9-6f16-47ed-bd47-bb95c0fe7173")
        active_consultations.config.pop("show", None)
        active_consultations.save()

        accessibility_statement = Plugin.objects.get(pluginid="8688eaf9-3605-4384-823c-d01c0d210f82")
        accessibility_statement.config.pop("show", None)
        accessibility_statement.save()

    operations = [
        migrations.RunPython(update_plugins, remove_plugin_updates),
    ]
