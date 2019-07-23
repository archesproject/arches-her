define([
    'knockout',
    'viewmodels/workflow',
    'viewmodels/workflow-step',
    'views/components/workflows/new-tile-step',
    'views/components/workflows/set-tile-value',
    'views/components/workflows/get-tile-value'
], function(ko, Workflow, Step) {
    return ko.components.register('application-area', {
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
                    nodegroupid: '5fea7890-9cbb-11e9-ae86-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-envelope',
                    nameheading: 'Application Area Name',
                    namelabel: 'Make the Area Name the same as the Area Address'
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
                    title: 'Area Map',
                    description: 'Draw (or select from the Development Area Overlay) the extent of...',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '336d34e3-53c3-11e9-ba5f-dca90488358a',
                    nodegroupid: 'eafced66-53d8-11e9-a4e2-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-map-marker'
                },
                {
                    title: 'Related Heritage Resources',
                    description: '',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '336d34e3-53c3-11e9-ba5f-dca90488358a',
                    nodegroupid: 'ad364dc1-9cbd-11e9-acd9-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-map-marker'
                },
                {
                    title: 'Area Description',
                    description: 'Describe the Application Area',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '336d34e3-53c3-11e9-ba5f-dca90488358a',
                    nodegroupid: '9f187b71-9cbb-11e9-9fd3-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-clipboard'
                },
                {
                    title: 'Area Designations',
                    description: 'Select the Application Area designations',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '336d34e3-53c3-11e9-ba5f-dca90488358a',
                    nodegroupid: 'e19fe3a1-6d22-11e9-98bf-dca90488358a',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-bookmark'
                },
                {
                    title: 'Application Area Complete',
                    description: 'Choose an option below',
                    component: 'views/components/workflows/final-step',
                    componentname: 'final-step',
                    graphid: '336d34e3-53c3-11e9-ba5f-dca90488358a',
                    icon: 'fa-check',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null
                }
            ];

            Workflow.apply(this, [params]);

            self.activeStep.subscribe(this.updateState);

            self.ready(true);
        },
        template: { require: 'text!templates/views/components/plugins/application-area.htm' }
    });
});
