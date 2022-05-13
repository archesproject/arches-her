define(['knockout',
        'knockout-mapping',
        'viewmodels/function',
        'bindings/chosen',
        'viewmodels/alert'],
function (ko, koMapping, FunctionViewModel, chosen, AlertViewModel) {
    return ko.components.register('views/components/functions/autopopulate-node-from-card-nodes-function', {
        viewModel: function(params) {
            FunctionViewModel.apply(this, arguments);
            var self = this;
            this.triggering_nodegroups = params.config.triggering_nodegroups;
            this.autopopulate_configs = params.config.autopopulate_configs;


            this.cards_in_graph = ko.observableArray();
            this.nodes_in_card = ko.observableArray();
            this.string_nodes_in_card = ko.observableArray();
            this.cards_nodegroups = ko.observableArray();
            this.chosen_card = ko.observable();
            this.target_node = ko.observable();
            this.string_template = ko.observable();
            this.reset_string_template = ko.observable(false);
            this.alert = params.alert || ko.observable(null);
            this.overwrite = ko.observable(false);


            this.graph.cards.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))


            this.graph.cards.forEach(function(card){

                var nodes_count = 0
                self.graph.nodes.forEach(function(node){
                    if(node.nodegroup_id == card.nodegroup_id){
                        if(node.datatype == 'string'){
                            self.graph.widgets
                            nodes_count++;
                        }
                    }
                })
                if(nodes_count > 0){
                    this.cards_in_graph.push(card);
                }
            }, this);


            this.chosen_card.subscribe(function(card){
                self.nodes_in_card.removeAll();
                self.string_nodes_in_card.removeAll();
                _.each(self.cards_in_graph(),function(available_card){
                    if (card === available_card.nodegroup_id){
                        self.sort_nodes(self.graph.nodes)
                        self.graph.nodes.forEach(function(node){
                            if (node.nodegroup_id == card){
                                var nodes_in_card_list = ko.unwrap(self.nodes_in_card)
                                if (!(nodes_in_card_list.includes(node))){
                                    self.nodes_in_card.push(node);
                                    self.sort_nodes(self.nodes_in_card)
                                    var string_nodes_in_card_list = ko.unwrap(self.string_nodes_in_card)
                                    if (node.datatype == 'string'){
                                        if (!(string_nodes_in_card_list.includes(node))){
                                            self.string_nodes_in_card.push(node);
                                            self.sort_nodes(self.string_nodes_in_card)
                                        }
                                    }
                                }
                            }
                        }, self);
                    }
                })
            });

            this.sort_nodes = function(nodes_to_sort){
                sorted_nodes = nodes_to_sort.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
                return sorted_nodes
            }


            this.target_node.subscribe(function(){
                //
            },this);



            this.string_template_calc = ko.computed({
                read: function (){
                    if (self.target_node()){
                        var string_value = ""
                        var stored_string = null
                        var auto_configs = ko.unwrap(self.autopopulate_configs)
                        var target_node_val = ko.unwrap(self.target_node)
                        for(a = 0; a < auto_configs.length; a++){
                            var config = auto_configs[a]
                            if(ko.unwrap(config.target_node) == target_node_val){
                                if(ko.unwrap(self.reset_string_template) == false){
                                    stored_string = ko.unwrap(config.string_template)
                                }
                            }
                        }
                        if(stored_string == null){
                            _.each(self.nodes_in_card(),function(available_node){
                                if (available_node.nodeid != self.target_node()){
                                    var invalid_datatypes = ['semantic','geojson-feature-collection','file-list','annotation']
                                    if (!(invalid_datatypes.includes(available_node.datatype))){
                                        string_value = string_value + "<" + available_node.name + ">, "
                                    }
                                }
                            },self)
                            string_value = string_value.slice(0,-2)

                        }
                        else{
                            string_value = stored_string;
                        }
                        self.string_template(string_value)
                        return string_value
                    }
                },
                write: function (string_value){
                    self.string_template(string_value)
                    self.reset_string_template(false);



                },
                owner: this
            })



            this.return_calc_configs = ko.computed(function(){
                var auto_configs = ko.unwrap(this.autopopulate_configs)
                var configs = [];
                for (var i = 0; i < auto_configs.length; i++){
                    var config = {}
                    var item = auto_configs[i];

                    config["target_id"] = ko.observable(ko.unwrap(item.target_node))
                    config["nodegroup_id"] = ko.observable(ko.unwrap(item.nodegroup))
                    self.graph.cards.forEach(function(card){
                        if(card.nodegroup_id == ko.unwrap(item.nodegroup)){
                            config["card_name"] = ko.observable(card.name);
                        }
                    })

                    var overwrite_value = ko.unwrap(item.overwrite)
                    if(overwrite_value == true){
                        config["overwrite_value"] = "Yes"
                    }
                    else{
                        config["overwrite_value"] = "No"
                    }

                    config["string_template"] = ko.unwrap(ko.observable(item.string_template))
                    self.graph.nodes.forEach(function(node){
                        if(node.nodeid == ko.unwrap(item.target_node)){
                            config["target_name"] = ko.observable(node.name);
                        }
                    })
                    configs.push(config)

                }
                return configs;

            },this)




            this.trigger_string_template_reset = function(){
                var target_node = ko.unwrap(self.target_node)
                self.target_node(undefined);
                self.reset_string_template(true);
                self.target_node(target_node);
                self.target_node.valueHasMutated();
            }


            this.clear_configuration_options = function(){
                self.string_template(undefined);
                self.chosen_card(undefined);
                self.target_node(undefined);
                self.overwrite(false);
                self.chosen_card.valueHasMutated();
                self.string_template.valueHasMutated();
                self.target_node.valueHasMutated();
                self.overwrite.valueHasMutated();
            }


            this.deleteAutopopulateConfig = function(){
                var that = this;
                self.alert(new AlertViewModel(
                    'ep-alert-red',
                    'Delete Config',
                    'Do you want to delete config?',
                    null,
                    function(){
                        var selected_config = ko.unwrap(that)
                        var auto_configs = ko.unwrap(self.autopopulate_configs)
                        for(var a = 0; a < auto_configs.length; a++){
                            var config = auto_configs[a]
                            if (ko.unwrap(config["target_node"]) == ko.unwrap(selected_config["target_id"])){
                                var remove_config = auto_configs[a]
                                var remove_nodegroup = selected_config["nodegroup_id"]
                                var nodegroup_instances = 0
                                for(var a = 0; a < auto_configs.length; a++){
                                    var check_config = auto_configs[a]
                                    var config_nodegroup = check_config["nodegroup"]
                                    var config_node = check_config["target_node"]
                                    if(ko.unwrap(config_nodegroup) == ko.unwrap(remove_nodegroup) && ko.unwrap(config_node) != ko.unwrap(selected_config["target_id"])){
                                        nodegroup_instances++
                                    }
                                }
                                if(nodegroup_instances == 0){
                                    self.triggering_nodegroups.remove(ko.unwrap(remove_nodegroup))
                                }
                                self.autopopulate_configs.remove(remove_config);

                                params.config.autopopulate_configs = self.autopopulate_configs
                                params.config.triggering_nodegroups = self.triggering_nodegroups

                            }
                        }
                     }
                ));

            }


            this.updateAutopopulateConfig = function (){
                var selected_config = ko.unwrap(this)

                var card = ko.unwrap(selected_config.nodegroup_id);
                self.chosen_card(card);
                self.chosen_card.valueHasMutated();

                var target = ko.unwrap(selected_config.target_id)
                self.target_node(target);
                self.target_node.valueHasMutated();

                var string_t =  ko.unwrap(selected_config.string_template)
                self.string_template(string_t);
                self.string_template.valueHasMutated();

                var overwrite_t =  ko.unwrap(selected_config.overwrite_value)
                if(overwrite_t == "Yes"){
                    overwrite_t = true
                }
                else{
                    overwrite_t = false
                }
                self.overwrite(overwrite_t);
                self.overwrite.valueHasMutated();
            }


            this.update_config = function(auto_configs){

                var string_value = ko.unwrap(self.string_template);
                var regExp = /\<(.*?)\>/g;
                var matches = string_value.match(regExp);
                var template_nodes = []
                var graph_nodes = []

                var card_nodegroup = ko.unwrap(self.chosen_card)
                var nodegroupids = []

                for (var i = 0; i < matches.length; i++) {
                    var str = matches[i];
                    var substring = str.substring(1, str.length - 1);
                    template_nodes.push(substring);
                }

                self.graph.nodes.forEach(function(node){
                    var card_nodegroup = ko.unwrap(self.chosen_card)
                    if(node.nodegroup_id == card_nodegroup){
                        if (!(node.datatype in ['semantic','geojson-feature-collection','file-list','annotation'])){
                            graph_nodes.push(node.name)
                        }
                    }
                })

                for (var t = 0; t < template_nodes.length; t++) {
                    var template_node = template_nodes[t]
                    if(graph_nodes.includes(template_node) == false){
                        var node_name_Val = ", <" + template_node + ">"
                        string_value = string_value.replace(node_name_Val,"")
                        self.string_template(string_value)

                    }
                }


                if (auto_configs.length > 0){
                    for (var c = 0; c < auto_configs.length; c++){
                        selected_config = auto_configs[c]
                        config_nodegroup = ko.unwrap(selected_config["nodegroup"])
                        nodegroupids.push(config_nodegroup)
                    }
                }

                var nodegroup_id_array = ko.unwrap(nodegroupids)

                if (nodegroup_id_array.includes(card_nodegroup) == false){
                    self.triggering_nodegroups.push(card_nodegroup)
                }

                var new_config = {}
                new_config["nodegroup"] = card_nodegroup;
                new_config["target_node"] = ko.unwrap(self.target_node);
                new_config["string_template"] = ko.unwrap(self.string_template);
                new_config["overwrite"] = ko.unwrap(self.overwrite);

                var config_index = null

                for (var a = 0; a < auto_configs.length; a++){
                    var selected_config = auto_configs[a]
                    if(ko.unwrap(selected_config["target_node"]) == ko.unwrap(self.target_node)){
                        config_index = a
                    }
                }

                if (config_index == null){
                    self.autopopulate_configs.push(new_config)
                }
                else{
                    self.autopopulate_configs.replace(ko.unwrap(self.autopopulate_configs)[config_index],new_config)
                }
                self.reset_string_template(false);
                params.config.autopopulate_configs = self.autopopulate_configs
                params.config.triggering_nodegroups = self.triggering_nodegroups

            }

            this.addAutopopulateConfig = function(){
                if (self.chosen_card && self.target_node && self.string_template){
                    var auto_configs = ko.unwrap(self.autopopulate_configs)
                    var configured_nodes = []

                    for (var a = 0; a < auto_configs.length; a++){
                        var node_id = ko.unwrap(auto_configs[a].target_node)
                        configured_nodes.push(node_id)

                    }

                    if(configured_nodes.includes(ko.unwrap(self.target_node))){
                        self.alert(new AlertViewModel(
                            'ep-alert-red',
                            'Overwrite config',
                            'You already have a configuration set for this node.  Do you want to overwrite it?',
                            null,
                            function(){
                                self.update_config(auto_configs);
                            })
                        );
                    }

                    else{
                        self.update_config(auto_configs);
                    }



            }}








            window.setTimeout(function(){$("select[data-bind^=chosen]").trigger("chosen:updated")}, 300);

        },
        template: {
            require: 'text!templates/views/components/functions/autopopulate-node-from-card-nodes-function.htm'
        }
    });
})