from tests.base_test import ArchesTestCase
from django.test import Client
from django.contrib.auth.models import User
from django.test.utils import captured_stdout
from arches.app.models.resource import Resource
from arches.app.utils.data_management.resources.importer import BusinessDataImporter
from arches.app.utils.betterJSONSerializer import JSONDeserializer
from arches.app.models.system_settings import settings as arches_settings
from arches.app.utils import permission_backend
from arches.app.utils.data_management.resource_graphs.importer import (
    import_graph as ResourceGraphImporter,
)
from guardian.shortcuts import assign_perm
import mapbox_vector_tile
import time

class TestMVTLayer(ArchesTestCase):

    # graph_fixtures = ["Application Area"]

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

        cls.tester = User.objects.create_user(
            username="tester", email="test@test.com", password="test12345!"
        )
        cls.url = "/application-areas/9/255/170.pbf"
        cls.client = Client()

        app_area_graph_path = "tests/fixtures/resource_graphs/Application Area.json"
        test_app_area_resources_path = "tests/fixtures/data/json/application_areas.json"

        with captured_stdout():
            with open(app_area_graph_path, "r") as f:
                archesfile = JSONDeserializer().deserialize(f)
                ResourceGraphImporter(
                    archesfile["graph"], overwrite_graphs=True
                )
        with captured_stdout():
            BusinessDataImporter(
                    test_app_area_resources_path
                ).import_business_data()
        
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()

    def test_application_areas_view_returns_correct_resources_and_tiles(self):

        expected_resource_ids = ["516fd423-361d-47cb-8946-336b75a91803", "f10744b5-9a6c-4e7a-b870-9f5fd13109f8"]
        expected_tile_ids = ["ebdabe8d-9357-42af-b8a7-dd632e100f53", "a8ee1453-0c03-4be2-a2fa-0b3b19d8b837"]

        response = self.client.get(self.url)
        decoded_data = mapbox_vector_tile.decode(response.content)
        returned_features = decoded_data['app-area']['features']

        returned_resource_ids = [feature['properties']['resourceinstanceid'] for feature in returned_features]
        returned_tile_ids = [feature['properties']['tileid'] for feature in returned_features]

        self.assertEqual(len(returned_resource_ids), 2)
        self.assertCountEqual(expected_resource_ids, returned_resource_ids)
        self.assertCountEqual(expected_tile_ids, returned_tile_ids)

    def test_restricted_resource_is_not_returned_for_default_allow(self):

        restricted_application_area = Resource.objects.get(pk="516fd423-361d-47cb-8946-336b75a91803")
        assign_perm("no_access_to_resourceinstance", self.tester, restricted_application_area)

        restricted_application_area.index()
        time.sleep(1)

        self.client.login(username="tester", password="test12345!")

        response = self.client.get(self.url)
        decoded_data = mapbox_vector_tile.decode(response.content)
        returned_features = decoded_data['app-area']['features']

        returned_resource_ids = [feature['properties']['resourceinstanceid'] for feature in returned_features]
        returned_tile_ids = [feature['properties']['tileid'] for feature in returned_features]

        self.assertEqual(len(returned_resource_ids), 1)
        self.assertEqual(["f10744b5-9a6c-4e7a-b870-9f5fd13109f8"], returned_resource_ids)
        self.assertEqual(["a8ee1453-0c03-4be2-a2fa-0b3b19d8b837"], returned_tile_ids)

    def test_restricted_resource_is_not_returned_for_default_deny(self):

        permission_backend._PERMISSION_FRAMEWORK = None
        arches_settings.PERMISSION_FRAMEWORK = "arches_default_deny.ArchesDefaultDenyPermissionFramework"

        permitted_application_area = Resource.objects.get(pk="516fd423-361d-47cb-8946-336b75a91803")
        assign_perm("view_resourceinstance", self.tester, permitted_application_area)

        permitted_application_area.index()
        time.sleep(1)

        self.client.login(username="tester", password="test12345!")

        response = self.client.get(self.url)
        decoded_data = mapbox_vector_tile.decode(response.content)
        returned_features = decoded_data['app-area']['features']

        returned_resource_ids = [feature['properties']['resourceinstanceid'] for feature in returned_features]
        returned_tile_ids = [feature['properties']['tileid'] for feature in returned_features]

        self.assertEqual(len(returned_resource_ids), 1)
        self.assertEqual(["516fd423-361d-47cb-8946-336b75a91803"], returned_resource_ids)
        self.assertEqual(["ebdabe8d-9357-42af-b8a7-dd632e100f53"], returned_tile_ids)

        permission_backend._PERMISSION_FRAMEWORK = None
        arches_settings.PERMISSION_FRAMEWORK = "arches_default_allow.ArchesDefaultAllowPermissionFramework" # restore permissions framework to default