define(['jquery',
    'knockout',
    'knockout-mapping',
    'views/list',
    'viewmodels/function',
    'bindings/chosen',
    'templates/views/components/functions/bngpoint-to-geojson-function.htm'],
function($, ko, koMapping, ListView, FunctionViewModel, chosen, bngpointToGeojsonFunctionTemplate) {
    return ko.components.register('views/components/functions/bngpoint-to-geojson-function', {
        viewModel: function(params) {
            FunctionViewModel.apply(this, arguments);
            var self = this;
            this.nodesBNG = ko.observableArray();
            this.nodesGeoJSON = ko.observableArray();
            this.bng_node = params.config.bng_node;
            this.geojson_node = params.config.geojson_node;
            this.triggering_nodegroups = params.config.triggering_nodegroups;
            this.bng_node.subscribe(function(ng){
                self.nodesBNG().filter(node => node.datatype !== "semantic")
                    .map(node => {
                        if (ng === node.nodeid) {
                            self.triggering_nodegroups.push(node.nodegroup_id);
                            params.config.bng_nodegroup = node.nodegroup_id;
                        }
                    });
            });
    

            this.geojson_node.subscribe(function(o_n){
                self.nodesGeoJSON().filter(node => node.datatype !== "semantic")
                    .map(node => {
                        if (o_n === node.nodeid) {
                            params.config.geojson_nodegroup = node.nodegroup_id;
                        }
                    });
            });




            this.graph.nodes.forEach(function(node){
                if (node.datatype != 'semantic'){
                    if (node.datatype === "geojson-feature-collection"){
                        this.nodesGeoJSON.push(node);
                    }
                    else if (node.datatype === "bngcentrepoint"){
                        this.nodesBNG.push(node);
                    }
                    
                }
            }, this);


            window.setTimeout(function(){$("select[data-bind^=chosen]").trigger("chosen:updated");}, 300);
        },
        template: bngpointToGeojsonFunctionTemplate
    });
});
