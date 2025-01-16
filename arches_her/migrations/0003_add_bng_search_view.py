from django.db import migrations, models
from django.utils.translation import gettext as _


class Migration(migrations.Migration):

    dependencies = [
        ("arches_her", "0002_move_pkg_sql"),
        ("models", "10804_core_search_filters"),        
    ]

    def add_bng_component_to_search_view(apps, scheme_editor):
        SearchComponent = apps.get_model("models", "SearchComponent")

        standard_search_view = SearchComponent.objects.get(searchcomponentid="69695d63-6f03-4536-8da9-841b07116381")
        standard_search_view.config["linkedSearchFilters"].append(
            {
                "componentname": "bng-filter",
                "layoutSortorder": 14,
                "searchcomponentid": "25ca3536-9eb4-4fd5-b2a5-badfd9a266de"
            }
        )
        standard_search_view.save()
    
    def remove_bng_component_from_search_view(apps, scheme_editor):
        SearchComponent = apps.get_model("models", "SearchComponent")

        standard_search_view = SearchComponent.objects.get(searchcomponentid="69695d63-6f03-4536-8da9-841b07116381")
        for search_filter in standard_search_view.config["linkedSearchFilters"]:
            if search_filter["searchcomponentid"] == "25ca3536-9eb4-4fd5-b2a5-badfd9a266de":
                standard_search_view.config["linkedSearchFilters"].remove(search_filter)
        standard_search_view.save()
    

    def apply_bng_layout_type(apps, scheme_editor):
        SearchComponent = apps.get_model("models", "SearchComponent")

        SearchComponent.objects.update_or_create(
            searchcomponentid="25ca3536-9eb4-4fd5-b2a5-badfd9a266de",
            name="BNG Filter",
            icon="fa fa-compass",
            modulename="bng-filter.py",
            classname="BngFilter",
            componentpath="views/components/search/bng-filter",
            componentname="bng-filter",
            defaults={
                "config":{"layoutType": "popup"}, # add previous layout type into new config
                "type":"bng-filter-type" # previously "popup" which has now moved
            }
        )

    def revert_bng_layout_type(apps, scheme_editor):
        SearchComponent = apps.get_model("models", "SearchComponent")

        # Revert BNG search component to how it used to be
        SearchComponent.objects.update_or_create(
            searchcomponentid="25ca3536-9eb4-4fd5-b2a5-badfd9a266de",
            name="BNG Filter",
            icon="fa fa-compass",
            modulename="bng-filter.py",
            classname="BngFilter",
            componentpath="views/components/search/bng-filter",
            componentname="bng-filter",
            defaults={
                "config":{},
                "type":"popup"
            }
        )

    operations = [
        migrations.RunPython(add_bng_component_to_search_view, remove_bng_component_from_search_view),
        migrations.RunPython(apply_bng_layout_type, revert_bng_layout_type)
    ]
