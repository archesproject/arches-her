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
                    title: 'Site Visit Details - Visit Date',
                    name: 'sitevisitdetailsdate',
                    description: '',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '0a06b0ee-6c46-11e9-abff-dca90488358a',
                    nodegroupid: '9809201e-6c46-11e9-a918-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-tag',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]'
                },
                {
                    title: 'Site Visit Details - Related Consultation',
                    name: 'sitevisitdetailsrelatedconsultation',
                    description: '',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '0a06b0ee-6c46-11e9-abff-dca90488358a',
                    nodegroupid: 'c56a5233-6d28-11e9-aa0d-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-tag',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]'
                },
                {
                    title: 'Site Visit Details - Address',
                    name: 'sitevisitdetailsaddress',
                    description: '',
                    component: 'views/components/workflows/get-tile-value',
                    componentname: 'get-tile-value',
                    graphid: '0a06b0ee-6c46-11e9-abff-dca90488358a',
                    nodegroupid: '18ae6b57-6c48-11e9-83c1-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-tag',
                    nameheading: 'Visit Name',
                    namelabel: 'Make the Visit Name the same as the Site Address'
                },
                {
                    title: 'Site Visit Details - Name',
                    name: 'sitevisitdetailsname',
                    description: '',
                    component: 'views/components/workflows/set-tile-value',
                    componentname: 'set-tile-value',
                    graphid: '0a06b0ee-6c46-11e9-abff-dca90488358a',
                    nodegroupid: '7a97945c-6c46-11e9-ae4b-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-tag',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]'
                },
                {
                    title: 'Site Location',
                    name: 'sitelocation',
                    description: '',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '0a06b0ee-6c46-11e9-abff-dca90488358a',
                    nodegroupid: '571dba97-6c47-11e9-8bed-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-map-marker',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]'
                },
                {
                    title: 'Site Visit Attendees',
                    name: 'siteattendees',
                    description: '',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '0a06b0ee-6c46-11e9-abff-dca90488358a',
                    nodegroupid: 'f57ec302-6c46-11e9-93b3-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-user-plus',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]'
                },
                {
                    title: 'Site Visit Observations',
                    name: 'siteobservations',
                    description: '',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '0a06b0ee-6c46-11e9-abff-dca90488358a',
                    nodegroupid: 'b21ef6c0-6c46-11e9-9205-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-lightbulb-o',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]'
                },
                {
                    title: 'Recommendations',
                    name: 'siterecommendations',
                    description: '',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '0a06b0ee-6c46-11e9-abff-dca90488358a',
                    nodegroupid: 'cb717640-6c46-11e9-9b10-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-clipboard',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]'
                },
                // {
                //     title: 'Site Photos',
                //     name: 'sitephotos',
                //     description: '',
                //     component: 'views/components/workflows/new-tile-step',
                //     componentname: 'new-tile-step',
                //     graphid: '0a06b0ee-6c46-11e9-abff-dca90488358a',
                //     nodegroupid: '4451d38f-6c47-11e9-83e0-dca90488358a',
                //     resourceid: null,
                //     tileid: null,
                //     parenttileid: null,
                //     icon: 'fa-camera',
                //     nameheading: 'New Site Visit',
                //     namelabel: '[no label]'
                // },
                {
                    title: 'Site Photos (Upload)',
                    name: 'sitephotosupload',
                    description: '',
                    component: 'views/components/workflows/set-tile-value',
                    componentname: 'set-tile-value',
                    graphid: '0a06b0ee-6c46-11e9-abff-dca90488358a',
                    nodegroupid: '4451d38f-6c47-11e9-83e0-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-camera',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]'
                },
                {
                    title: 'Site Photos (Gallery)',
                    name: 'sitephotosgallery',
                    description: '',
                    component: 'views/components/workflows/get-tile-value',
                    componentname: 'get-tile-value',
                    graphid: '0a06b0ee-6c46-11e9-abff-dca90488358a',
                    nodegroupid: '4451d38f-6c47-11e9-83e0-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-camera',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]'
                },
                {
                    title: 'Site Visit Workflow Complete',
                    name: 'sitevisitcomplete',
                    description: '',
                    component: 'views/components/workflows/final-step',
                    componentname: 'final-step',
                    graphid: '0a06b0ee-6c46-11e9-abff-dca90488358a',
                    nodegroupid: '',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-check',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]'
                },

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
                // if (ko.unwrap(activeStep.name) === 'assignaddress') {
                //     activeStep.requirements = self.state.steps.assignaddress;
                // }
                // if (ko.unwrap(activeStep.name) === 'setname') {
                //     if (self.state.steps['assignaddress']) {
                //         var tiledata = self.state.steps['assignaddress'].tile
                //         var tilevals = _.map(tiledata, function(v, k) {return v})
                //         var nodeval = tilevals[0] + "," + tilevals[1] + " " + tilevals[2];
                //         activeStep.requirements = self.state.steps.setname || {};
                //         // activeStep.requirements.applyOutputToTarget = self.state.steps['assignaddress'].applyOutputToTarget;
                //         // activeStep.requirements.targetnode = '1b95fb70-53ef-11e9-9001-dca90488358a';
                //         activeStep.requirements.targetnodegroup = ko.unwrap(activeStep.nodegroupid);
                //         activeStep.requirements.value = nodeval;
                //     }
                // }
                self.previousStep(val);
            }

            self.activeStep.subscribe(this.updateState);



            self.ready(true);
        },
        template: { require: 'text!templates/views/components/plugins/site-visit.htm' }
    });
});
