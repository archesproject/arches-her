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

        self.address = params.externalStepData.addressinfo.data.address;

        if (!params.resourceid()) {
            params.resourceid(ko.unwrap(params.workflow.resourceId));
        }
        if (params.workflow.steps[params._index]) {
            params.tileid(ko.unwrap(params.workflow.steps[params._index].tileid));
        }

        if (params.workflow.steps[params._index - 1]) {
            this.sourceStep = params.workflow.steps[params._index - 1];
        }

        self.targetNode = params.targetnode();

        self.tile.subscribe(function(val){
            if (self.address) {
                self.tile().data[self.targetNode](self.address);
                self.tile().save();
                self.complete(true);
            }
        });

        params.tile = self.tile;

    }

    return ko.components.register('app-area-name-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/new-tile-step.htm'
        }
    });
});
