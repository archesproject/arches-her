define([
    'underscore',
    'jquery',
    'arches',
    'knockout',
    'views/components/workflows/new-tile-step'
], function(_, $, arches, ko, NewTileStep) {

    function viewModel(params) {
        NewTileStep.apply(this, [params]);
        var self = this;
        var urlparams = params.parseUrlParams()
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

    return ko.components.register('set-tile-value', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/new-tile-step.htm'
        }
    });
    return viewModel;
});
