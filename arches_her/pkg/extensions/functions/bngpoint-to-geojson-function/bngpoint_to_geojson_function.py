import uuid
from arches.app.functions.base import BaseFunction
from arches.app.models.system_settings import settings
from arches.app.models import models
from arches.app.models.tile import Tile
from arches.app.models.resource import Resource
from django.contrib.gis.geos import GEOSGeometry
from django.db import connection, transaction
import json
from datetime import datetime


details = {
    "name": "BNG Point to GeoJSON",
    "type": "node",
    "description": "Pushes the geometry from a BNG Point node to a related GeoJSON node",
    "defaultconfig": {"bng_node": "", "geojson_node": "", "bng_nodegroup": "", "geojson_nodegroup": "", "triggering_nodegroups": []},
    "classname": "BNGPointToGeoJSON",
    "component": "views/components/functions/bngpoint-to-geojson-function",
    "functionid": "0434df8d-b98a-4b41-9a0a-68cd9214ad73",
}


class BNGPointToGeoJSON(BaseFunction):
    def get(self):
        raise NotImplementedError

    def save_geojson(self, tile, request, is_function_save_method=True):
        """Finds the equivalen GeoJSON for a BNG Alphanumeric value and saves that value to the
        geojson nodegroup of the tile.

        Args:
            self : BNGPointToGeoJSON object.

            tile : Tile to attach / amend geojson_nodegroup of.

            request : WSGI Request used to varify call is result of user action. N.B. Function Returns if empty.

            is_function_save_method : a bool stating whether the function calling it is the save function.
        """

        # First let's check if this call is as a result of an inbound request (user action) or
        # as a result of the complementary GeoJSONToBNGPoint function saving a new BngPoint.
        if request is None and is_function_save_method == True:
            return

        bngValueReturned = ""
        gridSquare = {
            "NA": [0, 9],
            "NB": [1, 9],
            "NC": [2, 9],
            "ND": [3, 9],
            "NE": [4, 9],
            "OA": [5, 9],
            "OB": [6, 9],
            "NF": [0, 8],
            "NG": [1, 8],
            "NH": [2, 8],
            "NJ": [3, 8],
            "NK": [4, 8],
            "OF": [5, 8],
            "OG": [6, 8],
            "NL": [0, 7],
            "NM": [1, 7],
            "NN": [2, 7],
            "NO": [3, 7],
            "NP": [4, 7],
            "OL": [5, 7],
            "OM": [6, 7],
            "NQ": [0, 6],
            "NR": [1, 6],
            "NS": [2, 6],
            "NT": [3, 6],
            "NU": [4, 6],
            "OQ": [5, 6],
            "OR": [6, 6],
            "NV": [0, 5],
            "NW": [1, 5],
            "NX": [2, 5],
            "NY": [3, 5],
            "NZ": [4, 5],
            "OV": [5, 5],
            "OW": [6, 5],
            "SA": [0, 4],
            "SB": [1, 4],
            "SC": [2, 4],
            "SD": [3, 4],
            "SE": [4, 4],
            "TA": [5, 4],
            "TB": [6, 4],
            "SF": [0, 3],
            "SG": [1, 3],
            "SH": [2, 3],
            "SJ": [3, 3],
            "SK": [4, 3],
            "TF": [5, 3],
            "TG": [6, 3],
            "SL": [0, 2],
            "SM": [1, 2],
            "SN": [2, 2],
            "SO": [3, 2],
            "SP": [4, 2],
            "TL": [5, 2],
            "TM": [6, 2],
            "SQ": [0, 1],
            "SR": [1, 1],
            "SS": [2, 1],
            "ST": [3, 1],
            "SU": [4, 1],
            "TQ": [5, 1],
            "TR": [6, 1],
            "SV": [0, 0],
            "SW": [1, 0],
            "SX": [2, 0],
            "SY": [3, 0],
            "SZ": [4, 0],
            "TV": [5, 0],
            "TW": [6, 0],
        }

        bngnode = self.config["bng_node"]
        geojsonNode = self.config["geojson_node"]
        bngValueReturned = tile.data[bngnode]

        if bngValueReturned != None:
            """
            The following section turns the alphanumberic BNG value in the tile into a point geometry object and then transforms that object
            into WGS 1984 long/lat projection system.
            """

            dt = datetime.now()
            gridSquareLetters = bngValueReturned[0:2]
            bngValueNumbers = bngValueReturned[2:]
            splitSection = int(len(bngValueNumbers) / 2)
            gridSquareNumbers = gridSquare[gridSquareLetters]
            eastingValue = str(gridSquareNumbers[0]) + str(bngValueNumbers[:splitSection])
            northingValue = str(gridSquareNumbers[1]) + str(bngValueNumbers[splitSection:])
            osgb36PointString = "POINT (" + eastingValue + " " + northingValue + ")"
            osgb36Point = GEOSGeometry(osgb36PointString, srid=27700)
            osgb36Point.transform(4326, False)
            pointGeoJSON = json.loads(osgb36Point.geojson)

            """
                This section creates a geojson object required in the format required by Arches.  The date and time the object was
                created has also been added in the feature's properties.
            """

            uuidForRecord = uuid.uuid4().hex
            bngFeature = {
                "geometry": pointGeoJSON,
                "type": "Feature",
                "id": str(uuidForRecord),
                "properties": {"datetime": dt.strftime("%d/%m/%Y %H:%M:%S"), "bngref": str(bngValueReturned)},
            }

            geometryValue = {"type": "FeatureCollection", "features": [bngFeature]}

            geometryValueJson = geometryValue

            """
            The Tile.objects.filter function from tiles.py is called to return any tiles with the geojson_nodegroup value
            as the nodegroup_id and the current tile's resource instance ID as its resourceinstance_id value; any tiles returned
            are added to the previously_saved_tiles variable.

            If there are tiles returned then the new geojson object overwrites the current value.

            If there are no tiles returned, a new tile is created for the geojson nodegroup using tile.py's get_blank_tile
            function.  If there is a key within the data object in the new node with the same id as the geojson_nodegroup value
            then that key/value pair are deleted.  The geojson object is set at the value to the key which has the value of the geojson_node
            value.

            The new tile is saved and then the mv_geojson_geoms materialised view is refreshed so the point geometry will be displayed
            on the Search map.
            """
            if self.config["geojson_nodegroup"] == str(tile.nodegroup_id):
                tile.data[geojsonNode] = geometryValueJson
            else:
                previously_saved_tiles = Tile.objects.filter(
                    nodegroup_id=self.config["geojson_nodegroup"], resourceinstance_id=tile.resourceinstance_id
                )

                if len(previously_saved_tiles) > 0:
                    for p in previously_saved_tiles:
                        old_geojson = p.data[geojsonNode]
                        p.data[geojsonNode] = geometryValueJson

                        for f in old_geojson["features"]:
                            if "bngref" not in f["properties"]:
                                p.data[geojsonNode]["features"].append(f)

                        p.save()
                else:
                    new_geojson_tile = Tile().get_blank_tile_from_nodegroup_id(
                        self.config["geojson_nodegroup"], resourceid=tile.resourceinstance_id, parenttile=tile.parenttile
                    )
                    new_geojson_tile.data[self.config["geojson_node"]] = geometryValueJson

                    if self.config["geojson_nodegroup"] in new_geojson_tile.data:
                        del new_geojson_tile.data[self.config["geojson_nodegroup"]]

                    new_geojson_tile.save()

            cursor = connection.cursor()
            sql = """
                    SELECT * FROM refresh_geojson_geometries();
                """
            cursor.execute(sql)  #

        else:
            pass

        return

    def save(self, tile, request, context=None):

        self.save_geojson(tile=tile, request=request, is_function_save_method=True)
        return

    def post_save(self, *args, **kwargs):
        raise NotImplementedError

    def delete(self, tile, request):
        raise NotImplementedError

    def on_import(self, tile):
        self.save_geojson(tile=tile, request=None, is_function_save_method=False)
        return

    def after_function_save(self, tile, request):
        raise NotImplementedError
