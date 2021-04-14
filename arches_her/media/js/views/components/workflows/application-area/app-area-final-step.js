define([
    'knockout',
    'views/components/workflows/summary-step',
], function(ko, SummaryStep) {

    function viewModel(params) {
        SummaryStep.apply(this, [params]);

        this.resourceData.subscribe(function(val){
            this.reportVals = {
                buildingName: {'name': 'Building Name', 'value': this.getResourceValue(val.resource, ['Addresses','Builrding Name','Building Name Value','@value'])},
                buildingNumber: {'name': 'Building Number', 'value': this.getResourceValue(val.resource, ['Addresses','Building Number','Building Number Value','@value'])},
                buildingNumberSubStreet: {'name': 'Building Number Sub-street', 'value': this.getResourceValue(val.resource, ['Addresses','Building Number Sub-Street','Building Number Sub-Street Value','@value'])},
                street: {'name': 'Street', 'value': this.getResourceValue(val.resource, ['Addresses','Street','Street Value','@value'])},
                subStreet: {'name': 'Substreet', 'value': this.getResourceValue(val.resource, ['Addresses','Sub-Street ','Sub-Street Value','@value'])},
                locality: {'name': 'Locality', 'value': this.getResourceValue(val.resource, ['Addresses','Locality','Locality Value','@value'])},
                townCity: {'name': 'Town/City', 'value': this.getResourceValue(val.resource, ['Addresses','Town or City','Town or City Value','@value'])},
                county: {'name': 'County', 'value': this.getResourceValue(val.resource, ['Addresses','County','County Value','@value'])},
                postcode: {'name': 'Postcode', 'value': this.getResourceValue(val.resource, ['Addresses','Postcode','Postcode Value','@value'])},
                status: {'name': 'Status', 'value': this.getResourceValue(val.resource, ['Addresses','Address Status','@value'])},
                currency: {'name': 'Currency', 'value': this.getResourceValue(val.resource, ['Addresses','Address Currency','@value'])},
                applicationAreaName: {'name': 'Name', 'value': this.getResourceValue(val.resource, ['Application Area Names', 'Application Area Name','@value'])},
                applicationAreaDescription: {'name': '', 'value': this.getResourceValue(val.resource, ['Descriptions','Description','@value'])},
                designationType: {'name': 'Designation/Protection Type', 'value': this.getResourceValue(val.resource, ['Designation and Protection Assignment','Designation or Protection Type','@value'])},
                designationGrade: {'name': 'CanvasGradient', 'value': this.getResourceValue(val.resource, ['Designation and Protection Assignment','Grade','@value'])},
                designationReference: {'name': 'Reference', 'value': this.getResourceValue(val.resource, ['Designation and Protection Assignment','References','Reference','@value'])},
            };
            var geojsonStr = this.getResourceValue(val.resource, ['Geometry','Geospatial Coordinates','@value']);
            if (geojsonStr) {
                var geojson = JSON.parse(geojsonStr.replaceAll("'", '"'));
                this.prepareMap(geojson, 'app-area-map-data');
            }
            this.loading(false);
        }, this);
    }

    ko.components.register('app-area-final-step', {
        viewModel: viewModel,
        template: { require: 'text!templates/views/components/workflows/application-area/app-area-final-step.htm' }
    });
    return viewModel;
});
