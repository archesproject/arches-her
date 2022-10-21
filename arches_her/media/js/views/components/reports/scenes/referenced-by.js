define([
    'underscore',
    'knockout',
    'arches',
    'utils/report',
    'bindings/datatable'
], function(_, ko, arches, reportUtils) {
    return ko.components.register('views/components/reports/scenes/referenced-by', {
        viewModel: function(params) {
            const self = this;
            Object.assign(self, reportUtils);
            self.resourceinstanceid = params.resourceInstanceId;
            self.graphs_array = params.graphs
            self.graphs_list = []
            self.graphs = []
            self.relations = ko.observableArray();
            self.visible = {
                referencedBy: ko.observable(true),
            }

            // referenced by table configuration
            self.referencedByTwoColumnTableConfig = {
                ...self.defaultTableConfig,
                "paging": true,
                "searching": true,
                "scrollY": "250px",
                "columns": Array(2).fill(null),
                "bDestroy": true
            };

            self.getGraphs = function(){
                return $.ajax({
                    url: arches.urls.graphs_api,
                    context: this,
                }).done(function(graphs_response) {
                    self.graphs = ko.unwrap(graphs_response)
                    self.graphs_list = []
                    for(g in self.graphs_array){
                        var graph_find_result = self.graphs.find((gr) => gr.name === self.graphs_array[g])
                        self.graphs_list.push(graph_find_result.graphid)
                    }
                    return
                }).fail(function() {
                    // error
               })
            }


            self.getRelatedResources = function(){
                return $.ajax({
                    url: arches.urls.related_resources + self.resourceinstanceid,
                    context: self,
                })
                    .done(function(response) {
                        self.getGraphs().then(function(){
                            var response_related_resources = response.related_resources.related_resources
                            self.relations.removeAll()
                            for(r in response_related_resources){
                                var response_related_resource = response_related_resources[r]
                                if(self.graphs_list.includes(response_related_resource["graph_id"] )){
                                    var graph_name = (self.graphs.find((gr) => gr.graphid === response_related_resource["graph_id"]))["name"]
                                    self.relations.push({"related_resource_name": response_related_resource["displayname"], "related_resource_link": arches.urls.resource_report + response_related_resource["resourceinstanceid"], "related_resource_type": graph_name})
                                }
                            }
                            return
                        })
                    })
                    .fail(function() {
                         // error
                    });
            };



        },
        template: { require: 'text!templates/views/components/reports/scenes/referenced-by.htm' }
    });
});