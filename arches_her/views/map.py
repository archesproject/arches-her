from django.views.generic import View
from django.db import connection
from django.http import HttpResponse


class ApplicationAreas(View):
    def get(self, request, zoom, x, y):
        nodeid = '1909956f-3a3b-11eb-ae99-f875a44e0e11'
        with connection.cursor() as cursor:
            result = cursor.execute(
                """SELECT ST_AsMVT(tile, 'app-area', 4096, 'geom', 'id') FROM (SELECT tileid,
                    id,
                    resourceinstanceid,
                    nodeid,
                    ST_AsMVTGeom(
                        geom,
                        TileBBox(%s, %s, %s, 3857)
                    ) AS geom,
                    1 AS total
                FROM geojson_geometries
                WHERE nodeid = %s and (geom && ST_TileEnvelope(%s, %s, %s))) AS tile;""",
                [zoom, x, y, nodeid, zoom, x, y],
            )
            result = bytes(cursor.fetchone()[0]) if result is None else result
        return HttpResponse(result, content_type="application/x-protobuf")