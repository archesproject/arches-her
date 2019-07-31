define([
    'knockout',
    'views/components/workflows/new-tile-step',
    'viewmodels/alert'
], function(ko, NewTileStepViewModel, AlertViewModel) {
        var self = this;
        console.log(params);
        if (!params.resourceid() && params.requirements){
            // console.log('whats this?',params.requirements.resourceid);
            params.resourceid(params.requirements.resourceid);
            params.tileid(params.requirements.tileid);
        }
        var url = arches.urls.api_card + (ko.unwrap(params.resourceid) || ko.unwrap(params.graphid));

        // this.card = ko.observable();
        // this.tile = ko.observable();
        this.resValue = ko.observable();
        this.loading = params.loading || ko.observable(false);
        this.alert = params.alert || ko.observable(null);
        this.resourceId = params.resourceid || ko.observable();
        this.complete = params.complete || ko.observable();
        this.completeOnSave = params.completeOnSave === false ? false : true;
        this.loading(true);

        $.getJSON(url, function(data) {
            var handlers = {
                'after-update': [],
                'tile-reset': []
            };
            var displayname = ko.observable(data.displayname);
            // var createLookup = function(list, idKey) {
            //     return _.reduce(list, function(lookup, item) {
            //         lookup[item[idKey]] = item;
            //         return lookup;
            //     }, {});
            // };
            // var flattenTree = function(parents, flatList) {
            //     _.each(ko.unwrap(parents), function(parent) {
            //         flatList.push(parent);
            //         var childrenKey = parent.tiles ? 'tiles' : 'cards';
            //         flattenTree(
            //             ko.unwrap(parent[childrenKey]),
            //             flatList
            //         );
            //     });
            //     return flatList;
            // };

            self.reviewer = data.userisreviewer;
            // self.provisionalTileViewModel = new ProvisionalTileViewModel({
            //     tile: self.tile,
            //     reviewer: data.userisreviewer
            // });

            var graphModel = new GraphModel({
                data: {
                    nodes: data.nodes,
                    nodegroups: data.nodegroups,
                    edges: []
                },
                datatypes: data.datatypes
            });

            self.on = function(eventName, handler) {
                if (handlers[eventName]) {
                    handlers[eventName].push(handler);
                }
            };

            self.loading(false);
            // commented the line below because it causes steps to automatically advance on page reload
            // self.complete(!!ko.unwrap(params.tileid));
        });
        // params.tile = self.tile;
        // params.stateProperties = function(){
        //     return {
        //         resourceid: ko.unwrap(params.resourceid),
        //         tile: !!(ko.unwrap(params.tile)) ? koMapping.toJS(params.tile().data) : undefined,
        //         tileid: !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile().tileid): undefined
        //     };
        // };
        

        self.setResourceInstance = function() {
            console.log(params);
            if (self.resValue() != null) {
                console.log(self.resValue());
                params.resourceid(self.resValue());
                self.complete(true);
            }
        }

        // self.onSaveSuccess = function(tiles) {
        //     var tile;
        //     if (tiles.length > 0) {
        //         tile = tiles[0];
        //         params.resourceid(tile.resourceinstance_id);
        //         params.tileid(tile.tileid);
        //         self.resourceId(tile.resourceinstance_id);
        //     }
        //     if (self.completeOnSave === true) {
        //         self.complete(true);
        //     }
        // };

    
    ko.components.register('select-resource-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/select-resource-step.htm'
        }
    });
    return viewModel;
});
