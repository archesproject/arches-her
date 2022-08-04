import uuid
import logging
from arches.app.functions.primary_descriptors import AbstractPrimaryDescriptorsFunction
from arches.app.models import models
from arches.app.models.tile import Tile
from arches.app.models.models import Node
from arches.app.datatypes.datatypes import DataTypeFactory
from django.utils.translation import ugettext as _
from django.db import connection

logger = logging.getLogger(__name__)

details = {
    "functionid": "60000000-0000-0000-0000-000000000002",
    "name": "HE Primary Descriptors",
    "type": "primarydescriptors",
    "modulename": "he_primary_descriptors.py",
    "description": "Function that provides the primary descriptors for HE resources",
    "defaultconfig": {
        "module": "arches_her.functions.he_primary_descriptors",
        "class_name": "HEPrimaryDescriptors",
        "descriptor_types": {
            "name": {
                "nodegroup_id": "",
                "string_template": "",
                "show_prn": False,
            },
            "description": {
                "nodegroup_id": "",
                "string_template": "",
            },
            "map_popup": {
                "nodegroup_id": "",
                "string_template": "",
            },
        },
        "triggering_nodegroups": [],
    },
    "classname": "HEPrimaryDescriptors",
    "component": "views/components/functions/he-primary-descriptors",
}


class HEPrimaryDescriptors(AbstractPrimaryDescriptorsFunction):
    def get_primary_descriptor_from_nodes(self, resource, config, context=None):
        datatype_factory = None
        primary_reference_number = None
        if "show_prn" in config and config["show_prn"] == True:
            sql = f"""
                WITH tile_value AS (
                select t.tiledata, n2.nodeid
                from nodes n1
                inner join nodes n2 on n1.nodegroupid = n2.nodegroupid
                inner join tiles t on n1.nodegroupid = t.nodegroupid
                where n1.name = 'System Reference Numbers'
                and n2.name = 'Primary Reference Number'
                and n1.graphid = '{resource.graph_id}'
                and t.resourceinstanceid = '{resource.resourceinstanceid}'
                )
                select objects.value
                from tile_value, jsonb_each(tiledata) objects
                where objects.key::text = nodeid::text"""
            try:
                with connection.cursor() as cursor:
                    cursor.execute(sql)
                    row = cursor.fetchone()
                    if row and row[0] is not None:
                        primary_reference_number = str(row[0])
            except:
                pass
        try:
            if "nodegroup_id" in config and config["nodegroup_id"] != "" and config["nodegroup_id"] is not None:
                tiles = models.TileModel.objects.filter(nodegroup_id=uuid.UUID(config["nodegroup_id"]), sortorder=0).filter(
                    resourceinstance_id=resource.resourceinstanceid
                )
                if len(tiles) == 0:
                    tiles = models.TileModel.objects.filter(nodegroup_id=uuid.UUID(config["nodegroup_id"])).filter(
                        resourceinstance_id=resource.resourceinstanceid
                    )
                for tile in tiles:
                    for node in models.Node.objects.filter(nodegroup_id=uuid.UUID(config["nodegroup_id"])):
                        data = {}
                        if len(list(tile.data.keys())) > 0:
                            data = tile.data
                        elif tile.provisionaledits is not None and len(list(tile.provisionaledits.keys())) == 1:
                            userid = list(tile.provisionaledits.keys())[0]
                            data = tile.provisionaledits[userid]["value"]
                        if str(node.nodeid) in data:
                            if not datatype_factory:
                                datatype_factory = DataTypeFactory()
                            datatype = datatype_factory.get_instance(node.datatype)
                            value = datatype.get_display_value(tile, node)
                            if value is None:
                                value = ""
                            config["string_template"] = config["string_template"].replace("<%s>" % node.name, str(value))
        except ValueError:
            logger.error(_("Invalid nodegroupid, {0}, participating in descriptor function.").format(config["nodegroup_id"]))
        if config["string_template"].strip() == "":
            config["string_template"] = _("Undefined")
        if primary_reference_number is not None:
            config["string_template"] = f"[{primary_reference_number}] {config['string_template']}"
        return config["string_template"]
