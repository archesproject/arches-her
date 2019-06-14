define([
    'knockout',
    'viewmodels/workflow',
    'viewmodels/workflow-step',
    'views/components/workflows/new-tile-step',
    'views/components/workflows/set-tile-value',
    'views/components/workflows/get-tile-value'
], function(ko, Workflow, Step) {
    return ko.components.register('site-visit', {
        viewModel: function(params) {
            var self = this;
            params.steps = [
                {
                    title: 'Site Visit Details',
                    name: 'sitevisitdetails',
                    description: '',
                    component: 'views/components/workflows/new-tile-value',
                    componentname: 'new-tile-value',
                    graphid: '0a06b0ee-6c46-11e9-abff-dca90488358a',
                    nodegroupid: '18ae6b57-6c48-11e9-83c1-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-tag',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]'
                },
                // {
                //     title: 'Assign Name',
                //     name: 'setname',
                //     description: 'Assign a name to your application area',
                //     component: 'views/components/workflows/set-tile-value',
                //     componentname: 'set-tile-value',
                //     graphid: '336d34e3-53c3-11e9-ba5f-dca90488358a',
                //     nodegroupid: 'c5f909b5-53c7-11e9-a3ac-dca90488358a',
                //     resourceid: null,
                //     tileid: null,
                //     parenttileid: null,
                //     icon: 'fa-tag'
                // },
                // {
                //     title: 'Area Map',
                //     description: 'Draw (or select from the Development Area Overlay) the extent of...',
                //     component: 'views/components/workflows/new-tile-step',
                //     componentname: 'new-tile-step',
                //     graphid: '336d34e3-53c3-11e9-ba5f-dca90488358a',
                //     nodegroupid: 'eafced66-53d8-11e9-a4e2-dca90488358a',
                //     resourceid: null,
                //     tileid: null,
                //     parenttileid: null,
                //     icon: 'fa-map-marker'
                // },
                // {
                //     title: 'Area Description',
                //     description: 'Describe the Application Area',
                //     component: 'views/components/workflows/new-tile-step',
                //     componentname: 'new-tile-step',
                //     graphid: '336d34e3-53c3-11e9-ba5f-dca90488358a',
                //     nodegroupid: '63cdcf0f-53da-11e9-8340-dca90488358a',
                //     resourceid: null,
                //     tileid: null,
                //     parenttileid: null,
                //     icon: 'fa-clipboard'
                // },
                // {
                //     title: 'Area Designations',
                //     description: 'Select the Application Area designations',
                //     component: 'views/components/workflows/new-tile-step',
                //     componentname: 'new-tile-step',
                //     graphid: '336d34e3-53c3-11e9-ba5f-dca90488358a',
                //     nodegroupid: 'e19fe3a1-6d22-11e9-98bf-dca90488358a',
                //     resourceid: null,
                //     tileid: null,
                //     parenttileid: null,
                //     icon: 'fa-bookmark'
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
                        activeStep.requirements.targetnode = '1b95fb70-53ef-11e9-9001-dca90488358a';
                        activeStep.requirements.targetnodegroup = ko.unwrap(activeStep.nodegroupid);
                        activeStep.requirements.value = nodeval;
                    }
                }
                self.previousStep(val);
            }

            self.activeStep.subscribe(this.updateState);



            self.ready(true);
        },
        template: { require: 'text!templates/views/components/plugins/application-area.htm' }
    });
});
