define([
    'underscore',
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/new-tile-step',
    'templates/views/components/workflows/hide-card-step.htm',
], function(_, $, arches, ko, koMapping, NewTileStep, hideCardStepTemplate) {
    function viewModel(params) {
        NewTileStep.apply(this, [params]);
        if (!params.resourceid()) {
            params.resourceid(ko.unwrap(params.workflow.resourceId));
        }
        if (params.workflow.steps[params._index]) {
            params.tileid(ko.unwrap(params.workflow.steps[params._index].tileid));
        }

        this.workflowStepClass = ko.unwrap(params.class());
        params.defineStateProperties = function(){
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: !!(ko.unwrap(params.tile)) ? koMapping.toJS(params.tile().data) : undefined,
                tileid: !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile().tileid): undefined,
            };
        };
    }

    return ko.components.register('hide-card-step', {
        viewModel: viewModel,
        template: hideCardStepTemplate
    });
});
