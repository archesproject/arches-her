from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [("arches_her", "0003_add_bng_search_view")]

    def remove_plugins(apps, schema_editor):
        Plugin = apps.get_model("models", "Plugin")

        for plugin in Plugin.objects.filter(
            pk__in=[
                "b2778828-a6ac-6481-c38b-fd463d878f1f",
                "4dc9bd5a-6e5c-440d-ae3c-af94396e2d72",
                "a1667717-b7bd-4570-b27a-ec352c767e0e",
                "4bd762cf-b581-11e9-a7f9-784f435179ea",
                "0b1499e0-6cdc-403b-a2e3-499c2201069d",
                "49507fb0-89c6-47b7-b506-9b2b29a3b8d8",
            ]
        ):
            plugin.delete()

    def add_back_plugins(apps, schema_editor):
        Plugin = apps.get_model("models", "Plugin")

        Plugin.objects.update_or_create(
            pluginid="b2778828-a6ac-6481-c38b-fd463d878f1f",
            name="Application Area",
            icon="fa fa-building",
            component="views/components/plugins/application-area",
            componentname="application-area",
            config={"show": False},
            slug="application-area",
            sortorder=0,
        )

        Plugin.objects.update_or_create(
            pluginid="4dc9bd5a-6e5c-440d-ae3c-af94396e2d72",
            name="Communication",
            icon="fa fa-comment",
            component="views/components/plugins/communication-workflow",
            componentname="communication-workflow",
            config={"show": False},
            slug="communication-workflow",
            sortorder=1,
        )

        Plugin.objects.update_or_create(
            pluginid="a1667717-b7bd-4570-b27a-ec352c767e0e",
            name="Consultation",
            icon="fa fa-file",
            component="views/components/plugins/consultation-workflow",
            componentname="consultation-workflow",
            config={"show": False},
            slug="consultation-workflow",
            sortorder=0,
        )

        Plugin.objects.update_or_create(
            pluginid="4bd762cf-b581-11e9-a7f9-784f435179ea",
            name="Correspondence",
            icon="fa fa-envelope",
            component="views/components/plugins/correspondence-workflow",
            componentname="correspondence-workflow",
            config={"show": False},
            slug="correspondence-workflow",
            sortorder=1,
        )

        Plugin.objects.update_or_create(
            pluginid="0b1499e0-6cdc-403b-a2e3-499c2201069d",
            name="Site Visit",
            icon="fa fa-clipboard",
            component="views/components/plugins/site-visit",
            componentname="site-visit",
            config={"show": False},
            slug="site-visit",
            sortorder=0,
        )

        Plugin.objects.update_or_create(
            pluginid="49507fb0-89c6-47b7-b506-9b2b29a3b8d8",
            name="Consultations",
            icon="fa fa-play-circle",
            component="views/components/plugins/init-workflow",
            componentname="init-workflow",
            config={
                "workflows": [
                    {
                        "workflowid": "b2778828-a6ac-6481-c38b-fd463d878f1f",
                        "slug": "application-area",
                        "name": "Application Area",
                        "icon": "fa fa-building",
                        "bgColor": "#87bceb",
                        "circleColor": "#a7cdf0",
                        "desc": "An area that may be re-developed or newly built",
                    },
                    {
                        "workflowid": "a1667717-b7bd-4570-b27a-ec352c767e0e",
                        "slug": "consultation-workflow",
                        "name": "Consultation",
                        "icon": "fa fa-file",
                        "bgColor": "#62a3db",
                        "circleColor": "#8bbfea",
                        "desc": "Advice on the potential work related to an application area",
                    },
                    {
                        "workflowid": "4dc9bd5a-6e5c-440d-ae3c-af94396e2d72",
                        "slug": "communication-workflow",
                        "name": "Communication",
                        "icon": "fa fa-comment",
                        "bgColor": "#9795EE",
                        "circleColor": "#8bbbe4",
                        "desc": "A conversation via phone, email, or other channel",
                    },
                    {
                        "workflowid": "0b1499e0-6cdc-403b-a2e3-499c2201069d",
                        "slug": "site-visit",
                        "name": "Site Visit",
                        "icon": "fa fa-clipboard",
                        "bgColor": "#716FE0",
                        "circleColor": "#b0aff0",
                        "desc": "A visit to ensure that a condition has been met",
                    },
                    {
                        "workflowid": "4bd762cf-b581-11e9-a7f9-784f435179ea",
                        "slug": "correspondence-workflow",
                        "name": "Correspondence",
                        "icon": "fa fa-envelope",
                        "bgColor": "#fed04f",
                        "circleColor": "#fedc7d",
                        "desc": "Letter or other document sent to an applicant",
                    },
                ],
                "show": True,
            },
            slug="init-workflow",
            sortorder=0,
        )

    operations = [
        migrations.RunPython(remove_plugins, add_back_plugins),
    ]
