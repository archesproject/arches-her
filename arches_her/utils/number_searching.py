from arches.app.search.es_mapping_modifier import EsMappingModifier
from arches.app.search.elasticsearch_dsl_builder import Bool, Match, Nested
from arches.app.models.models import Node
from arches.app.models.tile import Tile
from arches.app.models.system_settings import settings
from arches.app.models import models


class NumberDataEsMappingModifier(EsMappingModifier):

    counter = 1

    def __init__(self):
        pass

    @staticmethod
    def add_search_terms(resourceinstance, document, terms):
        if EsMappingModifier.get_mapping_property() not in document:
            document[EsMappingModifier.get_mapping_property()] = []

        number_nodes = Node.objects.filter(datatype="number").exclude(graph_id=settings.SYSTEM_SETTINGS_RESOURCE_MODEL_ID)
        number_node_ids = [str(x.nodeid) for x in number_nodes]
        number_nodegroup_ids = [x.nodegroup_id for x in number_nodes]

        number_tiles = Tile.objects.filter(resourceinstance_id=resourceinstance, nodegroup_id__in=number_nodegroup_ids)

        output = []

        for tile in number_tiles:
            for k in tile.data.keys():
                if k in number_node_ids:
                    if tile.data[k]:
                        output.append(str(tile.data[k]))

        document[EsMappingModifier.get_mapping_property()].append({"custom_value": output})
        NumberDataEsMappingModifier.counter = NumberDataEsMappingModifier.counter + 1

    @staticmethod
    def create_nested_custom_filter(term, original_element):
        if "nested" not in original_element:
            return original_element
        document_key = EsMappingModifier.get_mapping_property()
        custom_filter = Bool()
        custom_filter.should(
            Match(
                field="%s.custom_value" % document_key,
                query=term["value"],
                type="phrase_prefix",
            )
        )
        custom_filter.should(
            Match(
                field="%s.custom_value.folded" % document_key,
                query=term["value"],
                type="phrase_prefix",
            )
        )
        nested_custom_filter = Nested(path=document_key, query=custom_filter)
        new_must_element = Bool()
        new_must_element.should(original_element)
        new_must_element.should(nested_custom_filter)
        new_must_element.dsl["bool"]["minimum_should_match"] = 1
        return new_must_element

    @staticmethod
    def add_search_filter(search_query, term):
        original_must_filter = search_query.dsl["bool"]["must"]
        search_query.dsl["bool"]["must"] = []
        for must_element in original_must_filter:
            search_query.must(NumberDataEsMappingModifier.create_nested_custom_filter(term, must_element))

        original_must_filter = search_query.dsl["bool"]["must_not"]
        search_query.dsl["bool"]["must_not"] = []
        for must_element in original_must_filter:
            search_query.must_not(NumberDataEsMappingModifier.create_nested_custom_filter(term, must_element))
