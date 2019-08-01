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
        this.resValue = ko.observable();
        this.applyOutputToTarget = params.applyOutputToTarget;

        // this.workflowStepClass = ko.pureComputed(function() {
        //     return self.applyOutputToTarget() ? params.class() : '';
        // }, viewModel);

        params.tile = self.tile;

        params.stateProperties = function(){
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: !!(ko.unwrap(params.tile)) ? koMapping.toJS(params.tile().data) : undefined,
                tileid: !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile().tileid): undefined,
                applyOutputToTarget: ko.unwrap(this.applyOutputToTarget)
            }
        };
        console.log(params);

        self.updateTargetTile = function(tiles){
            var targetresult;
            var targettile;
            var sourcetile;
            var targetvals;
            tiles.forEach(function(tile){
                    if (tile.nodegroup_id === ko.unwrap(params.targetnodegroup)) {
                        targettile = tile;
                    } else if (tile.nodegroup_id === ko.unwrap(params.nodegroupid)) {
                        sourcetile = tile;
                    }
                });
            targetvals = _.map(sourcetile.data, function(v, k) {return ko.unwrap(v)})
            targetresult = targetvals[2] + ", " + targetvals[0] + " " + targetvals[1];
            targettile.data[params.targetnode()](targetresult);
            targettile.save();
        };

        self.applyOutputToTarget.subscribe(function(val){
            if (val && self.tiles && self.tiles.length > 0) {
                self.updateTargetTile(self.tiles);
            }
        });

        self.setResourceInstance = function() {
            console.log(params);
            if (self.resValue() != null) {
                console.log(self.resValue());
                params.requirements.resourceid = self.resValue();
            }
        }

        self.onSaveSuccess = function(tiles) {
            self.tiles = tiles;
            if (self.tiles.length > 0) {
                params.resourceid(tiles[0].resourceinstance_id);
                self.resourceId(tiles[0].resourceinstance_id);
            }
            if (self.applyOutputToTarget()) {
                self.updateTargetTile(tiles)
            }
            if (self.completeOnSave === true) {
                self.complete(true);
            }
        }
    };

    ko.components.register('select-resource-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/select-resource-step.htm'
        }
    });

    return viewModel;
});
