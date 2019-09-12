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
        params.tile = self.tile;

        params.getStateProperties = function(){
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: !!(ko.unwrap(params.tile)) ? koMapping.toJS(params.tile().data) : undefined,
                tileid: !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile().tileid): undefined,
                applyOutputToTarget: ko.unwrap(this.applyOutputToTarget)
            };
        };
    }

    return ko.components.register('app-area-address-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/app-area-address-step.htm'
        }
    });
});
