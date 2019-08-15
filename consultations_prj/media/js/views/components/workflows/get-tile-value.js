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
        self.loading(true);
        params.applyOutputToTarget = ko.observable(true);
        if (!params.resourceid() && params.requirements){
            params.resourceid(params.requirements.resourceid);
            params.tileid(params.requirements.tileid);
        }
        this.nameheading = params.nameheading;
        this.namelabel = params.namelabel;
        this.applyOutputToTarget = params.applyOutputToTarget;
        this.checkBox = ko.observable(false);

        if(!!params.config.sourcenodeids()) {
            this.sourceNodeIds = params.config.sourcenodeids();
        } else this.sourceNodeIds = [];
        this.targetNodeId = ko.unwrap(params.config.targetnodeid);
        this.tileMethod = params.config.fn;

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
             *     fn: function(argsObj){
             *              //custom function
             *         },
             *     sourcenodeids: [], //arr of nodeids
             *     targetnodeid: "1234-abcd-5678-efgh"
             *  }
             * Note that argsObj.keys.length == sourcenodeids.length
             */
    
            var tileData = false, retVal = false;
            var argsNeeded = self.sourceNodeIds.length;
            var args = {};
            tiles = params.requirements.tiles;
            // self.tile();

            tiles.forEach(function(tile){
                self.sourceNodeIds.forEach(function(srcnodeid) {
                    if (ko.unwrap(tile["data"][srcnodeid])) { // found the right data
                        tileData = tile["data"][srcnodeid]();
                        //tileData = lookupDisplay(tileData)
                        args[srcnodeid] = tileData;
                        if (Object.keys(args).length == argsNeeded) {
                            retVal = self.tileMethod(args);
                            self.tile().data[self.targetNodeId](retVal);
                        }
                    }
                });
            });
            if (!retVal) { console.log("Error - insufficient data to populate tile"); }
        };

        self.tile.subscribe(function(tile){
            if(ko.unwrap(tile) && self.loading()) {
                self.updateTargetTile();
                self.loading(false);
            }
        })

        self.applyOutputToTarget.subscribe(function(val){
            if (val && params.requirements.tiles.length > 0) {
                self.updateTargetTile(params.requirements.tiles);
            }
        });

        self.onSaveSuccess = function(tiles) {
            self.tiles = tiles;
            if (self.tiles.length > 0) {
                params.resourceid(tiles[0].resourceinstance_id);
                self.resourceId(tiles[0].resourceinstance_id);
            }
            self.updateTargetTile();
            if (self.completeOnSave === true) {
                self.complete(true);
            }
        }
    };

    return ko.components.register('get-tile-value', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/get-tile-value.htm'
        }
    });
});
