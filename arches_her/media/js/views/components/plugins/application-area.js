define([
    'knockout',
    'arches',
    'viewmodels/workflow',
    'viewmodels/workflow-step',
    'views/components/workflows/new-tile-step',
    'views/components/workflows/app-area-name-step'
], function(ko, arches, Workflow, Step) {
    return ko.components.register('application-area', {
        viewModel: function(params) {
            var self = this;
            this.resourceId = ko.observable();

            params.steps = [
                {
                    title: 'Assign Address',
                    name: 'assign-address',
                    description: 'Assign an address to your application area. Use the address as the default name',
                    component: 'views/components/workflows/app-area-address-step',
                    componentname: 'app-area-address-step',
                    graphid: '42ce82f6-83bf-11ea-b1e8-f875a44e0e11',
                    nodegroupid: 'c7ec6efa-28c8-11eb-9ed1-f875a44e0e11',
                    targetnodegroup: '9c9f9dbb-83bf-11ea-bca7-f875a44e0e11',
                    targetnode: '9c9f9dc0-83bf-11ea-8d22-f875a44e0e11',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: true,
                    icon: 'fa-envelope',
                    nameheading: 'Application Area Name',
                    namelabel: 'Make the Area Name the same as the Area Address',
                    shouldtrackresource: true,
                    informationboxdata: {
                        heading: 'Assign Address',
                        text: 'Assign an address to your application area. Use the address as the default name',
                    },
                    wastebin: {resourceid: null, description: 'an application area instance'}
                },
                {
                    title: 'Assign Name',
                    name: 'assign-name',
                    description: 'Assign an address to your application area. Use the address as the default name',
                    component: 'views/components/workflows/app-area-name-step',
                    componentname: 'app-area-name-step',
                    graphid: '42ce82f6-83bf-11ea-b1e8-f875a44e0e11',
                    nodegroupid: '9c9f9dbb-83bf-11ea-bca7-f875a44e0e11',
                    targetnode: '9c9f9dc0-83bf-11ea-8d22-f875a44e0e11',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: true,
                    icon: 'fa-map',
                    informationboxdata: {
                        heading: 'Assign Name',
                        text: 'Assign an address to your application area. Use the address as the default name',
                    }
                },
                {
                    title: 'Area Map',
                    name: 'area-map',
                    description: 'Draw (or select from the Development Area Overlay) the extent of...',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '42ce82f6-83bf-11ea-b1e8-f875a44e0e11',
                    nodegroupid: '19096dc5-3a3b-11eb-b4cf-f875a44e0e11',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: true,
                    icon: 'fa-map-marker',
                    informationboxdata: {
                        heading: 'Area Map',
                        text: 'Draw (or select from the Development Area Overlay) the extent of...',
                    }
                },
                {
                    title: 'Related Heritage Resources',
                    name: 'related-heritage-resource',
                    description: 'Select the other Heritage Sites or Artifacts related to the current Consulation',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '42ce82f6-83bf-11ea-b1e8-f875a44e0e11',
                    nodegroupid: 'a93c73b4-83d4-11ea-80e6-f875a44e0e11',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: false,
                    icon: 'fa-bank',
                    informationboxdata: {
                        heading: 'Related Heritage Resources',
                        text: 'Select the other Heritage Sites or Artifacts related to the current Consulation',
                    }
                },
                {
                    title: 'Area Description',
                    name: 'area-description',
                    description: 'Describe the Application Area',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '42ce82f6-83bf-11ea-b1e8-f875a44e0e11',
                    nodegroupid: '7a76715d-94fd-11ea-8481-f875a44e0e11',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: false,
                    icon: 'fa-clipboard',
                    informationboxdata: {
                        heading: 'Area Description',
                        text: 'Describe the Application Area',
                    }
                },
                {
                    title: 'Area Designations',
                    name: 'area-designations',
                    description: 'Select the Application Area designations',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '42ce82f6-83bf-11ea-b1e8-f875a44e0e11',
                    nodegroupid: '5c970269-8eca-11ea-8f53-f875a44e0e11',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: false,
                    icon: 'fa-bookmark',
                    informationboxdata: {
                        heading: 'Area Designations',
                        text: 'Select the Application Area designations',
                    }
                },
                {
                    title: 'Application Area Complete',
                    name: 'application-area-complete',
                    description: 'Choose an option below',
                    component: 'views/components/workflows/consultations-final-step',
                    componentname: 'consultations-final-step',
                    graphid: '42ce82f6-83bf-11ea-b1e8-f875a44e0e11',
                    icon: 'fa-check',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    informationboxdata: {
                        heading: 'Application Area Complete',
                        text: 'Choose an option below',
                    }
                }
            ];

            Workflow.apply(this, [params]);
            this.quitUrl = "/arches-her" + arches.urls.plugin('init-workflow');
            self.getJSON('application-area');
            
            self.ready(true);
        },
        template: { require: 'text!templates/views/components/plugins/application-area.htm' }
    });
});
