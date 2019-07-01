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
        params.completeOnSave = false;
        NewTileStep.apply(this, [params]);
    };

    return ko.components.register('photo-gallery-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/photo-gallery-step.htm'
        }
    });

    return viewModel;
});
