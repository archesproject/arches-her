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
        if (!params.resourceid()) {
            params.resourceid(params.workflow.state.resourceid);
        }
        if (params.workflow.state.steps[params._index]) {
            params.tileid(params.workflow.state.steps[params._index].tileid);
        }

        this.nameheading = params.nameheading;
        this.namelabel = params.namelabel;
        this.applyOutputToTarget = params.applyOutputToTarget;
        this.workflowStepClass = ko.pureComputed(function() {
            return self.applyOutputToTarget() ? params.class() : '';
        }, viewModel);

        params.tile = self.tile;

        params.getStateProperties = function(){
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: !!(ko.unwrap(params.tile)) ? koMapping.toJS(params.tile().data) : undefined,
                tileid: !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile().tileid): undefined,
                applyOutputToTarget: ko.unwrap(this.applyOutputToTarget)
            };
        };

        self.updateTargetTile = function(tiles){
            var targetresult, targettile, sourcetile, targetvals;
            tiles.forEach(function(tile){
                if (tile.nodegroup_id === ko.unwrap(params.targetnodegroup)) {
                    targettile = tile;
                } else if (tile.nodegroup_id === ko.unwrap(params.nodegroupid)) {
                    sourcetile = tile;
                }
            });

            targetvals = _.map(sourcetile.data, function(v, k) {return ko.unwrap(v);});
            var building = targetvals[2] ? targetvals[2] + ", " : '';
            var street   = targetvals[1] ? targetvals[1] + ", " : '';
            var locality = targetvals[3] ? targetvals[3] + ", " : '';
            var city     = targetvals[4] ? targetvals[4] + ", " : '';
            var postcode = targetvals[0] ? targetvals[0] : '';
            targetresult = building + street + locality + city + postcode;
            targettile.data[params.targetnode()](targetresult);
            targettile.save();
        };

        self.applyOutputToTarget.subscribe(function(val){
            if (val && self.tiles && self.tiles.length > 0) {
                self.updateTargetTile(self.tiles);
            }
        });

        self.onSaveSuccess = function(tiles) {
            self.tiles = tiles;
            if (self.tiles.length > 0) {
                params.resourceid(tiles[0].resourceinstance_id);
                self.resourceId(tiles[0].resourceinstance_id);
            }
            if (self.applyOutputToTarget()) { self.updateTargetTile(tiles); }
            if (self.completeOnSave === true) { self.complete(true); }
        };
    }

    return ko.components.register('get-tile-value', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/get-tile-value.htm'
        }
    });
});
