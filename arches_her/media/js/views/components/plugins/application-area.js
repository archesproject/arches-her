define([
    'knockout',
    'arches',
    'viewmodels/workflow',
    'views/components/workflows/new-tile-step',
    'views/components/workflows/application-area/app-area-address-step',
    'views/components/workflows/application-area/app-area-final-step'
], function(ko, arches, Workflow) {
    return ko.components.register('application-area', {
        viewModel: function(params) {
            this.componentName = 'application-area';
            this.stepConfig = [
                {
                    title: 'Assign Address',
                    name: 'assign-address',
                    required: true,
                    nameheading: 'Application Area Name',
                    namelabel: 'Make the Area Name the same as the Area Address',
                    informationboxdata: {
                        heading: 'Assign an address',
                        text: 'Assign an address to your application area. Use the address as the default name',
                    },
                    layoutSections: [
                        {
                            sectionTitle: null,
                            componentConfigs: [
                                { 
                                    componentName: 'app-area-address-step',
                                    uniqueInstanceName: 'app-area-address', /* unique to step */
                                    graphid: '42ce82f6-83bf-11ea-b1e8-f875a44e0e11',
                                    nodegroupid: 'c7ec6efa-28c8-11eb-9ed1-f875a44e0e11',
                                    parameters: {
                                        renderContext: 'workflow',
                                    },
                                },
                            ], 
                        },
                    ],
                },
                {
                    title: 'Area Map',
                    name: 'area-map',
                    description: 'Draw (or select from the Development Area Overlay) the extent of...',
                    required: true,
                    workflowstepclass: 'consultation-map-step',
                    informationboxdata: {
                        heading: 'Application Area Map',
                        text: 'Draw (or select from the development area overlay) the extent of the area',
                    },
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'map-card',
                                    uniqueInstanceName: 'area-map', /* unique to step */
                                    tilesManaged: 'one',
                                    parameters: {
                                        graphid: '42ce82f6-83bf-11ea-b1e8-f875a44e0e11',
                                        nodegroupid: '19096dc5-3a3b-11eb-b4cf-f875a44e0e11',
                                        resourceid: "['assign-address']['app-area-address'][0]['resourceid']",
                                    },
                                },
                            ], 
                        },
                    ],
                },
                {
                    title: 'Related Heritage Resources',
                    name: 'related-heritage-resource',
                    required: false,
                    informationboxdata: {
                        heading: 'Related Heritage Resources',
                        text: 'Select the other heritage sites or artifacts related to the current Consulation',
                    },
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'default-card',
                                    uniqueInstanceName: 'related-heritage-resource', /* unique to step */
                                    tilesManaged: 'one',
                                    parameters: {
                                        graphid: '42ce82f6-83bf-11ea-b1e8-f875a44e0e11',
                                        nodegroupid: 'a93c73b4-83d4-11ea-80e6-f875a44e0e11',
                                        resourceid: "['assign-address']['app-area-address'][0]['resourceid']",
                                    },
                                },
                            ], 
                        },
                    ],
                },
                {
                    title: 'Area Description',
                    name: 'area-description',
                    required: false,
                    informationboxdata: {
                        heading: 'Area Description',
                        text: 'Describe the application area',
                    },
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'default-card',
                                    uniqueInstanceName: 'related-heritage-resource', /* unique to step */
                                    tilesManaged: 'one',
                                    parameters: {
                                        graphid: '42ce82f6-83bf-11ea-b1e8-f875a44e0e11',
                                        nodegroupid: '7a76715d-94fd-11ea-8481-f875a44e0e11',
                                        resourceid: "['assign-address']['app-area-address'][0]['resourceid']",
                                    },
                                },
                            ], 
                        },
                    ],
                },
                {
                    title: 'Area Designations',
                    name: 'area-designations',
                    required: false,
                    workflowstepclass: 'consultation-map-step',
                    informationboxdata: {
                        heading: 'Area Designations',
                        text: 'Select the application Area designations',
                    },
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'default-card',
                                    uniqueInstanceName: 'related-heritage-resource', /* unique to step */
                                    tilesManaged: 'many',
                                    parameters: {
                                        graphid: '42ce82f6-83bf-11ea-b1e8-f875a44e0e11',
                                        nodegroupid: '48f51523-efde-11eb-8285-a87eeabdefba',
                                        resourceid: "['assign-address']['app-area-address'][0]['resourceid']",
                                    },
                                },
                            ], 
                        },
                    ],
                },
                {
                    title: 'Application Area Complete',
                    name: 'application-area-complete',
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'app-area-final-step',
                                    uniqueInstanceName: 'app-area-final', /* unique to step */
                                    tilesManaged: 'none',
                                    parameters: {
                                        resourceid: "['assign-address']['app-area-address'][0]['resourceid']",
                                        graphid: '42ce82f6-83bf-11ea-b1e8-f875a44e0e11',
                                    },
                                },
                            ], 
                        },
                    ],
                    informationboxdata: {
                        heading: 'Workflow Complete: Review your work',
                        text: 'Please review the summary information. You can go back to a previous step to make changes or "Quit Workflow" to discard your changes and start over',
                    }
                }
            ];

            Workflow.apply(this, [params]);
            this.quitUrl = arches.urls.plugin('init-workflow');
        },
        template: { require: 'text!templates/views/components/plugins/application-area.htm' }
    });
});
