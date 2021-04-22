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
        params.parenttileid = params.externalStepData.sitevisitedetailsstep.data.tileid;
        NewTileStep.apply(this, [params]);
        this.card.subscribe(function(val){
            if (val.tiles() && val.tiles().length === 0) {
                self.complete(false);
                val.tiles.subscribe(function(tiles){
                    if (tiles.length) {
                        self.complete(true);
                    }
                });
            } else {
                self.complete(true);
            }
        });
    }

    return ko.components.register('photo-gallery-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/photo-gallery-step.htm'
        }
    });

    return viewModel;
});
