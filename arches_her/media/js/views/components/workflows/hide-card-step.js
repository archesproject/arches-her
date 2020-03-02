define([
    'underscore',
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/new-tile-step'
], function(_, $, arches, ko, koMapping, NewTileStep) {
    function viewModel(params) {
        NewTileStep.apply(this, [params]);
        if (!params.resourceid()) {
            params.resourceid(params.workflow.state.resourceid);
        }
        if (params.workflow.state.steps[params._index]) {
            params.tileid(params.workflow.state.steps[params._index].tileid);
        }

        this.workflowStepClass = ko.unwrap(params.class());
        params.getStateProperties = function(){
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: !!(ko.unwrap(params.tile)) ? koMapping.toJS(params.tile().data) : undefined,
                tileid: !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile().tileid): undefined,
            };
        };
    }

    return ko.components.register('hide-card-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/hide-card-step.htm'
        }
    });
});
