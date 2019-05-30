define([
    'knockout',
    'viewmodels/workflow',
    'viewmodels/workflow-step',
    'views/components/workflows/new-tile-step',
    'views/components/workflows/set-tile-value',
    'views/components/workflows/get-tile-value',
    'views/components/workflows/set-reference-numbers'
], function(ko, Workflow, Step) {
    return ko.components.register('add-consultation', {
        viewModel: function(params) {
            var self = this;
            params.steps = [
                {
                    title: 'Assign Address',
                    description: 'Assign an address to your application area. Use the address as the default name',
                    component: 'get-tile-value',
                    graphid: '336d34e3-53c3-11e9-ba5f-dca90488358a',
                    nodegroupid: 'e857704a-53d8-11e9-b05a-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-envelope'
                },
                {
                    title: 'Assign Name',
                    description: 'Assign a name to your application area',
                    component: 'set-tile-value',
                    graphid: '336d34e3-53c3-11e9-ba5f-dca90488358a',
                    nodegroupid: 'c5f909b5-53c7-11e9-a3ac-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-tag'
                },
                {
                    title: 'Add Ref Numbers',
                    description: 'step to add ref numbers using new wkflow step',
                    component: 'set-reference-numbers',
                    graphid: '08359c2e-53f0-11e9-b212-dca90488358a',
                    nodegroupid: '3c79d87a-53f2-11e9-a14e-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-hashtag'
                }
            ];

            Workflow.apply(this, [params]);

            this.next = function(){
                var previousStep;
                var activeStep = self.activeStep();
                if (activeStep && activeStep.complete() && activeStep._index < self.steps.length - 1) {
                    this.updateUrl(activeStep, 'forward')
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
