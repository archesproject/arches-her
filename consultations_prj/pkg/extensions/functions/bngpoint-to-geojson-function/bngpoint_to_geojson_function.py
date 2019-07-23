import uuid
from arches.app.functions.base import BaseFunction
from arches.app.models import models
from arches.app.models.tile import Tile
from arches.app.models.resource import Resource
from django.contrib.gis.geos import GEOSGeometry
from django.db import connection, transaction
import json
from datetime import datetime 


details = {
    'name': 'BNG Point to GeoJSON',
    'type': 'node',
    'description': 'Pushes the geometry from a BNG Point node to a related GeoJSON node',
    'defaultconfig': {"bng_node":"","geojson_node":"","bng_nodegroup":"","geojson_nodegroup":"","triggering_nodegroups":[]},
    'classname': 'BNGPointToGeoJSON',
    'component': 'views/components/functions/bngpoint-to-geojson-function',
    'functionid': '0434df8d-b98a-4b41-9a0a-68cd9214ad73'
}

class BNGPointToGeoJSON(BaseFunction):

    def get(self):
        raise NotImplementedError

    def save(self,tile,request):
        """ Finds the equivalen GeoJSON for a BNG Alphanumeric value and saves that value to the 
            geojson nodegroup of the tile.

            Agrs:
                self: BNGPointToGeoJSON object.

                tile: Tile to attach / amend geojson_nodegroup of.

                request: WSGI Request used to varify call is result of user action. N.B. Function Returns if empty.
        """

        # print 'calling save'
        
        # First let's check if this call is as a result of an inbound request (user action) or
        # as a result of the complementary GeoJSONToBNGPoint function saving a new BngPoint.
        if request is None:
            return

        bngValueReturned = ""
        gridSquare = {
                    "NT":[3,6],
                    "NU":[4,6],
                    "NX":[2,5],
                    "NY":[3,5],
                    "NZ":[4,5],
                    "SD":[3,4],
                    "SE":[4,4],
                    "TA":[5,4],
                    "SJ":[3,3],
                    "SK":[4,3],
                    "TF":[5,3],
                    "TG":[6,3],
                    "SO":[3,2],
                    "SP":[4,2],
                    "TL":[5,2],
                    "TM":[6,2],
                    "SS":[2,1],
                    "ST":[3,1],
                    "SU":[4,1],
                    "TQ":[5,1],
                    "TR":[6,1],
                    "SV":[0,0],
                    "SW":[1,0],
                    "SX":[2,0],
                    "SY":[3,0],
                    "SZ":[4,0],
                    "TV":[5,0]}

        bngnode = self.config[u"bng_node"]
        geojsonNode = self.config[u"geojson_node"]

        


        bngValueReturned = tile.data[bngnode]

        if bngValueReturned != None:
            '''
            The following section turns the alphanumberic BNG value in the tile into a point geometry object and then transforms that object 
            into WGS 1984 long/lat projection system.
            '''

            dt = datetime.now()
            gridSquareLetters = bngValueReturned[0:2]
            bngValueNumbers = bngValueReturned[2:]
            splitSection = len(bngValueNumbers)/2
            gridSquareNumbers = gridSquare[gridSquareLetters]
            eastingValue = str(gridSquareNumbers[0]) + str(bngValueNumbers[:splitSection])
            northingValue = str(gridSquareNumbers[1]) + str(bngValueNumbers[splitSection:])

            osgb36PointString = 'POINT (' + eastingValue + ' ' + northingValue + ')'
            osgb36Point = GEOSGeometry(osgb36PointString, srid=27700)
            osgb36Point.transform(4326,False)
            pointGeoJSON = json.loads(osgb36Point.geojson)



            '''
                This section creates a geojson object required in the format required by Arches.  The date and time the object was 
                created has also been added in the feature's properties.
            '''

            uuidForRecord = uuid.uuid4().hex
            geometryValue = {"type":"FeatureCollection",
            "features":[{"geometry":
                    pointGeoJSON,
                "type": "Feature",
                "id":str(uuidForRecord),
                "properties":{"datetime":dt.strftime("%d/%m/%Y %H:%M:%S")}
                }
            ]}

            geometryValueJson = geometryValue

            '''
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
            '''
            previously_saved_tiles = Tile.objects.filter(nodegroup_id=self.config[u"geojson_nodegroup"],resourceinstance_id=tile.resourceinstance_id)


            if len(previously_saved_tiles) > 0:
                for p in previously_saved_tiles:
                    p.data[geojsonNode] = geometryValueJson
                    p.save()
            else:

                geoJSONnodegroup = Tile().get_blank_tile_from_nodegroup_id(self.config[u"geojson_nodegroup"],resourceid=tile.resourceinstance_id,parenttile=tile.parenttile)
                geoJSONnodegroup.data[self.config[u"geojson_node"]] = geometryValueJson

                if self.config[u"geojson_nodegroup"] in geoJSONnodegroup.data:
                    del geoJSONnodegroup.data[self.config[u"geojson_nodegroup"]]

                geoJSONnodegroup.save()


                

                

            
            '''
            The resource object for the tile is returned and then reindexed.
            '''
            
            #resource = Resource.objects.get(resourceinstanceid=tile.resourceinstance_id)
            #resource.index()

            

            

            
            cursor = connection.cursor()
            sql = """
                    REFRESH MATERIALIZED VIEW mv_geojson_geoms;
                """
            cursor.execute(sql)

            resource = Resource.objects.get(resourceinstanceid=tile.resourceinstance_id)
                #resource.index()





            

            

        else:
            pass

        '''
        The tile is saved.
        '''
        
        tile.save()


                
        

        
        return
                






    def delete(self,tile,request):
        raise NotImplementedError

    def on_import(self,tile):
        raise NotImplementedError

    def after_function_save(self,tile,request):
        raise NotImplementedError



