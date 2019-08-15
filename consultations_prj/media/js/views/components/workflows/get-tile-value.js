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
        params.applyOutputToTarget = ko.observable(true);
        if (!params.resourceid() && params.requirements){
            params.resourceid(params.requirements.resourceid);
            params.tileid(params.requirements.tileid);
        }
        this.nameheading = params.nameheading;
        this.namelabel = params.namelabel;
        this.applyOutputToTarget = params.applyOutputToTarget;

        this.sourceNodeIds = params.config.sourcenodeids || [];
        this.targetNodeId = params.config.targetnodeid;
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

        self.updateTargetTile = function(tiles){
    
            var someData, retVal;
            var argsNeeded = self.sourceNodeIds.length;
            var args = {};
            tiles = params.requirements.tiles;

            tiles.forEach(function(tile){
                console.log(tile);
                self.sourceNodeIds.forEach(function(srcnodeid) {
                    if (tile["data"][srcnodeid] != undefined) { // found the right data
                        someData = tile["data"][srcnodeid]();
                        //someData = lookupDisplay(someData)
                        args[srcnodeid] = someData;
                        if (Object.keys(args).length == argsNeeded) {
                            retVal = self.tileMethod(args);
                            self.tile.data[self.targetNodeId](retVal);
                            self.tile.save();
                        }
                    }
                });
            });
            console.log("Error - insufficient data to populate tile");
        };

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
            // self.updateTargetTile(tiles)
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

    return viewModel;
});
