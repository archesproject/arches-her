define([
    'underscore',
    'jquery',
    'arches',
    'knockout',
    'views/components/workflows/new-tile-step'
], function(_, $, arches, ko, NewTileStep) {

    function viewModel(params) {
        var self = this;
        NewTileStep.apply(this, [params]);
        this.input = params.input;
        self.tile.subscribe(function(val) {
            if(val) {
                if(self.input()) {
                    if (self.input().applyOutputToTarget()) {
                        val.data[self.input().targetnode](self.input().value);
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
