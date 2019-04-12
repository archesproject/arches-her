define([
    'knockout',
    'viewmodels/workflow',
    'viewmodels/workflow-step',
    'views/components/workflows/new-tile-step'
], function(ko, Workflow, Step) {
    return ko.components.register('add-consultation', {
        viewModel: function(params) {
            var self = this;
            params.steps = [
                {title: 'Step 1', description: 'A description here', component: 'new-tile-step', graphid: '336d34e3-53c3-11e9-ba5f-dca90488358a'},
                {title: 'Step 2', description: 'A very long and verboser description here that explains many different things about the workflow step'},
                {title: 'Step 3'},
                {title: 'Step 4', description: 'Another description here'}
            ];
            
            Workflow.apply(this, [params]);
            
            self.ready(true);
        },
        template: { require: 'text!templates/views/components/plugins/add-consultation.htm' }
    });
});
