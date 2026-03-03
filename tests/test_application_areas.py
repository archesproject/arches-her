import re
import uuid
from unittest.mock import patch
from django.contrib.auth.models import User, Group
from django.contrib.gis.geos import Point
from django.test import TestCase, RequestFactory
from guardian.shortcuts import assign_perm

from arches.app.models.models import (
    GeoJSONGeometry,
    GraphModel,
    Node,
    NodeGroup,
    ResourceInstance,
    TileModel,
    GraphXPublishedGraph,
)
from arches_her.views.map import ApplicationAreas

# Run from the command line via:
# python manage.py test tests.test_application_areas --settings="tests.test_settings"


class ApplicationAreasPermissionTests(TestCase):
    """
    Tests that ApplicationAreas.get correctly enforces:
      1. Nodegroup-level read permissions (user must be able to read the node's nodegroup)
      2. Resource-instance-level permissions (default-allow deny-list / default-deny allow-list)
    """

    NODEID = "1909956f-3a3b-11eb-ae99-f875a44e0e11"

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

        cls.graph = GraphModel.objects.create(
            graphid=uuid.uuid4(),
            name="Test Application Area Graph",
            isresource=True,
        )
        cls.publication = GraphXPublishedGraph.objects.create(
            graph=cls.graph,
        )
        cls.graph.publication = cls.publication
        cls.graph.save()

        cls.nodegroup = NodeGroup.objects.create(
            nodegroupid=uuid.uuid4(),
            cardinality="n",
        )
        cls.node = Node.objects.create(
            nodeid=cls.NODEID,
            name="Application Area Geometry",
            istopnode=True,
            datatype="geojson-feature-collection",
            nodegroup=cls.nodegroup,
            graph=cls.graph,
        )

        cls.resource_ids = []
        cls.tiles = []
        cls.geometries = []

        # A point in central London for test geometries
        test_point = Point(-14000, 6711000, srid=3857)

        for i in range(3):
            rid = uuid.uuid4()
            resource = ResourceInstance.objects.create(
                resourceinstanceid=rid,
                graph=cls.graph,
                graph_publication=cls.publication,
            )
            cls.resource_ids.append(str(rid))

            tile = TileModel.objects.create(
                tileid=uuid.uuid4(),
                resourceinstance=resource,
                nodegroup=cls.nodegroup,
                data={cls.NODEID: None},
            )
            cls.tiles.append(tile)

            geom = GeoJSONGeometry.objects.create(
                tile=tile,
                resourceinstance=resource,
                node=cls.node,
                geom=test_point,
            )
            cls.geometries.append(geom)

        cls.superuser = User.objects.create_superuser(
            username="test_super",
            email="super@test.com",
            password="Test12345!",
        )

        cls.regular_user = User.objects.create_user(
            username="test_regular",
            email="regular@test.com",
            password="Test12345!",
        )
        # Add to Resource Editor so permission framework treats them as a real user
        editor_group, _ = Group.objects.get_or_create(name="Resource Editor")
        cls.regular_user.groups.add(editor_group)

    def setUp(self):
        self.factory = RequestFactory()
        self.view = ApplicationAreas.as_view()
        # Tile coords that cover a large area
        self.zoom = 0
        self.x = 0
        self.y = 0

    def _make_request(self, user):
        request = self.factory.get(f"/application-areas/{self.zoom}/{self.x}/{self.y}.pbf")
        request.user = user
        return request

    def _patch_get_filtered_instances(self, is_exclusive, filtered_ids):
        """
        Patches get_filtered_instances in the view module to return
        a controlled (is_exclusive, filtered_ids) tuple.
        """
        return patch(
            "arches_her.views.map.get_filtered_instances",
            return_value=(is_exclusive, filtered_ids),
        )

    def _extract_strings_from_response(self, response):
        """
        Extract all UUIDs from protobuf response body.
        """
        # UUID pattern: 8-4-4-4-12 hexadecimal characters separated by hyphens
        uuid_pattern = rb'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
        return [s.decode('ascii') for s in re.findall(uuid_pattern, response.content)]

    def _assert_resources_in_response(self, response, expected_ids):
        """
        Assert that all expected resource IDs are present in the response.
        """
        response_strings = self._extract_strings_from_response(response)
        for resource_id in expected_ids:
            self.assertIn(resource_id, response_strings)

    def _assert_resources_not_in_response(self, response, unexpected_ids):
        """
        Assert that all unexpected resource IDs are absent from the response.
        """
        response_strings = self._extract_strings_from_response(response)
        for resource_id in unexpected_ids:
            self.assertNotIn(resource_id, response_strings)

    def test_superuser_gets_200(self):
        """Superuser should always get a 200 response with tile data."""
        with self._patch_get_filtered_instances(False, []):
            request = self._make_request(self.superuser)
            response = self.view(request, self.zoom, self.x, self.y)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/x-protobuf")
        # All resource IDs should be present in the response
        self._assert_resources_in_response(response, self.resource_ids)

    def test_default_allow_no_restrictions(self):
        """
        Default-allow with no restricted instances: user should get 200,
        meaning all resources are visible.
        """
        with self._patch_get_filtered_instances(False, []):
            request = self._make_request(self.regular_user)
            response = self.view(request, self.zoom, self.x, self.y)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/x-protobuf")
        # All resource IDs should be present
        self._assert_resources_in_response(response, self.resource_ids)

    def test_default_allow_with_restrictions(self):
        """
        Default-allow with one restricted resource: user should still
        get 200, but the query should exclude the restricted resource.
        """
        restricted_id = self.resource_ids[0]
        with self._patch_get_filtered_instances(False, [restricted_id]):
            request = self._make_request(self.regular_user)
            response = self.view(request, self.zoom, self.x, self.y)
        self.assertEqual(response.status_code, 200)
        # Restricted resource should NOT be in response, others should be
        self._assert_resources_not_in_response(response, [restricted_id])
        self._assert_resources_in_response(response, self.resource_ids[1:])

    def test_default_deny_with_allowed_instances(self):
        """
        Default-deny with some allowed instances: user should get 200.
        Only the allowed resources should be included.
        """
        allowed_ids = [self.resource_ids[0], self.resource_ids[1]]
        with self._patch_get_filtered_instances(True, allowed_ids):
            request = self._make_request(self.regular_user)
            response = self.view(request, self.zoom, self.x, self.y)
        self.assertEqual(response.status_code, 200)
        # Only allowed resources should be in response
        self._assert_resources_in_response(response, allowed_ids)
        self._assert_resources_not_in_response(response, [self.resource_ids[2]])

    def test_default_deny_empty_allowed_returns_empty_tile(self):
        """
        Default-deny with NO allowed instances: should return 200 with
        an empty MVT (the AND 1=0 clause ensures no rows).
        """
        with self._patch_get_filtered_instances(True, []):
            request = self._make_request(self.regular_user)
            response = self.view(request, self.zoom, self.x, self.y)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/x-protobuf")
        # No resource IDs should be in response
        self._assert_resources_not_in_response(response, self.resource_ids)

    def test_user_without_nodegroup_access_gets_503(self):
        """
        A user explicitly denied access to the node's nodegroup should
        receive a 503 (Node.DoesNotExist because the nodegroup is excluded
        from viewable_nodegroups).
        """
        no_access_user = User.objects.create_user(
            username="test_no_access",
            email="noaccess@test.com",
            password="Test12345!",
        )

        assign_perm("no_access_to_nodegroup", no_access_user, self.nodegroup)
        request = self._make_request(no_access_user)
        response = self.view(request, self.zoom, self.x, self.y)
        self.assertEqual(response.status_code, 503)

    def test_no_resources_for_graph_returns_empty_tile(self):
        """
        If no ResourceInstance rows exist for the node's graph, the view
        should short-circuit with AND 1=0 and return an empty tile.
        """

        ResourceInstance.objects.filter(graph=self.graph).delete()

        request = self._make_request(self.regular_user)
        response = self.view(request, self.zoom, self.x, self.y)
        self.assertEqual(response.status_code, 200)
        # No resource IDs should be in response
        self._assert_resources_not_in_response(response, self.resource_ids)
