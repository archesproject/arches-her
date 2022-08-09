define([
    'knockout',
    'views/components/workflows/summary-step',
    'viewmodels/alert',
    'templates/views/components/workflows/site-visit/site-visit-final-step.htm',
], function(ko, SummaryStep, AlertViewModel, siteVisitFinalStepTemplate) {

    function viewModel(params) {
        var self = this;
        SummaryStep.apply(this, [params]);

        this.attendees = ko.observableArray();
        this.photographs = ko.observableArray();

        this.resourceData.subscribe(function(val){
            var currentSiteVisit;
            if (Array.isArray(val.resource['Site Visits'])){
                val.resource['Site Visits'].forEach(function(visit) {
                    if (visit['@tile_id'] === ko.unwrap(params.parenttileid)){
                        currentSiteVisit = visit;
                    }
                });
            } else {
                currentSiteVisit = val.resource['Site Visits'];
            }

            this.displayName = val['displayname'] || 'Unnamed';
            this.reportVals = {
                consultationName: {'name': 'Consultation', 'value': this.getResourceValue(val, ['displayname'])},
                date: {'name': 'Date', 'value': this.getResourceValue(currentSiteVisit, ['Timespan of Visit', 'Date of Visit', '@value'])},
                locatinDescription: {'name': 'Visit Location Description', 'value': this.getResourceValue(currentSiteVisit, ['Location', 'Location Descriptions', 'Location Description', '@value'])},
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
                this.reportVals.observations = currentSiteVisit['Observations'].map(function(obs){
                    return {
                        observation: {'name': 'observation', 'value': self.getResourceValue(obs, ['Observation', 'Observation Notes', '@value'])},
                        observedBy: {'name': 'observedBy', 'value': self.getResourceValue(obs, ['Observed by', '@value'])},
                    };
                })
            } catch(e) {
                this.reportVals.observations = [];
            }

            try {
                this.reportVals.recommendations = currentSiteVisit['Recommendations'].map(function(rec){
                    return {
                        recommendation: {'name': 'recommendation', 'value': self.getResourceValue(rec, ['Recommendation', 'Recommendation Value', '@value'])},
                        recommendedBy: {'name': 'recommendedBy', 'value': self.getResourceValue(rec, ['Recommended by', '@value'])},
                    };
                })
            } catch(e) {
                this.reportVals.recommendations = [];
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
        template: siteVisitFinalStepTemplate
    });
    return viewModel;
});
