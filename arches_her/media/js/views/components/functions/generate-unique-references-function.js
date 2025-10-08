import $ from "jquery";
import ko from "knockout";
import koMapping from "knockout-mapping";
import ListView from "views/list";
import FunctionViewModel from "viewmodels/function-view-model";
import generateUniqueReferencesTemplate from "templates/views/components/functions/generate-unique-references-function.htm";
import chosen from "bindings/chosen";

export default ko.components.register(
    "views/components/functions/generate-unique-references-function",
    {
        viewModel: function (params) {
            try {
                FunctionViewModel.apply(this, arguments);
                var self = this;
                this.nodesSemantic = ko.observableArray();
                this.uniqueresource_nodegroup =
                    params.config.uniqueresource_nodegroup;
                this.triggering_nodegroups =
                    params.config.triggering_nodegroups;
                this.simpleuid_node = params.config.simpleuid_node;
                this.resourceid_node = params.config.resourceid_node;
                this.nodesList = [];
                this.nodesReference = params.config.nodegroup_nodes;

                this.uniqueresource_nodegroup.subscribe(function (urng) {
                    self.nodesReference.removeAll();
                    self.nodegroupid = urng;

                    var filter = self.nodegroupid;

                    if (!filter) {
                        return null;
                    } else {
                        ko.utils.arrayFilter(self.nodesList, function (item) {
                            if (item.nodegroup_id === filter) {
                                self.nodesReference.push(item);
                            }
                        });
                    }

                    self.nodesReference.sort();
                });

                //this.triggering_nodegroups = params.config.triggering_nodegroups;

                this.graph.nodes.forEach(function (node) {
                    if (node.datatype == "semantic") {
                        if (node.nodegroup_id == node.nodeid) {
                            this.nodesSemantic.push(node);
                        }
                    } else {
                        this.nodesList.push(node);
                    }
                }, this);

                this.graph.nodegroups.forEach(function (nodegroup) {
                    if (
                        self
                            .triggering_nodegroups()
                            .includes(nodegroup.nodegroupid)
                    ) {
                    } else {
                        self.triggering_nodegroups.push(nodegroup.nodegroupid);
                    }
                }, this);

                window.setTimeout(function () {
                    $("select[data-bind^=chosen]").trigger("chosen:updated");
                }, 300);
            } catch (err) {
                console.error(err.message);
            }
        },
        template: generateUniqueReferencesTemplate,
    }
);
