define(['knockout',
    'knockout-mapping',
    'views/list',
    'viewmodels/function',
    'bindings/chosen',
    'templates/views/components/functions/bngpoint-to-geojson-function.htm',
], function(ko, koMapping, ListView, FunctionViewModel, chosen, bngpointToGeojsonFunctionTemplate) {
    return ko.components.register('views/components/functions/bngpoint-to-geojson-function', {
        viewModel: function(params) {
            FunctionViewModel.apply(this, arguments);
            console.log("Running a sample function")
            var self = this;
            this.nodesBNG = ko.observableArray();
            this.nodesGeoJSON = ko.observableArray();
            this.bng_node = params.config.bng_node;
            this.geojson_node = params.config.geojson_node;
            this.triggering_nodegroups = params.config.triggering_nodegroups;
            this.bng_node.subscribe(function(ng){
                _.each(self.nodesBNG(),function(node){
                    if (node.datatype !== "semantic"){
                        
                        if (ng === node.nodeid){
                            self.triggering_nodegroups.push(node.nodegroup_id);
                            params.config.bng_nodegroup = node.nodegroup_id;
                            console.log("bng_nodegroup",self.bng_nodegroup);
                        }
                        
                    }
                })
            });

            this.geojson_node.subscribe(function(o_n){
                console.log('GeoJSON node id:', o_n);
                _.each(self.nodesGeoJSON(),function(node){
                    if (node.datatype !== "semantic"){
                        
                        if (o_n === node.nodeid){
                            params.config.geojson_nodegroup = node.nodegroup_id;
                            console.log("geojson_nodegroup",self.geojson_nodegroup);
                        }
                    }
                    
                })
                
                
              })




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






            
            
            

            window.setTimeout(function(){$("select[data-bind^=chosen]").trigger("chosen:updated")}, 300);
        },
        template: bngpointToGeojsonFunctionTemplate
    });
})
