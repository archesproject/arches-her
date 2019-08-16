define([
    'underscore',
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/new-tile-step'
], function(_, $, arches, ko, koMapping, NewTileStep) {
    function viewModel(params) {
        var self = this;
        NewTileStep.apply(this, [params]);

        var updateTileSubscription = self.loading.subscribe(function(val){
            if(!val) {
                self.loading(true);
                self.updateTargetTile();
                updateTileSubscription.dispose();
            }
        });
        params.applyOutputToTarget = ko.observable(true);
        if (!params.resourceid() && params.requirements){
            params.resourceid(params.requirements.resourceid);
            params.tileid(params.requirements.tileid);
        }
        this.nameheading = params.nameheading;
        this.namelabel = params.namelabel;
        this.applyOutputToTarget = params.applyOutputToTarget;
        this.checkBox = ko.observable(false);
        if(params.config.checkbox) { this.checkBox(true); }

        if(!!params.config.sourcenodeids()) {
            this.sourceNodeIds = params.config.sourcenodeids();
            this.targetNodeId = ko.unwrap(params.config.targetnodeid);
            this.tileMethod = params.config.fn;
        } else this.sourceNodeIds = [];

        // this.workflowStepClass = ko.pureComputed(function() {
        //     return self.applyOutputToTarget() ? params.class() : '';
        // }, viewModel);
        this.workflowStepClass = params.class || ko.observable();

        params.tile = self.tile;

        params.stateProperties = function(){
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: !!(ko.unwrap(params.tile)) ? koMapping.toJS(params.tile().data) : undefined,
                tileid: !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile().tileid): undefined,
                applyOutputToTarget: ko.unwrap(this.applyOutputToTarget)
            }
        };

        self.updateTargetTile = function(){
            /**
             * Expected from params.config: 
             *  config: {
             *     fn: function(argsObj, callback){
             *              //logic
             *              //callback(returnValue)
             *         },
             *     sourcenodeids: [], //arr of nodeids
             *     targetnodeid: "1234-abcd-5678-efgh"
             *  }
             * Note that argsObj.keys.length == sourcenodeids.length
             * i.e. each tile datum is an argument you need
             */
    
            var tileData;
            var argsNeeded = self.sourceNodeIds.length;
            var args = {};
            tiles = params.requirements.tiles; // i.e tiles in workflow state

            self.sourceNodeIds.forEach(function(srcnodeid) {
                tiles.forEach(function(tile){
                    if (ko.unwrap(tile["data"][srcnodeid])) {
                        tileData = tile["data"][srcnodeid]();
                        args[srcnodeid] = tileData;
                        if (Object.keys(args).length == argsNeeded) {
                            self.tileMethod(args, function(val){
                                if(ko.unwrap(val) != undefined) {
                                    self.tile().data[self.targetNodeId](ko.unwrap(val));
                                    self.loading(false);
                                }
                            });
                        }
                    }
                });
            });
        };

        self.onSaveSuccess = function(tiles) {
            self.tiles = tiles;
            if (self.tiles.length > 0) {
                params.resourceid(tiles[0].resourceinstance_id);
                self.resourceId(tiles[0].resourceinstance_id);
            }
            if (self.completeOnSave === true) { self.complete(true); }
        };
    };

    return ko.components.register('get-tile-value', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/get-tile-value.htm'
        }
    });
});
