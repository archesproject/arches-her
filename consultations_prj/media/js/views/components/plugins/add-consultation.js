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
                    graphid: '08359c2e-53f0-11e9-b212-dca90488358a',
                    nodegroupid: '9dc86b0c-6c48-11e9-8cbe-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-envelope',
                    nameheading: 'Consultation Name',
                    namelabel: 'Make the Consultation Name the same as the Consultation Address'
                },
                {
                    title: 'Assign Name',
                    name: 'setname',
                    description: 'Assign a name to your application area',
                    component: 'views/components/workflows/set-tile-value',
                    componentname: 'set-tile-value',
                    graphid: '08359c2e-53f0-11e9-b212-dca90488358a',
                    nodegroupid: 'e6f0688a-53f1-11e9-93a2-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-tag'
                },
                {
                    title: 'Related Heritage Resources',
                    description: 'Click on the Heritage Assets, Activities, and other resources related to this',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '08359c2e-53f0-11e9-b212-dca90488358a',
                    nodegroupid: '2c82277d-53db-11e9-934b-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-code-fork'
                },
                {
                    title: 'Application Details',
                    description: 'Summary of the Application and Consultation Type',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
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
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
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
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '08359c2e-53f0-11e9-b212-dca90488358a',
                    nodegroupid: 'f34ebbd4-53f3-11e9-b649-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-clipboard'
                },
                {
                    title: 'Contacts',
                    description: 'Identify the key people/organizations associated with this consultation',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
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
                        activeStep.requirements.targetnode = 'e6f0688a-53f1-11e9-93a2-dca90488358a';
                        activeStep.requirements.targetnodegroup = ko.unwrap(activeStep.nodegroupid);
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
