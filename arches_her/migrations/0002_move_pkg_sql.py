from django.db import migrations, models
from django.utils.translation import gettext as _


class Migration(migrations.Migration):

    dependencies = [
        ("arches_her", "0001_initial")
    ]

    def add_map_layers(apps, schema_editor):
        MapLayer = apps.get_model("models", "MapLayer")

        # Add/update map layers previously in preliminary_sql/search_overlays.sql
        # Previously layers were added using random uuid1, so name is only primary identifier

        existing_map = MapLayer.objects.filter(name="Search Results Heat Map")
        if not existing_map:
            MapLayer.objects.update_or_create(
                maplayerid="ede8a6af-110a-4dab-9d0b-f0eccb4cef86",
                name="Search Results Heat Map",
                layerdefinitions=[
                    {
                        "source": "search-results-hashes",
                        "paint": {
                            "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 20, 5],
                            "heatmap-weight": ["interpolate", ["linear"], ["get", "doc_count"], 0, 0, 6, 1],
                            "heatmap-color": [
                                "interpolate",
                                ["linear"],
                                ["heatmap-density"],
                                0,
                                "#ffffb2",
                                0.2,
                                "#fed976",
                                0.4,
                                "#feb24c",
                                0.6,
                                "#fd8d3c",
                                0.8,
                                "#f03b20",
                                0.9,
                                "#fff",
                                1,
                                "#bd0026",
                            ],
                            "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 9, 40, 15, 90, 20, 190],
                            "heatmap-opacity": 0.6,
                        },
                        "minzoom": 9,
                        "maxzoom": 17,
                        "type": "heatmap",
                        "id": "search-results-heat",
                    }
                ],
                isoverlay=True,
                icon="ion-search",
                activated=True,
                addtomap=False,
                searchonly=True,
                sortorder=0,
                ispublic=True,
            )

        existing_map = MapLayer.objects.filter(name="Map Markers")
        if not existing_map:
            MapLayer.objects.update_or_create(
                maplayerid="77ec30f0-3dda-499a-a126-c67d41f7ba3a",
                name="Map Markers",
                layerdefinitions=[
                    {
                        "layout": {"icon-image": "marker-15", "icon-allow-overlap": True, "icon-offset": [0, -6], "icon-size": 1},
                        "source": "search-results-points",
                        "filter": ["all", ["==", "$type", "Point"], ["!=", "highlight", True]],
                        "paint": {},
                        "type": "symbol",
                        "id": "search-results-points-markers",
                    },
                    {
                        "layout": {"icon-image": "marker-15", "icon-allow-overlap": True, "icon-offset": [0, -6], "icon-size": 1.3},
                        "source": "search-results-points",
                        "filter": ["all", ["==", "$type", "Point"], ["==", "highlight", True]],
                        "paint": {},
                        "type": "symbol",
                        "id": "search-results-points-markers-highlighted",
                    },
                    {
                        "layout": {"visibility": "visible"},
                        "source": "search-results-points",
                        "filter": ["all", ["==", "$type", "Point"], ["==", "highlight", True]],
                        "paint": {"circle-translate": [0, -25], "circle-color": "rgba(0,0,0,0)", "circle-radius": 16},
                        "type": "circle",
                        "id": "search-results-points-markers-point-highlighted",
                    },
                    {
                        "layout": {"visibility": "visible"},
                        "source": "search-results-points",
                        "filter": ["all", ["==", "$type", "Point"]],
                        "paint": {"circle-translate": [0, -16], "circle-color": "rgba(0,0,0,0)", "circle-radius": 11},
                        "type": "circle",
                        "id": "search-results-points-markers-point",
                    },
                ],
                isoverlay=True,
                icon="ion-location",
                activated=True,
                addtomap=True,
                searchonly=True,
                sortorder=0,
                ispublic=True,
            )

        existing_map = MapLayer.objects.filter(name="Hex")
        if not existing_map:
            MapLayer.objects.update_or_create(
                maplayerid="604bd229-85ca-42db-a7ef-eb2ed81e8537",
                name="Hex",
                layerdefinitions=[
                    {
                        "layout": {},
                        "source": "search-results-hex",
                        "filter": ["==", "id", ""],
                        "paint": {
                            "fill-extrusion-color": "#54278f",
                            "fill-extrusion-height": {"property": "doc_count", "type": "exponential", "stops": [[0, 0], [500, 5000]]},
                            "fill-extrusion-opacity": 0.85,
                        },
                        "type": "fill-extrusion",
                        "id": "search-results-hex-outline-highlighted",
                    },
                    {
                        "layout": {},
                        "source": "search-results-hex",
                        "filter": ["all", [">", "doc_count", 0]],
                        "paint": {
                            "fill-extrusion-color": {
                                "property": "doc_count",
                                "stops": [[1, "#f2f0f7"], [5, "#cbc9e2"], [10, "#9e9ac8"], [20, "#756bb1"], [50, "#54278f"]],
                            },
                            "fill-extrusion-height": {"property": "doc_count", "type": "exponential", "stops": [[0, 0], [500, 5000]]},
                            "fill-extrusion-opacity": 0.5,
                        },
                        "type": "fill-extrusion",
                        "id": "search-results-hex",
                    },
                ],
                isoverlay=True,
                icon="ion-funnel",
                activated=True,
                addtomap=False,
                searchonly=True,
                sortorder=0,
                ispublic=True,
            )

    def remove_map_layers(apps, schema_editor):
        MapLayer = apps.get_model("models", "MapLayer")

        for map_layers in MapLayer.objects.filter(name__in=[
            "Search Results Heat Map",
            "Map Markers",
            "Hex"
        ]):
            map_layers.delete()


    operations = [
        migrations.RunPython(add_map_layers, remove_map_layers),
    ]
