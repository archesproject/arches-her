define([
    'knockout',
    'viewmodels/workflow',
    'viewmodels/workflow-step',
    'views/components/workflows/new-tile-step',
    'views/components/workflows/set-tile-value',
    'views/components/workflows/get-tile-value'
], function(ko, Workflow, Step) {
    return ko.components.register('add-consultation', {
        viewModel: function(params) {
            var self = this;
            params.steps = [
                {
                    title: 'Related Heritage Resources',
                    description: 'Click on the Heritage Assets, Activities, and other resources related to this',
                    component: 'new-tile-step',
                    graphid: '336d34e3-53c3-11e9-ba5f-dca90488358a',
                    nodegroupid: '2c82277d-53db-11e9-934b-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-code-fork'
                },
                {
                    title: 'Application Details',
                    description: 'Summary of the Application and Consultation Type',
                    component: 'new-tile-step',
                    graphid: '08359c2e-53f0-11e9-b212-dca90488358a',
                    nodegroupid: '04723f59-53f2-11e9-b091-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-list-alt'
                },
                {
                    title: 'Reference Numbers',
                    description: 'Application Reference Numbers',
                    component: 'new-tile-step',
                    graphid: '08359c2e-53f0-11e9-b212-dca90488358a',
                    nodegroupid: '3c79d87a-53f2-11e9-a14e-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-hashtag'
                },
                {
                    title: 'Application Proposal',
                    description: 'Summary of the Application that will be reviewed under this Consultation',
                    component: 'new-tile-step',
                    graphid: '08359c2e-53f0-11e9-b212-dca90488358a',
                    nodegroupid: 'f34ebbd4-53f3-11e9-b649-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'far-clipboard'
                },
                {
                    title: 'Contacts',
                    description: 'Identify the key people/organizations associated with this consultation',
                    component: 'new-tile-step',
                    graphid: '08359c2e-53f0-11e9-b212-dca90488358a',
                    nodegroupid: '17c07f07-53f5-11e9-9c94-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-users'
                },
                // {
                //     title: 'Step 3',
                //     description: 'Another description here',
                // }
            ];

            Workflow.apply(this, [params]);

            this.next = function(){
                var previousStep;
                var activeStep = self.activeStep();
                if (activeStep && activeStep.complete() && activeStep._index < self.steps.length - 1) {
                    this.updateUrl(activeStep, 'forward');
                    self.previousStep = activeStep;
                    self.activeStep(self.steps[activeStep._index+1]);
                    self.activeStep().resourceid = self.previousStep.resourceid
                }
            };
            self.ready(true);
        },
        template: { require: 'text!templates/views/components/plugins/add-consultation.htm' }
    });
});
