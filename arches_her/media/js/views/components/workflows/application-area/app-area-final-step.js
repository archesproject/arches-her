define([
    'knockout',
    'views/components/workflows/summary-step',
], function(ko, SummaryStep) {

    function viewModel(params) {
        SummaryStep.apply(this, [params]);

        this.resourceData.subscribe(function(val){
            var address = val.resource['Addresses'] && val.resource['Addresses'].length ? val.resource['Addresses'][0] : {};
            var designation = val.resource['Designation and Protection Assignment'] && val.resource['Designation and Protection Assignment'].length ? val.resource['Designation and Protection Assignment'][0] : {};
            var description = val.resource['Descriptions'] && val.resource['Descriptions'].length ? val.resource['Descriptions'][0] : {};

            this.reportVals = {
                buildingName: {'name': 'Building Name', 'value': this.getResourceValue(address, ['Building Name','Building Name Value','@display_value'])},
                buildingNumber: {'name': 'Building Number', 'value': this.getResourceValue(address, ['Building Number','Building Number Value','@display_value'])},
                buildingNumberSubStreet: {'name': 'Building Number Sub-street', 'value': this.getResourceValue(address, ['Building Number Sub-Street','Building Number Sub-Street Value','@display_value'])},
                street: {'name': 'Street', 'value': this.getResourceValue(address, ['Street','Street Value','@display_value'])},
                subStreet: {'name': 'Substreet', 'value': this.getResourceValue(address, ['Sub-Street ','Sub-Street Value','@display_value'])},
                locality: {'name': 'Locality', 'value': this.getResourceValue(address, ['Locality','Locality Value','@display_value'])},
                townCity: {'name': 'Town/City', 'value': this.getResourceValue(address, ['Town or City','Town or City Value','@display_value'])},
                county: {'name': 'County', 'value': this.getResourceValue(address, ['County','County Value','@display_value'])},
                postcode: {'name': 'Postcode', 'value': this.getResourceValue(address, ['Postcode','Postcode Value','@display_value'])},
                status: {'name': 'Status', 'value': this.getResourceValue(address, ['Address Status','@display_value'])},
                currency: {'name': 'Currency', 'value': this.getResourceValue(address, ['Address Currency','@display_value'])},
                applicationAreaName: {'name': 'Name', 'value': this.getResourceValue(val.resource, ['Application Area Names', 'Application Area Name','@display_value'])},
                applicationAreaDescription: {'name': '', 'value': this.getResourceValue(description, ['Description','@display_value'])}, 
                designationType: {'name': 'Designation/Protection Type', 'value': this.getResourceValue(designation,['Designation or Protection Type','@display_value'])},
                designationGrade: {'name': 'CanvasGradient', 'value': this.getResourceValue(designation,['Grade','@display_value'])},
                designationReference: {'name': 'Reference', 'value': this.getResourceValue(designation,['References','Reference','@display_value'])},
            };

            try {
                this.reportVals.references = val.resource['References'].map(function(ref){
                    return {
                        referenceName: {'name': 'Reference', 'value': self.getResourceValue(ref, ['Agency Identifier', 'Reference', '@display_value'])},
                        referenceType: {'name': 'Reference Type', 'value': self.getResourceValue(ref, ['Agency Identifier', 'Reference Type', '@display_value'])},
                        agency: {'name': 'Agency', 'value': self.getResourceValue(ref, ['Agency', '@display_value'])}
                    };
                })
            } catch(e) {
                this.reportVals.references = [];
            }

            var geojsonStr = this.getResourceValue(val.resource, ['Geometry','Geospatial Coordinates','@display_value']);
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
