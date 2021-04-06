define([
    'knockout',
    'views/components/workflows/final-step',
    'viewmodels/alert'
], function(ko, FinalStep, AlertViewModel) {

    function viewModel(params) {
        FinalStep.apply(this, [params]);
        this.resourceData = ko.observable();

        this.resourceData.subscribe(function(val){
            this.reportVals = {
                consultationName: {'name': 'Consultation', 'value': val.resource['Consultation Names']['Consultation Name']['@value'] || 'none'},
                subject: {'name': 'Subject', 'value': val.resource['Communications']['Subjects']['Subject']['@value'] || 'none'},
                type: {'name': 'Type', 'value': val.resource['Communications']['Communication Type']['@value'] || 'none'},
                date: {'name': 'Date', 'value': val.resource['Communications']['Dates']['Date']['@value'] || 'none'},
                participants: {'name': 'Participants', 'value': val.resource['Communications']['Attendees']['@value'] || 'none'},
                relatedCondition: {'name': 'Related Condition', 'value': val.resource['Communications']['Related Condition']['@value'] || 'none'},
                notes: {'name': 'Notes', 'value': val.resource['Communications']['Communication Notes']['Communication Description']['@value'] || 'none'},
                followOnActions: {'name': 'Follow-on Actions', 'value': val.resource['Communications']['Follow on Actions']['Follow-On Actions']['@value'] || 'none'},
                uploadedFiles: {'name': 'Uploaded Files', 'value': val.resource['Communications']['Digital File(s)']['@value'] || 'none'},
            }
            this.loading(false);
        }, this);

        window.fetch(this.urls.api_resources(this.resourceid) + '?format=json&compact=false')
        .then(response => response.json())
        .then(data => this.resourceData(data))
        
    }

    ko.components.register('communication-final-step', {
        viewModel: viewModel,
        template: { require: 'text!templates/views/components/workflows/communication-workflow/communication-final-step.htm' }
    });
    return viewModel;
});
