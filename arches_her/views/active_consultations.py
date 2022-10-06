"""
ARCHES - a program developed to inventory and manage immovable cultural heritage.
Copyright (C) 2013 J. Paul Getty Trust and World Monuments Fund

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
"""

from django.http import HttpResponseNotFound
from django.views.generic import View
from django.core.paginator import Paginator
from arches.app.utils.response import JSONResponse
from arches.app.models import models
from arches.app.models.resource import Resource
from arches.app.models.tile import Tile
from arches.app.datatypes.datatypes import DataTypeFactory
import json
import re


class ActiveConsultationsView(View):
    def __init__(self):
        self.cons_details_nodegroupid = (
            "771bb1e2-8895-11ea-8446-f875a44e0e11"  # "Consultation Type" nodegroup, needs to be updated but not used
        )
        self.consultation_graphid = "8d41e49e-a250-11e9-9eab-00224800b26d"
        self.cons_status_bool_nodeid = "6a773228-db20-11e9-b6dd-784f435179ea"
        self.active_cons_node_list = {  # if this is not up-to-date sorting will break
            "Geospatial Coordinates": "b949053a-184f-11eb-ac4a-f875a44e0e11",
            "Consultation Name": "4ad69684-951f-11ea-b5c3-f875a44e0e11",
            "Consultation Type": "771bb1e2-8895-11ea-8446-f875a44e0e11",
            "Proposal Text": "1b0e15ec-8864-11ea-8493-f875a44e0e11",
            "Target Date Start": "7224417b-893a-11ea-b383-f875a44e0e11",
            "Casework Officer": "4ea4a197-184f-11eb-9152-f875a44e0e11",
            "Log Date": "40eff4cd-893a-11ea-b0cc-f875a44e0e11",
        }

    def get(self, request):
        page_num = 1 if request.GET.get("page") == "" else int(request.GET.get("page"))
        order_param = request.GET.get("order")
        keyword = None if request.GET.get("keyword") == "" or request.GET.get("keyword") == None else (request.GET.get("keyword"))
        datatype_factory = DataTypeFactory()
        consultation_status_tiles = Tile.objects.filter(nodegroup_id=self.cons_status_bool_nodeid)
        include_list = [
            tile.resourceinstance_id for tile in consultation_status_tiles if tile.data[self.cons_status_bool_nodeid] is not False
        ]
        filtered_consultations = Resource.objects.filter(graph_id=self.consultation_graphid, resourceinstanceid__in=include_list)

        order_config = {  # if this is not up-to-date sorting will break
            "Log Date: Newest to Oldest": ("Log Date", True),
            "Log Date: Oldest to Newest": ("Log Date", False),
            "Target Date: Newest to Oldest": ("Target Date Start", True),
            "Target Date: Oldest to Newest": ("Target Date Start", False),
            "Casework Officer: A to Z": ("Casework Officer", False),
            "Casework Officer: Z to A": ("Casework Officer", True),
            "Consultation Type: A to Z": ("Consultation Type", False),
            "Consultation Type: Z to A": ("Consultation Type", True),
            "Consultation Name: A to Z": ("Consultation Name", False),
            "Consultation Name: Z to A": ("Consultation Name", True),
        }

        search_results_setting_nodeid = "d0987de3-fad8-11e6-a434-6c4008b05c4c"
        search_results_setting_nodegroupid = "d0987880-fad8-11e6-8cce-6c4008b05c4c"
        page_ct_tile = Tile.objects.get(nodegroup_id=search_results_setting_nodegroupid)
        page_ct = page_ct_tile.data[search_results_setting_nodeid]

        if filtered_consultations is not None:
            if page_num == -1:
                grouped_tile_list = build_resource_dict(
                    filtered_consultations, self.active_cons_node_list, datatype_factory, keyword=keyword, layout="table"
                )
            elif page_num >= 1:
                grouped_tile_list = build_resource_dict(
                    filtered_consultations, self.active_cons_node_list, datatype_factory, keyword=keyword
                )
            if order_param in list(order_config.keys()) and order_param is not None:
                try:
                    grouped_tile_list = sorted(
                        grouped_tile_list,
                        key=lambda resource: resource[order_config[order_param][0]],
                        reverse=order_config[order_param][1],
                    )
                except KeyError as e:
                    print("Error: ", e)
            if page_num == -1:
                return JSONResponse({"results": grouped_tile_list})
            else:
                return self.get_paginated_data(grouped_tile_list, page_ct, page_num)

        return HttpResponseNotFound()

    def get_paginated_data(self, grouped_tile_list, page_ct, page_num):
        paginator = Paginator(grouped_tile_list, page_ct)
        page_results = paginator.page(page_num)
        if page_results.has_next() is True:
            next_page_number = page_results.next_page_number()
        else:
            next_page_number = False
        if page_results.has_previous() is True:
            prev_page_number = page_results.previous_page_number()
        else:
            prev_page_number = False
        page_ct = paginator.num_pages
        pages = [page_num]
        if paginator.num_pages > 1:  # all below creates abridged page list UI
            before = list(range(1, page_num))
            after = list(range(page_num + 1, paginator.num_pages + 1))
            default_ct = 2
            ct_before = default_ct if len(after) > default_ct else default_ct * 2 - len(after)
            ct_after = default_ct if len(before) > default_ct else default_ct * 2 - len(before)
            if len(before) > ct_before:
                before = [1, None] + before[-1 * (ct_before - 1) :]
            if len(after) > ct_after:
                after = after[0 : ct_after - 1] + [None, paginator.num_pages]
            pages = before + pages + after

        page_config = {
            "current_page": page_num,
            "end_index": page_results.end_index(),
            "has_next": page_results.has_next(),
            "has_other_pages": page_results.has_other_pages(),
            "has_previous": page_results.has_previous(),
            "next_page_number": next_page_number,
            "pages": pages,
            "previous_page_number": prev_page_number,
            "start_index": page_results.start_index(),
        }
        return JSONResponse({"page_results": page_results.object_list, "paginator": page_config})


def build_resource_dict(consultations, active_cons_node_list, datatype_factory, layout="grid", keyword=None):
    """
    builds a list that looks like this:
    [
        {
            "resourceinstanceid":"[uuid],
            "node_name_a":"display_val_a",
            "node_name_b":"display_val_b",
            ...
        },
        {
            "resourceinstanceid":"[uuid],
            "node_name_a":"display_val_a",
            "node_name_b":"display_val_b",
            ...
        },
        ...
    ]
    """
    resources = []
    active_cons_list_vals = list(active_cons_node_list.values())
    active_cons_list_keys = list(active_cons_node_list.keys())
    for consultation in consultations:
        resource = {}
        resource["resourceinstanceid"] = consultation.resourceinstanceid
        consultation.load_tiles()
        for tile in consultation.tiles:
            for nodeid, nodevalue in list(tile.data.items()):
                if nodeid in active_cons_list_vals:
                    node = models.Node.objects.get(nodeid=nodeid)
                    try:
                        datatype = datatype_factory.get_instance(node.datatype)
                        val = datatype.get_display_value(tile, node)
                        if layout == "grid" and nodeid == active_cons_node_list["Geospatial Coordinates"]:
                            val = json.loads(val)
                    except Exception as e:
                        # print('Error:',e)
                        val = nodevalue

                    resource[str(node.name)] = val

        if keyword is not None:
            for v in list(resource.values()):
                try:
                    if keyword.lower() in v.lower():
                        resources.append(resource)
                        break
                except Exception as e:
                    continue
        else:
            for key in active_cons_list_keys:
                if key not in list(resource.keys()):
                    resource[key] = ""
            resources.append(resource)

    return resources
