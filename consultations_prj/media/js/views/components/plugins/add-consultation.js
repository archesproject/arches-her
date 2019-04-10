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
                {title: 'Step 1', description: 'A description here', component: 'new-tile-step'},
                {title: 'Step 2', description: 'A very long and verboser description here that explains many different things about the workflow step'},
                {title: 'Step 3'},
                {title: 'Step 4', description: 'Another description here'}
            ];
            
            Workflow.apply(this, [params]);
            
            fetch('/cards/042fdc54-fa30-11e6-9e3e-026d961c88e6', {
                method: 'GET'
            }).then(function(response){
                if(response.status == 200){
                    return response.json();
                }
            }).then(function(response){
                console.log(response);
                self.ready(true);
            });
        },
        template: { require: 'text!templates/views/components/plugins/add-consultation.htm' }
    });
});
