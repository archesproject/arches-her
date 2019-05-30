define([
    'underscore',
    'jquery',
    'arches',
    'knockout',
    'views/components/workflows/add-ref-number-step'
], function(_, $, arches, ko, AddRefStep) {

    function viewModel(params) {
        AddRefStep.apply(this, [params]);
        var self = this;
        var urlparams = params.parseUrlParams();
        self.tile.subscribe(function(val) {
            if(val) {
                if(urlparams) {
                    if (urlparams.applyOutputToTarget) {
                        val.data[urlparams.targetnode](urlparams.value);
                    }
                }
            }
        });
    };

    return ko.components.register('set-reference-numbers', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/add-ref-number-step.htm'
        }
    });
    return viewModel;
});
