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
        this.workflowStepClass = ko.unwrap(params.class());
        this.nameheading = params.nameheading;
        this.namelabel = params.namelabel;
        this.applyOutputToTarget = params.applyOutputToTarget;
        params.tile = self.tile;

        params.defineStateProperties = function(){
            var wastebin = !!(ko.unwrap(params.wastebin)) ? koMapping.toJS(params.wastebin) : undefined;
            if (wastebin && 'resourceid' in wastebin) {
                wastebin.resourceid = ko.unwrap(params.resourceid);
            }
            ko.mapping.fromJS(wastebin, {}, params.wastebin);
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: !!(ko.unwrap(params.tile)) ? koMapping.toJS(params.tile().data) : undefined,
                tileid: !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile().tileid): undefined,
                applyOutputToTarget: ko.unwrap(this.applyOutputToTarget),
                wastebin: wastebin,
                address: self.address
            };
        };

        self.getAddressString = ko.computed(function(){
            if (self.tile()){
                var buildingName = ko.unwrap(self.tile().data["c7ec960d-28c8-11eb-aee4-f875a44e0e11"]);
                var buildingNumber = ko.unwrap(self.tile().data["c7ec960f-28c8-11eb-86f0-f875a44e0e11"]);
                var buildingNumberSubStreet = ko.unwrap(self.tile().data["c7ec9605-28c8-11eb-bfd4-f875a44e0e11"]);
                var subStreet = ko.unwrap(self.tile().data["c7ec960b-28c8-11eb-b8ad-f875a44e0e11"]);
                var street = ko.unwrap(self.tile().data["c7ec9611-28c8-11eb-b865-f875a44e0e11"]);
                var locality = ko.unwrap(self.tile().data["c7ec9613-28c8-11eb-966c-f875a44e0e11"]);
                var city = ko.unwrap(self.tile().data["c7ec9607-28c8-11eb-acf0-f875a44e0e11"]);
                var county = ko.unwrap(self.tile().data["c7ec9615-28c8-11eb-a5c5-f875a44e0e11"]);
                var postcode = ko.unwrap(self.tile().data["c7ec9609-28c8-11eb-a6a3-f875a44e0e11"]);
                var building = [buildingName, buildingNumber, buildingNumberSubStreet].filter(Boolean).join(" ");
                var fullStreet = [subStreet, street].filter(Boolean).join(" ");
                return [building, fullStreet, locality, city, county, postcode].filter(Boolean).join(", ")
            }
        });

        self.getAddressString.subscribe(function(val){
            if (self.applyOutputToTarget && val) {
                self.address = self.getAddressString();
            }
        });

        self.applyOutputToTarget.subscribe(function(val){
            if (val) {
                self.address = self.getAddressString();
            } else {
                self.address = null;
            }
            console.log(self.address)
        });

    }

    return ko.components.register('app-area-address-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/app-area-address-step.htm'
        }
    });
});
