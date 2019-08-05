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
        this.applyOutputToTarget = params.applyOutputToTarget;

        this.workflowStepClass = ko.pureComputed(function() {
            return self.applyOutputToTarget() ? params.class() : '';
        }, viewModel);

        params.stateProperties = function(){
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: !!(ko.unwrap(params.tile)) ? koMapping.toJS(params.tile().data) : undefined,
                tileid: !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile().tileid): undefined,
                applyOutputToTarget: ko.unwrap(this.applyOutputToTarget)
            }
        };

        self.onSaveSuccess = function(tiles) {
            self.tiles = tiles;
            if (self.tiles.length > 0) {
                params.resourceid(tiles[0].resourceinstance_id);
                self.resourceId(tiles[0].resourceinstance_id);
            }
            if (self.completeOnSave === true) {
                self.complete(true);
            }
        }
    };

    return ko.components.register('hide-card-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/hide-card-step.htm'
        }
    });

    return viewModel;
});
