define([
    'knockout',
    'views/components/workflows/summary-step',
    'templates/views/components/workflows/application-area/app-area-final-step.htm',
], function(ko, SummaryStep, appAreaFinalStepTemplate) {

    function viewModel(params) {
        SummaryStep.apply(this, [params]);
        this.geometry = false;
        this.resourceData.subscribe(function(val){
            const self = this;
            var description = val.resource['Descriptions'] && val.resource['Descriptions'].length ? val.resource['Descriptions'][0] : {};

            this.displayName = val['displayname'] || 'Unnamed';
            this.reportVals = {
                applicationAreaName: {'name': 'Name', 'value': this.getResourceValue(val.resource, ['Application Area Names', 'Application Area Name','@value'])},
                applicationAreaDescription: {'name': '', 'value': this.getResourceValue(description, ['Description','@value'])},
                locationDescription: {'name': 'Location Description', 'value': this.getResourceValue(val.resource, ['Location Descriptions',[0],'Location Description','@value'])},
                locationDescriptionType: {'name': 'Location Description', 'value': this.getResourceValue(val.resource, ['Location Descriptions',[0],'Location Description Type','@value'])},
            };

            try {
                this.reportVals.designations = val.resource['Designation and Protection Assignment'].map(function(designation){
                    const reference = self.getResourceValue(designation,['Reference URL','@value'])
                    const referenceUrl = (reference !== 'none') ? JSON.parse(reference).url : undefined
                    const referenceLabel = (reference !== 'none') && JSON.parse(reference).url_label !== '' ? JSON.parse(reference).url_label
                        : referenceUrl ? referenceUrl: 'none';
                    return {
                        designationName: {'name': 'Designation Name', 'value': self.getResourceValue(designation,['Designation Names', 'Designation Name','@value'])},
                        designationNameUseType: {'name': 'Designation Name Use Type', 'value': self.getResourceValue(designation,['Designation Names', 'Designation Name Use Type','@value'])},
                        designationType: {'name': 'Designation/Protection Type', 'value': self.getResourceValue(designation,['Designation or Protection Type','@value'])},
                        designationGrade: {'name': 'Grade', 'value': self.getResourceValue(designation,['Grade','@value'])},
                        designationRiskStatus: {'name': 'Risk Status', 'value': self.getResourceValue(designation,['Risk Status','@value'])},
                        designationReference: {'name': 'Reference', 'value': referenceLabel, 'link': referenceUrl},
                        designationDigitalFiles: {'name': 'Digital File(s)', 'value': self.getResourceValue(designation,['Digital File(s)','@value'])},
                    };
                })
            } catch(e) {
                this.reportVals.designations = [];
            }

            var geojsonStr = this.getResourceValue(val.resource, ['Geometry','Geospatial Coordinates','@value']);
            if (geojsonStr) {
                try {
                    var geojson = JSON.parse(geojsonStr.replaceAll("'", '"'));
                    this.prepareMap(geojson, 'app-area-map-data');
                    this.geometry = true;
                } catch(e) {
                    //pass
                }
            }
            this.loading(false);
        }, this);
    }

    ko.components.register('app-area-final-step', {
        viewModel: viewModel,
        template: appAreaFinalStepTemplate
    });
    return viewModel;
});
