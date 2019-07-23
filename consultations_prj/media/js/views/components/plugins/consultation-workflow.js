define([
    'knockout',
    'viewmodels/workflow',
    'viewmodels/workflow-step'
], function(ko, Workflow, Step) {
    return ko.components.register('consultation-workflow', {
        viewModel: function(params) {

            var self = this;

            params.steps = [
                {
<<<<<<< HEAD
                    title: 'Assign Name',
                    name: 'setname',
                    description: 'Assign a name to your application area',
                    component: 'views/components/workflows/new-tile-value',
                    componentname: 'new-tile-value',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '8d41e4ab-a250-11e9-87d1-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-tag'
=======
                    title: 'Assign Address',
                    name: 'assignaddress',
                    description: 'Assign an address to your application area. Use the address as the default name',
                    component: 'views/components/workflows/get-tile-value',
                    componentname: 'get-tile-value',
                    graphid: '08359c2e-53f0-11e9-b212-dca90488358a',
                    nodegroupid: '9dc86b0c-6c48-11e9-8cbe-dca90488358a',
                    nodegroups: ['9dc86b0c-6c48-11e9-8cbe-dca90488358a', 'e6f0688a-53f1-11e9-93a2-dca90488358a'],
                    resourceid: null,
                    tileid: null,
                    tileids: [],
                    parenttileid: null,
                    icon: 'fa-envelope',
                    nameheading: 'Consultation Name',
                    namelabel: 'Make the Consultation Name the same as the Consultation Address',
                    targetnode: 'e6f0688a-53f1-11e9-93a2-dca90488358a',
                    targetnodegroup: 'e6f0688a-53f1-11e9-93a2-dca90488358a',
                    class: 'hide-address-name'
>>>>>>> master
                },
                {
                    title: 'Related Application Area',
                    name: 'setrelatedapplicationarea',
                    description: 'Identify the Development Area for this Consultation',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '8d41e4ba-a250-11e9-9b20-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-code-fork'
                },
                {
                    title: 'Consultation GeoJSON',
                    name: 'consultationlocation',
                    description: 'Set geospatial data for this consultation',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '8d41e4c6-a250-11e9-a54d-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-map-marker'
                },
                {
                    title: 'Consultation Conditions',
                    name: 'settypedetails',
                    description: 'Consultation Conditions',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '8d41e49f-a250-11e9-b6b3-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-list-alt'
                },
                {
                    title: 'Consultation Dates',
                    name: 'setdatedetails',
                    description: 'Consultation Dates',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '8d41e4a5-a250-11e9-840c-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-list-alt'
                },
                {
                    title: 'Reference Numbers',
                    name: 'setrefnumbers',
                    description: 'Application Reference Numbers',
                    component: 'views/components/workflows/new-multi-tile-step',
                    componentname: 'new-multi-tile-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '8d41e4a2-a250-11e9-82f1-00224800b26d',
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
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '8d41e4bd-a250-11e9-89e8-00224800b26d',
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
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '8d41e4a8-a250-11e9-aff0-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-users'
                },
                {
                    title: 'Add Consulation Complete',
                    description: 'Choose an option below',
                    component: 'views/components/workflows/final-step',
                    componentname: 'final-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    icon: 'fa-check',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null
                }
            ];

            Workflow.apply(this, [params]);

            this.updateState = function(val) {
                var activeStep = val;
                var previousStep = self.previousStep();
                var resourceId;
                if (previousStep) {
                    self.state.steps[previousStep._index] = previousStep.stateProperties();
                    self.state.steps[previousStep._index].complete = ko.unwrap(previousStep.complete);
                    self.state.activestep = val._index;
                    self.state.previousstep = previousStep._index;
                    if (!resourceId) {
                        resourceId = !!previousStep.resourceid ? ko.unwrap(previousStep.resourceid) : null;
                        self.state.resourceid = resourceId;
                        activeStep.requirements.resourceid = self.state.resourceid;
                    }
                    self.updateUrl();
                } else {
                    activeStep.requirements = self.state.steps[activeStep._index] || {};
                    activeStep.requirements.resourceid = self.state.resourceid;
                }
                self.previousStep(activeStep);
            }

            self.activeStep.subscribe(this.updateState);

            self.ready(true);
        },
        template: { require: 'text!templates/views/components/plugins/consultation-workflow.htm' }
    });
});
