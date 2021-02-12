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

        params.applyOutputToTarget = ko.observable(true);
        if (!params.resourceid()) {
            params.resourceid(ko.unwrap(params.workflow.resourceId));
        }
        if (params.workflow.steps[params._index]) {
            params.tileid(ko.unwrap(params.workflow.steps[params._index].tileid));
        }

        this.nameheading = params.nameheading;
        this.namelabel = params.namelabel;
        this.applyOutputToTarget = params.applyOutputToTarget;
        params.tile = self.tile;

        params.defineStateProperties = function(){
            var wastebin = !!(ko.unwrap(params.wastebin)) ? koMapping.toJS(params.wastebin) : undefined;
            if (wastebin && 'resourceid' in wastebin) {
                wastebin.resourceid = ko.unwrap(params.resourceid);
            }
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: !!(ko.unwrap(params.tile)) ? koMapping.toJS(params.tile().data) : undefined,
                tileid: !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile().tileid): undefined,
                applyOutputToTarget: ko.unwrap(this.applyOutputToTarget),
                wastebin: wastebin
            };
        };

        self.applyOutputToTarget.subscribe(function(val){
            if (val && self.tile) {
                self.address = self.getAddressString();
            }
        });
    }

    return ko.components.register('app-area-address-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/app-area-address-step.htm'
        }
    });
});
