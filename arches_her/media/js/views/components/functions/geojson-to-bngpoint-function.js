define(['knockout',
        'knockout-mapping',
        'views/list',
        'viewmodels/function',
        'bindings/chosen'],
function (ko, koMapping, ListView, FunctionViewModel, chosen) {
    return ko.components.register('views/components/functions/geojson-to-bngpoint-function', {
        viewModel: function(params) {
            FunctionViewModel.apply(this, arguments);
            console.log("Running a sample function")
            var self = this;
            this.nodesGeoJSON = ko.observableArray();
            this.nodesBNG = ko.observableArray();
            this.geojson_input_node = params.config.geojson_input_node;
            this.bng_output_node = params.config.bng_output_node;
            this.triggering_nodegroups = params.config.triggering_nodegroups;

            // Subscription.
            // Single node subscription. (They may want point/line/polygon in which case we'll need two more.)
            this.geojson_input_node.subscribe(function(ng){
                _.each(self.nodesGeoJSON(),function(node){
                    if (node.datatype !== "semantic"){
                        
                        if (ng === node.nodeid){
                            self.triggering_nodegroups.push(node.nodegroup_id);
                            params.config.geojson_input_nodegroup = node.nodegroup_id;
                            console.log("geojson_input_nodegroup",self.geojson_input_nodegroup);
                        }
                        
                    }
                })
            });

            this.bng_output_node.subscribe(function(o_n){
                console.log('BNG node id:', o_n);
                _.each(self.nodesBNG(),function(node){
                    if (node.datatype !== "semantic"){
                        
                        if (o_n === node.nodeid){
                            params.config.bng_output_nodegroup = node.nodegroup_id;
                            console.log("bng_output_nodegroup",self.bng_output_nodegroup);
                        }
                    }
                    
                })
                
                
            })


            this.graph.nodes.forEach(function (node) {
                if (node.datatype != 'semantic'){
                    if (node.datatype === "geojson-feature-collection"){
                        this.nodesGeoJSON.push(node);
                    }
                    else if (node.datatype === "bngcentrepoint") {
                        this.nodesBNG.push(node);
                    }
     
                }
            }, this);


            window.setTimeout(function(){$("select[data-bind^=chosen]").trigger("chosen:updated")}, 300);
        },
        template: {
            require: 'text!templates/views/components/functions/geojson-to-bngpoint-function.htm'
        }
    });
})
