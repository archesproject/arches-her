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

        self.getAddressString = function(sourceTile){
            var targetvals = _.map(sourceTile, function(v, k) {return ko.unwrap(v);});
            var building = targetvals[2] ? targetvals[2] + ", " : '';
            var street   = targetvals[1] ? targetvals[1] + ", " : '';
            var locality = targetvals[3] ? targetvals[3] + ", " : '';
            var city     = targetvals[4] ? targetvals[4] + ", " : '';
            var postcode = targetvals[0] ? targetvals[0] : '';
            return building + street + locality + city + postcode;
        };

        params.applyOutputToTarget = ko.observable(false);
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
            if (self.sourceStep) {
                self.address = self.getAddressString(self.sourceStep.tile);
                if (self.sourceStep.applyOutputToTarget === true) {
                    self.tile().data[self.targetNode](self.address);
                    self.tile().save();
                    self.complete(true);
                }
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
