import logging
import json
from operator import invert
from django.contrib.gis.geos import GEOSGeometry
from django.db import connection
from django.utils.translation import ugettext as _
from uuid import uuid4
from arches.app.models.system_settings import settings
from arches.app.utils.betterJSONSerializer import JSONSerializer, JSONDeserializer
from arches.app.search.elasticsearch_dsl_builder import Bool, Nested, Terms, GeoShape
from arches.app.search.components.base import BaseSearchFilter

logger = logging.getLogger(__name__)

details = {
    "searchcomponentid": "",
    "name": "BNG Filter",
    "icon": "fa fa-compass",
    "modulename": "bng-filter.py",
    "classname": "BngFilter",
    "type": "popup", #"filter",
    "componentpath": "views/components/search/bng-filter",
    "componentname": "bng-filter",
    "sortorder": "0",
    "enabled": True,
}

class BngFilter(BaseSearchFilter):
    def append_dsl(self, search_results_object, permitted_nodegroups, include_provisional):
        
        search_query = Bool()
        querysting_params = self.request.GET.get(details["componentname"], "")
        bng_filter = JSONDeserializer().deserialize(querysting_params)
        bng = bng_filter["bng"]
        inverted = bng_filter["inverted"]
        
        spatial_filter = self.build_geojson_from_bng(bng);
        
        if "features" in spatial_filter:
            if len(spatial_filter["features"]) > 0:
                feature_geom = spatial_filter["features"][0]["geometry"]
                geoshape = GeoShape(
                    field="geometries.geom.features.geometry", type=feature_geom["type"], coordinates=feature_geom["coordinates"]
                )

                spatial_query = Bool()
                if inverted is True:
                    spatial_query.must_not(geoshape)
                else:
                    spatial_query.filter(geoshape)

                # get the nodegroup_ids that the user has permission to search
                spatial_query.filter(Terms(field="geometries.nodegroup_id", terms=permitted_nodegroups))

                if include_provisional is False:
                    spatial_query.filter(Terms(field="geometries.provisional", terms=["false"]))

                elif include_provisional == "only provisional":
                    spatial_query.filter(Terms(field="geometries.provisional", terms=["true"]))

                search_query.filter(Nested(path="geometries", query=spatial_query))

        search_results_object["query"].add_query(search_query)

        if details["componentname"] not in search_results_object:
            search_results_object[details["componentname"]] = {}

        try:
            search_results_object[details["componentname"]]["grid_square"] = feature_geom
        except NameError:
            logger.info(_("Feature geometry is not defined"))
        
            
    #def append_dsl(self, search_results_object, permitted_nodegroups, include_provisional):
    #    """
    #    used to append ES query dsl to the search request
    #
    #    """
    #
    #    pass

    def view_data(self):
        """
        data that the view should gather to pass to the front end

        """

        pass

    def post_search_hook(self, search_results_object, results, permitted_nodegroups):
        """
        code to run after the search results have been retrieved

        """

        pass
    
    def build_geojson_from_bng(self, bng_value):
        
        geometryValue = {"type": "FeatureCollection", "features": []}
        grid_square = self.bng_grid_square()
        if bng_value != None:
            """
            The following section turns the alphanumberic BNG value in the tile into a point geometry object and then transforms that object
            into WGS 1984 long/lat projection system.
            
            Support to 12 alpha numeric BNG values  = 1m precision
            LL XXXXX XXXXX
            
            """

            gridSquareLetters = bng_value[0:2]
            bngValueNumbers = bng_value[2:]
            splitSection = int(len(bngValueNumbers) / 2)
            gridSquareNumbers = grid_square[gridSquareLetters]
            eastingValue = f"{str(gridSquareNumbers[0])}{str(bngValueNumbers[:splitSection])}"
            northingValue = f"{str(gridSquareNumbers[1])}{str(bngValueNumbers[splitSection:])}"
            
            # we need to create a square polygon to represent the BNG 
            
            xmin = self.pad_coord(eastingValue, '0', 6)
            xmax = self.pad_coord(eastingValue, '9', 6)
            ymin = self.pad_coord(northingValue, '0', 6)
            ymax = self.pad_coord(northingValue, '9', 6)
            
            wkt_polygon = "POLYGON((" + xmin + " " + ymin + "," + xmin + " " + ymax + "," + xmax + " " + ymax + "," + xmax + " " + ymin + "," + xmin + " " + ymin + "))"
            bng_polygon = self.convert_geom_to_wgs84(GEOSGeometry(wkt_polygon, srid=27700), from_srid=27700, to_srid=4326)
            bng_geojson = json.loads(bng_polygon.geojson)

            uuidForRecord = uuid4()
            bngFeature = {
                "geometry": bng_geojson,
                "type": "Feature",
                "id": str(uuidForRecord),
                "properties": {"bngref": str(bng_value)},
            }

            geometryValue["features"].append(bngFeature)

        return geometryValue

            
    def pad_coord(self, coord, pad_value, pad_length):
        """
        This function right pads a string with a given value to a given length.
        """
        if len(coord) < pad_length:
            coord = coord + pad_value * (pad_length - len(coord)) + f".{pad_value}"
        return coord
    
    def convert_geom_to_wgs84(self, geom, from_srid, to_srid=4326):

        with connection.cursor() as cursor:
            # Transform geom to the analysis SRID, buffer it, and transform it back to wgs84
            cursor.execute(
                """SELECT ST_TRANSFORM(ST_SETSRID(%s::geometry, %s), %s)""",
                (geom.hex.decode("utf-8"), from_srid, to_srid),
            )
            res = cursor.fetchone()
            geom = GEOSGeometry(res[0], srid=4326)
        return geom
        
        
    def bng_grid_square(self):
        return {
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