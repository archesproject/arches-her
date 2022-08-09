define([
    'knockout',
    'uuid',
    'arches',
    'views/components/workflows/summary-step',
    'templates/views/components/workflows/consultation/consultations-final-step.htm',
], function(ko, uuid, arches, SummaryStep, consultationsFinalStepTemplate) {

    function viewModel(params) {
        var self = this;
        this.resourceid = params.resourceid;
        SummaryStep.apply(this, [params]);

        this.resourceLoading = ko.observable(true);
        this.relatedResourceLoading = ko.observable(true);
        this.geometry = false;

        this.resourceData.subscribe(function(val){
            this.displayName = val['displayname'] || 'Unnamed';
            this.reportVals = {
                featureShape: {'name': 'Feature Shape', 'value': this.getResourceValue(val.resource, ['Consultation Area','Geometry','Feature Shape','@value'])},
                logDate: {'name': 'Log Date', 'value': this.getResourceValue(val.resource, ['Consultation Dates','Log Date','@value'])},
                targetDate: {'name': 'Target Date', 'value': this.getResourceValue(val.resource, ['Consultation Dates','Target Date','Target Date Start','@value'])},
                consultationType: {'name': 'Consultation Type', 'value': this.getResourceValue(val.resource, ['Consultation Type','@value'])},
                applicationType: {'name': 'Application Type', 'value': this.getResourceValue(val.resource, ['Application Type','@value'])},
                developmentType: {'name': 'Development Type', 'value': this.getResourceValue(val.resource, ['Development Type','@value'])},
                proposalDescription: {'name': 'Proposal Description', 'value': this.getResourceValue(val.resource, ['Proposal',[0],'Proposal Text','@value'])},
                planningOfficer: {'name': 'Planning Officer', 'value': this.getResourceValue(val.resource, ['Contacts','Planning Officers','Planning Officer','@value'])},
                consultingContact: {'name': 'Consulting Contact', 'value': this.getResourceValue(val.resource, ['Contacts','Consulting Contact','@value'])},
                caseworkOfficer: {'name': 'Casework Officer', 'value': this.getResourceValue(val.resource, ['Contacts','Casework Officers','Casework Officer','@value'])},
                agent: {'name': 'Agent', 'value': this.getResourceValue(val.resource, ['Contacts','Agents','Agent','@value'])},
                owner: {'name': 'Owner', 'value': this.getResourceValue(val.resource, ['Contacts','Owners','Owner','@value'])},
                applicant: {'name': 'Applicant', 'value': this.getResourceValue(val.resource, ['Contacts','Applicants','Applicant','@value'])},
                relatedApplicationAreas:  {'name': 'Related Application Areas', 'value': this.getResourceValue(val.resource, ['Consultation Area', 'Geometry', 'Related Application Area', '@value'])},
                locationDescription: {'name': 'Consultation Location Description', 'value': this.getResourceValue(val.resource, ['Consultation Area', 'Geometry', 'Consultation Location Descriptions', 'Consultation Location Description', '@value'])},
            };

            try {
                this.reportVals.references = val.resource['References'].map(function(ref){
                    return {
                        referenceNumber: {'name': 'Reference', 'value': self.getResourceValue(ref, ['Agency Identifier', 'Reference', '@value'])},
                        referenceType: {'name': 'Reference Type', 'value': self.getResourceValue(ref, ['Agency Identifier', 'Reference Type', '@value'])},
                        agency: {'name': 'Agency', 'value': self.getResourceValue(ref, ['Agency', '@value'])}
                    };
                })
            } catch(e) {
                this.reportVals.references = [];
            }

            var geojsonStr = this.getResourceValue(val.resource, ['Consultation Area', 'Geometry', 'Geospatial Coordinates', '@value']);
            if (geojsonStr) {
                try {
                    var geojson = JSON.parse(geojsonStr.replaceAll("'", '"'));
                    this.prepareMap(geojson, 'app-area-map-data');
                    this.geometry = true;
                } catch(e) {
                    //pass
                }
            };
            this.resourceLoading(false);
            if (!self.relatedResourceLoading()) {
                self.loading(false);
            };
            
            if (!val.resource['Status']) {
                var statusNodegroupId = '6a773228-db20-11e9-b6dd-784f435179ea';
                var statusTemplate = {
                    "tileid": null,
                    "data": {},
                    "nodegroup_id": null,
                    "parenttile_id": null,
                    "resourceinstance_id": null,
                    "sortorder": 0
                };
                statusTemplate["resourceinstance_id"] =  self.resourceid;
                statusTemplate["nodegroup_id"] = statusNodegroupId;
                statusTemplate["data"][statusNodegroupId] =  true;
        
                window.fetch(arches.urls.api_tiles(uuid.generate()), {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(statusTemplate),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then(function(response) {
                    // pass;
                }).catch(function(response){
                    // eslint-disable-next-line no-console
                    console.log("The status has not updated: \n", response);
                });        
            }
        }, this);

        this.relatedResources.subscribe(function(val){
            const digitalObjectGraphId = 'a535a235-8481-11ea-a6b9-f875a44e0e11';
            const digitalResource = val.related_resources.find(function(resource){
                return resource.graph_id == digitalObjectGraphId;
            });
            if (digitalResource) {
                self.relatedFile = {'name': 'Related Files', 'value': digitalResource.displayname, 'link': `${arches.urls.resource}\\${digitalResource.resourceinstanceid}`};
            } else {
                self.relatedFile = {'name': 'Related Files', 'value': 'none', 'link': null};                
            }
            self.relatedResourceLoading(false);
            if (!self.resourceLoading()) {
                self.loading(false);
            };
        })
    }

    ko.components.register('consultations-final-step', {
        viewModel: viewModel,
        template: consultationsFinalStepTemplate
    });
    return viewModel;
});
