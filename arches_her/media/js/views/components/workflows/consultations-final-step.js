define([
    'knockout',
    'views/components/workflows/summary-step',
], function(ko, SummaryStep) {

    function viewModel(params) {
        SummaryStep.apply(this, [params]);

        this.resourceData.subscribe(function(val){
            this.reportVals = {
                featureShape: {'name': 'Feature Shape', 'value': val.resource['Consultation Area']['Geometry']['Feature Shape']['@value'] || 'none'},
                logDate: {'name': 'Log Date', 'value': val.resource['Consultation Dates']['Log Date']['@value'] || 'none'},
                targetDate: {'name': 'Target Date', 'value': val.resource['Consultation Dates']['Target Date']['Target Date Start']['@value'] || 'none'},
                consultationType: {'name': 'Consultation Type', 'value': val.resource['Consultation Type']['@value'] || 'none'},
                applicationType: {'name': 'Application Type', 'value': val.resource['Application Type']['@value'] || 'none'},
                developmentType: {'name': 'Development Type', 'value': val.resource['Development Type']['@value'] || 'none'},
                references: val.resource['References'].map(function(ref){
                    return {
                        referenceName: {'name': 'Reference', 'value': ref['Agency Identifier']['Reference']['@value'] || 'none'},
                        referenceType: {'name': 'Reference Type', 'value': ref['Agency Identifier']['Reference Type']['@value'] || 'none'},
                        agency: {'name': 'Agency', 'value': ref['Agency']['@value'] || 'none'},
                    };
                }) || 'none',
                proposalDescription: {'name': 'Proposal Description', 'value': val.resource['Proposal']['Proposal Text']['@value'] || 'none'},
                planningOfficer: {'name': 'Planning Officer', 'value': val.resource['Contacts']['Planning Officers']['Planning Officer']['@value'] || 'none'},
                consultingContact: {'name': 'Consulting Contact', 'value': val.resource['Contacts']['Consulting Contact']['@value'] || 'none'},
                caseworkOfficer: {'name': 'Casework Officer', 'value': val.resource['Contacts']['Casework Officers']['Casework Officer']['@value'] || 'none'},
                agent: {'name': 'Agent', 'value': val.resource['Contacts']['Agents']['Agent']['@value'] || 'none'},
                owner: {'name': 'Owner', 'value': val.resource['Contacts']['Owners']['Owner']['@value'] || 'none'},
                applicant: {'name': 'Applicant', 'value': val.resource['Contacts']['Applicants']['Applicant']['@value'] || 'none'},
                relatedFiles:  {'name': 'Related Files', 'value': val.resource['Proposal']['Digital File(s)']['@value'] || 'none'},
            };
            var geojsonStr = val.resource['Consultation Area']['Geometry']['Geospatial Coordinates']['@value'].replaceAll("'", '"');
            var geojson = JSON.parse(geojsonStr);
            this.prepareMap(geojson, 'consultation-map-data');
            this.loading(false);
        }, this);
    }

    ko.components.register('consultations-final-step', {
        viewModel: viewModel,
        template: { require: 'text!templates/views/components/workflows/consultations-final-step.htm' }
    });
    return viewModel;
});
