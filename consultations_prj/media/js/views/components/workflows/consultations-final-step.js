define([
    'underscore',
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/final-step',
    'json!plugins/init-workflow.json'

], function(_, $, arches, ko, koMapping, FinalStep, WorkFlowConfig) {

    function viewModel(params) {

        if (!params.resourceid() && params.requirements){
            params.resourceid(params.requirements.resourceid);
            params.tileid(params.requirements.tileid);
        }

        FinalStep.apply(this, [params]);
        var self = this;
        self.requirements = params.requirements;
        params.tile = self.tile;

        this.workflows = WorkFlowConfig.workflows.map(function(wf){
            wf.url = arches.urls.plugin(wf.slug);
            return wf;
        }, this);
        

        params.getStateProperties = function(){
                return {
                    resourceid: ko.unwrap(params.resourceid),
                    tile: !!(params.tile) ? koMapping.toJS(params.tile().data) : undefined,
                    tileid: !!(params.tile) ? ko.unwrap(params.tile().tileid): undefined
                }
            };
    };

    return ko.components.register('consultations-final-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/consultations-final-step.htm'
        }
    });
    return viewModel;
});
