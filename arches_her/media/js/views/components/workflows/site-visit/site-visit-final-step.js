define([
    'knockout',
    'views/components/workflows/summary-step',
    'viewmodels/alert'
], function(ko, SummaryStep, AlertViewModel) {

    function viewModel(params) {
        var self = this;
        SummaryStep.apply(this, [params]);

        this.attendees = ko.observableArray();
        this.photographs = ko.observableArray();

        var currentTileId = ko.unwrap(params.form.externalStepData.sitevisitedetailsstep.data.tileid);

        this.resourceData.subscribe(function(val){
            var currentSiteVisit;
            if (Array.isArray(val.resource['Site Visits'])){
                val.resource['Site Visits'].forEach(function(visit) {
                    if (visit['@tile_id'] === currentTileId){
                        currentSiteVisit = visit;
                    }
                });
            } else {
                currentSiteVisit = val.resource['Site Visits'];
            }

            var observation = currentSiteVisit['Observations'] && currentSiteVisit['Observations'].length ? currentSiteVisit['Observations'][0] : {};
            var recommendation = currentSiteVisit['Recommendations'] && currentSiteVisit['Recommendations'].length ? currentSiteVisit['Recommendations'][0] : {};

            this.displayName = val['displayname'] || 'Unnamed';
            this.reportVals = {
                consultationName: {'name': 'Consultation', 'value': this.getResourceValue(val, ['displayname'])},
                date: {'name': 'Date', 'value': this.getResourceValue(currentSiteVisit, ['Timespan of Visit', 'Date of Visit', '@value'])},
                locatinDescription: {'name': 'Visit Location Description', 'value': this.getResourceValue(currentSiteVisit, ['Location', 'Location Descriptions', 'Location Description', '@value'])},
                observation: {'name': 'Observations', 'value': this.getResourceValue(observation, ['Observation', 'Observation Notes', '@value'])},
                recommendations: {'name': 'Recommendations', 'value': this.getResourceValue(recommendation, ['Recommendation', 'Recommendation Value', '@value'])},
            }

            try {
                this.reportVals.attendees = currentSiteVisit['Attendees'].map(function(attendee){
                    return {
                        attendee: {'name': 'Attendee', 'value': self.getResourceValue(attendee, ['Attendee', '@value'])},
                        attendeeType: {'name': 'Type', 'value': self.getResourceValue(attendee, ['Attendee Type', '@value'])},
                    };
                })
            } catch(e) {
                this.reportVals.attendees = [];
            }

            try {
                this.reportVals.photographs = currentSiteVisit['Photographs'].map(function(photograph){
                    return {
                        photo: {'name': 'Photo', 'value': self.getResourceValue(photograph, ['@value'])},
                        caption: {'name': 'Caption', 'value': self.getResourceValue(photograph, ['Caption Notes', 'Caption Note', '@value'])},
                        copyrightType: {'name': 'Copyright Type', 'value': self.getResourceValue(photograph, ['Copyright', 'Copyright Type', '@value'])},
                        copyrightHolder: {'name': 'Copyright Holder', 'value': self.getResourceValue(photograph, ['Copyright', 'Copyright Holder', '@value'])},
                        copyrightNotes: {'name': 'Copyright Notes', 'value': self.getResourceValue(photograph, ['Copyright', 'Copyright Note', 'Copyright Note Text', '@value'])},
                    };
                })
            } catch(e) {
                this.reportVals.photographs = [];
            }
            this.loading(false);
        }, this);
    }

    ko.components.register('site-visit-final-step', {
        viewModel: viewModel,
        template: { require: 'text!templates/views/components/workflows/site-visit/site-visit-final-step.htm' }
    });
    return viewModel;
});
