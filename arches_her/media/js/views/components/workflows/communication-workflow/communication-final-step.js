define([
    'knockout',
    'views/components/workflows/final-step',
    'viewmodels/alert'
], function(ko, FinalStep, AlertViewModel) {

    function viewModel(params) {
        FinalStep.apply(this, [params]);
        this.resourceData = ko.observable();

        this.resourceData.subscribe(function(val){
            var currentCommunication;
            if (Array.isArray(val.resource.Communications)){
                /*val.resource.Communications.forEach(function(comm) {
                    if (comm['Communication Type']['@tile_id'] === params.workflow.getStepData("related-consultation")['tileid']){
                        currentCommunication = comm;
                    }
                });*/
                currentCommunication = val.resource.Communications[val.resource.Communications.length-1];
            } else {
                currentCommunication = val.resource.Communications;
            }
            this.reportVals = {
                consultationName: {'name': 'Consultation', 'value': val.resource['Consultation Names']['Consultation Name']['@value'] || 'none'},
                subject: {'name': 'Subject', 'value': currentCommunication['Subjects']['Subject']['@value'] || 'none'},
                type: {'name': 'Type', 'value': currentCommunication['Communication Type']['@value'] || 'none'},
                date: {'name': 'Date', 'value': currentCommunication['Dates']['Date']['@value'] || 'none'},
                participants: {'name': 'Participants', 'value': currentCommunication['Attendees']['@value'] || 'none'},
                relatedCondition: {'name': 'Related Condition', 'value': currentCommunication['Related Condition']['@value'] || 'none'},
                notes: {'name': 'Notes', 'value': currentCommunication['Communication Notes']['Communication Description']['@value'] || 'none'},
                followOnActions: {'name': 'Follow-on Actions', 'value': currentCommunication['Follow on Actions']['Follow-On Actions']['@value'] || 'none'},
                uploadedFiles: {'name': 'Uploaded Files', 'value': currentCommunication['Digital File(s)']['@value'] || 'none'},
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
