define([
    'jquery',
    'underscore',
    'knockout',
    'arches',
    'utils/report',
    'templates/views/components/reports/scenes/referenced-by.htm',
    'bindings/datatable',
    'bindings/reports'], 
function($, _, ko, arches, reportUtils, ReferencedByTemplate) {
    return ko.components.register('views/components/reports/scenes/referenced-by', {
        viewModel: function(params) {
            const self = this;
            Object.assign(self, reportUtils);
            self.resourceinstanceid = params.resourceInstanceId;
            self.graphsArray = params.graphs || [];
            self.graphsList = [];
            self.graphs = [];
            self.relations = ko.observableArray();
            self.visible = {
                referencedBy: ko.observable(true),
            };
            self.loaderror = ko.observable(false);

            // referenced by table configuration
            self.referencedByTwoColumnTableConfig = {
                ...self.defaultTableConfig,
                "paging": true,
                "searching": true,
                "columns": Array(2).fill(null),
                "bDestroy": true
            };

            self.getGraphs = function(){
                return $.ajax({
                    url: arches.urls.graphs_api,
                    context: this,
                }).done(function(graphsResponse) {
                    self.graphs = ko.unwrap(graphsResponse);
                    self.graphsList = [];
                    for(let g in self.graphsArray){
                        var graphFindResult = self.graphs.find((gr) => gr.name === self.graphsArray[g]);
                        self.graphsList.push(graphFindResult.graphid);
                    }
                    return;
                }).fail(function() {
                    console.error("Unable to load graphs for referenced by scene");
                    self.loaderror(true);
                });
            };


            self.getRelatedResources = function(){
                self.loaderror(false);
                return $.ajax({
                    url: arches.urls.related_resources + self.resourceinstanceid,
                    context: self,
                })
                .done(function(response) {
                    self.getGraphs().then(function(){
                        const relationships = response.related_resources.resource_relationships;
                        const relatedResources = response.related_resources.related_resources;
                        // Collect resource IDs that point to this resource
                        const otherResourceIds = relationships
                            .filter(rr => rr.resourceinstanceidto === self.resourceinstanceid)
                            .map(rr => rr.resourceinstanceidfrom);

                        // Filter related resources that reference this one
                        const filteredResources = relatedResources.filter(x => otherResourceIds.includes(x.resourceinstanceid));

                        self.relations.removeAll();
                        filteredResources.forEach(resource => {
                            if (
                                self.graphsList.length === 0 ||
                                self.graphsList.includes(resource.graph_id)
                            ) {
                                const graphObj = self.graphs.find(gr => gr.graphid === resource.graph_id);
                                const graphName = graphObj ? graphObj.name : "unknown";
                                self.relations.push({
                                    related_resource_name: resource.displayname,
                                    related_resource_link: arches.urls.resource_report + resource.resourceinstanceid,
                                    related_resource_type: graphName
                                });
                            }
                        });
                    });
                })
                .fail(function() {
                    console.error("Unable to load related resources for referenced by scene");
                    self.relations.removeAll();
                    self.loaderror(true);
                });
            };


            self.getRelatedResources();
        },
        template: ReferencedByTemplate
    });
});