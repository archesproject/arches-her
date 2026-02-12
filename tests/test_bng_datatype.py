import os
from django.test import TestCase
from django.core import management
from django.test.utils import captured_stdout
from arches.app.models.models import Node
from arches.app.datatypes.datatypes import DataTypeFactory
from tests import test_settings

# these tests can be run from the command line via
# python manage.py test tests.test_bng_datatype --settings="tests.test_settings"
# or if using docker
# python manage.py test tests.test_bng_datatype --settings="tests.test_settings_for_docker"


class BNGCentreDataTypeTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

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

    def setUp(self):
        # Update this node ID to match the actual node ID from the fixture
        self.bng_node_id = Node.objects.filter(datatype="bngcentrepoint").first().nodeid

    def test_bngcentrepoint_validation(self):
        """
        Test validation logic for BNGCentreDataType
        """
        node = Node.objects.get(nodeid=self.bng_node_id)
        datatype = DataTypeFactory().get_instance(node.datatype)

        # Valid BNG value
        valid_value = "NT1234567890"
        errors = datatype.validate(valid_value)
        self.assertEqual(errors, [])

        # Invalid BNG value (wrong length)
        invalid_value = "NT12345"
        errors = datatype.validate(invalid_value)
        self.assertTrue(len(errors) > 0)
        self.assertEqual(errors[0]["message"], "Input data must be exactly 12 characters long.")

        # Invalid BNG value (invalid grid square)
        invalid_value = "ZZ1234567890"
        errors = datatype.validate(invalid_value)
        self.assertTrue(len(errors) > 0)
        self.assertEqual(errors[0]["message"], "Invalid grid square identifier in input data.")

        # Invalid BNG value (non-numeric part)
        invalid_value = "NT12345ABCD"
        errors = datatype.validate(invalid_value)
        self.assertTrue(len(errors) > 0)
        self.assertEqual(
            errors[0]["message"],
            "Numeric part of the input data is not a valid integer.",
        )

        # Completely invalid input
        invalid_value = 1233445
        errors = datatype.validate(invalid_value)
        self.assertTrue(len(errors) > 0)
        self.assertIn("Unexpected error during validation", errors[0]["message"])
