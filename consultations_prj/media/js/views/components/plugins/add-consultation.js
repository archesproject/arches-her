define([
    'knockout',
    'viewmodels/workflow',
    'viewmodels/workflow-step'
], function(ko, Workflow, Step) {
    return ko.components.register('add-consultation', {
        viewModel: function(params) {

            var self = this;

            params.steps = [
                {
                    title: 'Assign Address',
                    name: 'assignaddress',
                    description: 'Assign an address to your application area. Use the address as the default name',
                    component: 'views/components/workflows/get-tile-value',
                    componentname: 'get-tile-value',
                    graphid: '336d34e3-53c3-11e9-ba5f-dca90488358a',
                    nodegroupid: 'e857704a-53d8-11e9-b05a-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-envelope'
                },
                {
                    title: 'Assign Name',
                    name: 'setname',
                    description: 'Assign a name to your application area',
                    component: 'views/components/workflows/set-tile-value',
                    componentname: 'set-tile-value',
                    graphid: '336d34e3-53c3-11e9-ba5f-dca90488358a',
                    nodegroupid: 'c5f909b5-53c7-11e9-a3ac-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-tag'
                },
                {
                    title: 'Step 3',
                    description: 'Another description here',
                }
            ];

            Workflow.apply(this, [params]);

            this.updateState = function(val) {
                var activeStep = val;
                var previousStep = self.previousStep();
                if (previousStep) {
                    self.state.steps[ko.unwrap(previousStep.name)] = previousStep.stateProperties();
                    self.state.activestep = val._index;
                    self.state.previousstep = previousStep._index;
                    self.updateUrl();
                }
                if (ko.unwrap(activeStep.name) === 'assignaddress') {
                    activeStep.requirements = self.state.steps.assignaddress;
                }
                if (ko.unwrap(activeStep.name) === 'setname') {
                    if (self.state.steps['assignaddress']) {
                        var tiledata = self.state.steps['assignaddress'].tile
                        var tilevals = _.map(tiledata, function(v, k) {return v})
                        var nodeval = tilevals[0] + "," + tilevals[1] + " " + tilevals[2];
                        activeStep.requirements = self.state.steps.setname || {};
                        activeStep.requirements.applyOutputToTarget = self.state.steps['assignaddress'].applyOutputToTarget;
                        activeStep.requirements.targetnode = '1b95fb70-53ef-11e9-9001-dca90488358a';
                        activeStep.requirements.targetnodegroup = 'c5f909b5-53c7-11e9-a3ac-dca90488358a';
                        activeStep.requirements.value = nodeval;
                    }
                }
                self.previousStep(val);
            }

            self.activeStep.subscribe(this.updateState);

            self.ready(true);
        },
        template: { require: 'text!templates/views/components/plugins/add-consultation.htm' }
    });
});
