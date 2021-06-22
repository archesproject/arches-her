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

            this.displayName = val['displayname'] || 'Unnamed';
            this.reportVals = {
                buildingName: {'name': 'Building Name', 'value': this.getResourceValue(address, ['Building Name','Building Name Value','@value'])},
                buildingNumber: {'name': 'Building Number', 'value': this.getResourceValue(address, ['Building Number','Building Number Value','@value'])},
                buildingNumberSubStreet: {'name': 'Building Number Sub-street', 'value': this.getResourceValue(address, ['Building Number Sub-Street','Building Number Sub-Street Value','@value'])},
                street: {'name': 'Street', 'value': this.getResourceValue(address, ['Street','Street Value','@value'])},
                subStreet: {'name': 'Substreet', 'value': this.getResourceValue(address, ['Sub-Street ','Sub-Street Value','@value'])},
                locality: {'name': 'Locality', 'value': this.getResourceValue(address, ['Locality','Locality Value','@value'])},
                townCity: {'name': 'Town/City', 'value': this.getResourceValue(address, ['Town or City','Town or City Value','@value'])},
                county: {'name': 'County', 'value': this.getResourceValue(address, ['County','County Value','@value'])},
                postcode: {'name': 'Postcode', 'value': this.getResourceValue(address, ['Postcode','Postcode Value','@value'])},
                status: {'name': 'Status', 'value': this.getResourceValue(address, ['Address Status','@value'])},
                currency: {'name': 'Currency', 'value': this.getResourceValue(address, ['Address Currency','@value'])},
                applicationAreaName: {'name': 'Name', 'value': this.getResourceValue(val.resource, ['Application Area Names', 'Application Area Name','@value'])},
                applicationAreaDescription: {'name': '', 'value': this.getResourceValue(description, ['Description','@value'])}, 
                designationType: {'name': 'Designation/Protection Type', 'value': this.getResourceValue(designation,['Designation or Protection Type','@value'])},
                designationGrade: {'name': 'CanvasGradient', 'value': this.getResourceValue(designation,['Grade','@value'])},
                designationReference: {'name': 'Reference', 'value': this.getResourceValue(designation,['References','Reference','@value'])},
            };

            try {
                this.reportVals.references = val.resource['References'].map(function(ref){
                    return {
                        referenceName: {'name': 'Reference', 'value': self.getResourceValue(ref, ['Agency Identifier', 'Reference', '@value'])},
                        referenceType: {'name': 'Reference Type', 'value': self.getResourceValue(ref, ['Agency Identifier', 'Reference Type', '@value'])},
                        agency: {'name': 'Agency', 'value': self.getResourceValue(ref, ['Agency', '@value'])}
                    };
                })
            } catch(e) {
                this.reportVals.references = [];
            }

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
