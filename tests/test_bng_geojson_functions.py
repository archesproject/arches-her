import uuid
import os
from django.test import TransactionTestCase, TestCase
from django.core import management
from django.test.client import RequestFactory
from django.contrib.auth.models import User
from django.test.utils import captured_stdout
from django.urls import reverse
from arches.app.models import models
from arches.app.models.tile import Tile
from arches.app.models.graph import Graph
from arches.app.models.resource import Resource
from arches.app.models.models import NodeGroup, Node

from arches_her.functions.geojson_to_bngpoint_function import GeoJSONToBNGPoint
from arches_her.functions.bngpoint_to_geojson_function import BNGPointToGeoJSON
from tests import test_settings


# these tests can be run from the command line via
# python manage.py test tests.test_bng_geojson_functions --settings="tests.test_settings"
# or if using docker
# python manage.py test tests.test_bng_geojson_functions --settings="tests.test_settings_for_docker"


# Bletchley Park (https://gridreferencefinder.com/#gr=SP8651233928|51.9970648_s__c__s_-0.7413205|1,SP8651233928|51.9970648_s__c__s_-0.7413205|1)
TEST_BNG_VALUE = "SP8651233928"
TEST_GEOJSON_POINT_IN_BNG_GRID = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {"coordinates": [-0.7413205, 51.9970648], "type": "Point"},
        }
    ],
}

# St. Peter's Square, Vatican City
TEST_GEOJSON_POINT_NOT_IN_BNG_GRID = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "coordinates": [12.45728959098733, 41.90222787284935],
                "type": "Point",
            },
        }
    ],
}

# BNG to GeoJSON function configuration
FUNCTION_CONFIG_BNG_TO_GEOJSON = {
    "config": {
        "bng_node": "1e95ca16-0be6-11f0-9208-5674e5d5f509",
        "bng_nodegroup": "f3901808-0be5-11f0-991f-5674e5d5f509",
        "geojson_node": "0e11a502-0be6-11f0-9208-5674e5d5f509",
        "geojson_nodegroup": "055ccea0-0be6-11f0-9354-5674e5d5f509",
        "triggering_nodegroups": ["f3901808-0be5-11f0-991f-5674e5d5f509"],
    },
    "function_id": "0434df8d-b98a-4b41-9a0a-68cd9214ad73",
    "graph_id": "07dfd81a-f971-4a07-b7df-52f11e6cc2bd",
    "id": "75758b86-ae82-4a52-b166-207c618132ef",
}

# GeoJSON to BNG function configuration
FUNCTION_CONFIG_GEOJSON_TO_BNG = {
    "config": {
        "bng_output_node": "1e95ca16-0be6-11f0-9208-5674e5d5f509",
        "bng_output_nodegroup": "f3901808-0be5-11f0-991f-5674e5d5f509",
        "geojson_input_node": "0e11a502-0be6-11f0-9208-5674e5d5f509",
        "geojson_input_nodegroup": "055ccea0-0be6-11f0-9354-5674e5d5f509",
        "triggering_nodegroups": ["055ccea0-0be6-11f0-9354-5674e5d5f509"],
    },
    "function_id": "d9a01773-6092-4cad-b331-ae725ae8fa88",
    "graph_id": "07dfd81a-f971-4a07-b7df-52f11e6cc2bd",
    "id": "daeb7962-57b9-4567-a401-4a6bf6b3a288",
}


class BNGGeoJSONFunctionTests(TestCase):

    serialized_rollback = True

    def setUp(self):

        # Load the BNG test model
        bng_test_model_path = os.path.join(
            test_settings.PROJECT_TEST_ROOT,
            "fixtures",
            "BNG Test Model.json",
        )

        with captured_stdout():
            management.call_command(
                "packages",
                operation="import_graphs",
                source=bng_test_model_path,
                verbosity=0,
            )

        self.graph = Graph.objects.get(pk="07dfd81a-f971-4a07-b7df-52f11e6cc2bd")
        self.resource = Resource(resourceinstanceid=uuid.uuid4(), graph=self.graph)
        self.resource.save()

        # Create a mock request object
        self.request = RequestFactory().get(reverse("tile"))
        self.request.user = User.objects.get(username="admin")
        self.request.method = "POST"

    def test_geojson_to_bngpoint_function(self):
        """
        Test the GeoJSONToBNGPoint function's save_bngpoint method
        """

        function_config = FUNCTION_CONFIG_GEOJSON_TO_BNG["config"]

        # Create a mock tile with GeoJSON data
        geojson_tile = Tile(
            nodegroup_id=function_config["geojson_input_nodegroup"],
            resourceinstance_id=self.resource.resourceinstanceid,
            data={
                function_config["geojson_input_node"]: TEST_GEOJSON_POINT_IN_BNG_GRID
            },
            sortorder=0,
        )

        geojson_tile.save(request=self.request)

        # Verify the BNG tile was created with the correct data
        bng_tile = models.TileModel.objects.filter(
            nodegroup_id=function_config["bng_output_nodegroup"],
            resourceinstance_id=self.resource.resourceinstanceid,
        ).first()
        self.assertIsNotNone(bng_tile)
        self.assertIn(function_config["bng_output_node"], bng_tile.data)
        self.assertTrue(
            bng_tile.data[function_config["bng_output_node"]].startswith("SP")
        )

    def test_geojson_to_bngpoint_function_not_in_bng(self):
        """
        Test the GeoJSONToBNGPoint function does not save BNG for points outside the BNG grid and does not
        raise an error
        """

        function_config = FUNCTION_CONFIG_GEOJSON_TO_BNG["config"]

        # Create a mock tile with GeoJSON data outside of BNG
        geojson_tile = Tile(
            nodegroup_id=function_config["geojson_input_nodegroup"],
            resourceinstance_id=self.resource.resourceinstanceid,
            data={
                function_config[
                    "geojson_input_node"
                ]: TEST_GEOJSON_POINT_NOT_IN_BNG_GRID
            },
            sortorder=0,
        )

        geojson_tile.save(request=self.request)

        # Verify the BNG tile was not created and the GeoJSON tile still exists
        bng_tile = models.TileModel.objects.filter(
            nodegroup_id=function_config["bng_output_nodegroup"],
            resourceinstance_id=self.resource.resourceinstanceid,
        ).first()
        self.assertIsNone(bng_tile)
        self.assertIsNotNone(
            models.TileModel.objects.filter(
                nodegroup_id=function_config["geojson_input_nodegroup"],
                resourceinstance_id=self.resource.resourceinstanceid,
            ).first()
        )

    def test_bngpoint_to_geojson_function(self):
        """
        Test the BNGPointToGeoJSON function's save_geojson method
        """

        function_config = FUNCTION_CONFIG_BNG_TO_GEOJSON["config"]

        # Create a mock tile with BNG data
        bng_tile = Tile(
            nodegroup_id=function_config["bng_nodegroup"],
            resourceinstance_id=self.resource.resourceinstanceid,
            data={function_config["bng_node"]: TEST_BNG_VALUE},
            sortorder=0,
        )

        bng_tile.save(request=self.request)

        # Verify the GeoJSON tile was created with the correct data
        geojson_tile = models.TileModel.objects.filter(
            nodegroup_id=function_config["geojson_nodegroup"],
            resourceinstance_id=self.resource.resourceinstanceid,
        ).first()
        self.assertIsNotNone(geojson_tile)
        self.assertIn(function_config["geojson_node"], geojson_tile.data)
        self.assertEqual(
            geojson_tile.data[function_config["geojson_node"]]["features"][0][
                "geometry"
            ]["type"],
            "Point",
        )