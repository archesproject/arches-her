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

    def workflow_config_update(apps, scheme_editor):
        Plugin = apps.get_model("models", "Plugin")

        init_workflow_plugin = Plugin.objects.get(pluginid="49507fb0-89c6-47b7-b506-9b2b29a3b8d8")

        # All plugin config exists within init-workflow, here we extract it and apply to the respective plugin
        for wf_config in init_workflow_plugin.config["workflows"]:
            inner_worfklow_plugin = Plugin.objects.get(pluginid=wf_config["workflowid"])

            inner_worfklow_plugin.config = {"show": False,
                                            "is_workflow": True,
                                            "description": wf_config["desc"],
                                            "thumbnailBackgroundColor": wf_config["bgColor"],
                                            "thumbnailCircleColor": wf_config["circleColor"],
                                            }
            inner_worfklow_plugin.save()

        # clear list from init-workflow (del list produces error)
        init_workflow_plugin.config["workflows"] = []
        init_workflow_plugin.save()

    def revert_workflow_config(apps, schema_editor):
        Plugin = apps.get_model("models", "Plugin")
        init_workflow_plugin = Plugin.objects.get(pluginid="49507fb0-89c6-47b7-b506-9b2b29a3b8d8")

        # Revert the workflows list in the init-workflow plugin
        workflows_config_list = [
            {
                "desc": "An area that may be re-developed or newly built",
                "icon": "fa fa-building",
                "name": "Application Area",
                "slug": "application-area",
                "bgColor": "#87bceb",
                "workflowid": "b2778828-a6ac-6481-c38b-fd463d878f1f",
                "circleColor": "#a7cdf0",
            },
            {
                "desc": "Advice on the potential work related to an application area",
                "icon": "fa fa-file",
                "name": "Consultation",
                "slug": "consultation-workflow",
                "bgColor": "#62a3db",
                "workflowid": "a1667717-b7bd-4570-b27a-ec352c767e0e",
                "circleColor": "#8bbfea",
            },
            {
                "desc": "A conversation via phone, email, or other channel",
                "icon": "fa fa-comment",
                "name": "Communication",
                "slug": "communication-workflow",
                "bgColor": "#9795EE",
                "workflowid": "4dc9bd5a-6e5c-440d-ae3c-af94396e2d72",
                "circleColor": "#8bbbe4",
            },
            {
                "desc": "A visit to ensure that a condition has been met",
                "icon": "fa fa-clipboard",
                "name": "Site Visit",
                "slug": "site-visit",
                "bgColor": "#716FE0",
                "workflowid": "0b1499e0-6cdc-403b-a2e3-499c2201069d",
                "circleColor": "#b0aff0",
            },
            {
                "desc": "Letter or other document sent to an applicant",
                "icon": "fa fa-envelope",
                "name": "Correspondence",
                "slug": "correspondence-workflow",
                "bgColor": "#fed04f",
                "workflowid": "4bd762cf-b581-11e9-a7f9-784f435179ea",
                "circleColor": "#fedc7d",
            },
        ]
        init_workflow_plugin.config["workflows"] = workflows_config_list

        # Revert config for each workflow plugin
        workflow_existing_config = {"show": False, "description": {"en": None}, "i18n_properties": ["description"]}

        application_area = Plugin.objects.get(pluginid="b2778828-a6ac-6481-c38b-fd463d878f1f")
        application_area.config = workflow_existing_config
        application_area.save()

        communication = Plugin.objects.get(pluginid="4dc9bd5a-6e5c-440d-ae3c-af94396e2d72")
        communication.config = workflow_existing_config
        communication.save()

        consultation = Plugin.objects.get(pluginid="a1667717-b7bd-4570-b27a-ec352c767e0e")
        consultation.config = workflow_existing_config
        consultation.save()

        correspondence = Plugin.objects.get(pluginid="4bd762cf-b581-11e9-a7f9-784f435179ea")
        correspondence.config = workflow_existing_config
        correspondence.save()

        site_visit = Plugin.objects.get(pluginid="0b1499e0-6cdc-403b-a2e3-499c2201069d")
        site_visit.config = workflow_existing_config
        site_visit.save()

    def add_workflow_help_templates(apps, schema_editor):
        Plugin = apps.get_model("models", "Plugin")

        application_area = Plugin.objects.get(pluginid="b2778828-a6ac-6481-c38b-fd463d878f1f")
        application_area.helptemplate = "application-area-workflow-help"
        application_area.save()

        communication = Plugin.objects.get(pluginid="4dc9bd5a-6e5c-440d-ae3c-af94396e2d72")
        communication.helptemplate = "communication-workflow-help"
        communication.save()

        consultation = Plugin.objects.get(pluginid="a1667717-b7bd-4570-b27a-ec352c767e0e")
        consultation.helptemplate = "consultation-workflow-help"
        consultation.save()

        correspondence = Plugin.objects.get(pluginid="4bd762cf-b581-11e9-a7f9-784f435179ea")
        correspondence.helptemplate = "correspondence-workflow-help"
        correspondence.save()

        site_visit = Plugin.objects.get(pluginid="0b1499e0-6cdc-403b-a2e3-499c2201069d")
        site_visit.helptemplate = "site-visit-workflow-help"
        site_visit.save()

    def remove_workflow_help_templates(apps, schema_editor):
        Plugin = apps.get_model("models", "Plugin")

        application_area = Plugin.objects.get(pluginid="b2778828-a6ac-6481-c38b-fd463d878f1f")
        application_area.helptemplate = None
        application_area.save()

        communication = Plugin.objects.get(pluginid="4dc9bd5a-6e5c-440d-ae3c-af94396e2d72")
        communication.helptemplate = None
        communication.save()

        consultation = Plugin.objects.get(pluginid="a1667717-b7bd-4570-b27a-ec352c767e0e")
        consultation.helptemplate = None
        consultation.save()

        correspondence = Plugin.objects.get(pluginid="4bd762cf-b581-11e9-a7f9-784f435179ea")
        correspondence.helptemplate = None
        correspondence.save()

        site_visit = Plugin.objects.get(pluginid="0b1499e0-6cdc-403b-a2e3-499c2201069d")
        site_visit.helptemplate = None
        site_visit.save()


    operations = [
        migrations.RunSQL(add_plugin_show_true_accessibility_activecons, remove_plugin_show_accessibility_activecons),
        migrations.RunPython(workflow_config_update, revert_workflow_config),
        migrations.RunPython(add_workflow_help_templates, remove_workflow_help_templates),
    ]
