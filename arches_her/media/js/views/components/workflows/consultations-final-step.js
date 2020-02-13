define([
    'underscore',
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/final-step',
    'viewmodels/alert'
], function(_, $, arches, ko, koMapping, FinalStep, AlertViewModel) {

    function viewModel(params) {
        var self = this;
        FinalStep.apply(this, [params]);
        self.loading(true);
        params.tile = self.tile;
        this.workflowJSON = ko.observable();
        this.workflows = ko.observableArray();
        this.getJSON = function() {
            $.ajax({
                type: "GET",
                url: arches.urls.plugin('init-workflow'),
                data: {
                    "json":true
                },
                context: self,
                success: function(data){
                    // console.log(data);
                    self.workflowJSON(data);
                },
                error: function(response) {
                    if(response.statusText !== 'abort'){
                        this.viewModel.alert(new AlertViewModel('ep-alert-red', arches.requestFailed.title, response.responseText));
                    }
                }
            });
            self.loading(false);
        };
        this.getJSON();

        this.workflowJSON.subscribe(function(val){
            if(val) {
                self.workflows(val['config']['workflows'].map(function(wf){
                    wf.url = '/arches-her'+arches.urls.plugin(wf.slug);
                    return wf;
                }, this));
            }
        });

        params.getStateProperties = function(){
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: !!(params.tile) ? koMapping.toJS(params.tile().data) : undefined,
                tileid: !!(params.tile) ? ko.unwrap(params.tile().tileid): undefined
            };
        };
    }

    ko.components.register('consultations-final-step', {
        viewModel: viewModel,
        template: { require: 'text!templates/views/components/workflows/consultations-final-step.htm' }
    });
    return viewModel;
});
