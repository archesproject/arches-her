define([
    'knockout',
    'arches',
    'viewmodels/workflow',
    'templates/views/components/plugins/site-visit.htm',
    'viewmodels/workflow-step',
    'views/components/workflows/select-resource-step',
    'views/components/workflows/photo-gallery-step',
    'views/components/workflows/site-visit/site-visit-final-step'
], function(ko, arches, Workflow, siteVisitTemplate) {
    return ko.components.register('site-visit', {
        viewModel: function(params) {
            this.componentName = 'site-visit';

            this.stepConfig = [
                {
                    title: 'Site Visit Details',
                    name: 'site-visit-details',
                    required: true,
                    informationboxdata: {
                        heading: 'Site Visit Details',
                        text: 'Select a consultation and enter datails for the site visit',
                    },
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'select-resource-step',
                                    uniqueInstanceName: 'site-visit-details', /* unique to step */
                                    tilesManaged: 'one',
                                    parameters: {
                                        graphid: '8d41e49e-a250-11e9-9eab-00224800b26d', //consultation graph
                                        nodegroupid: '066cb8f0-a251-11e9-85d5-00224800b26d', //Visit Date & desc
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    title: 'Site Visit Attendees',
                    name: 'site-visit-attendees',
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'default-card',
                                    uniqueInstanceName: 'site-visit-attendees', /* unique to step */
                                    tilesManaged: 'many',
                                    parameters: {
                                        graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                                        nodegroupid: 'ab622f1f-a251-11e9-bda5-00224800b26d',
                                        resourceid: "['site-visit-details']['site-visit-details']['resourceInstanceId']",
                                        parenttileid: "['site-visit-details']['site-visit-details']['tileId']"
                                    },
                                },
                            ], 
                        },
                    ],
                    informationboxdata: {
                        heading: 'Site Visit Attendees',
                        text: 'Add all attendees and click save and continue when done',
                    },
                },
                {
                    title: 'Site Visit Observations',
                    name: 'site-visit-observations',
                    required: false,
                    informationboxdata: {
                        heading: 'Site Visit Observations',
                        text: 'Add the observations during the site visit',
                    },
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'default-card',
                                    uniqueInstanceName: 'site-visit-observations', /* unique to step */
                                    tilesManaged: 'one',
                                    parameters: {
                                        graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                                        nodegroupid: 'a2b47f25-938d-11ea-82cb-f875a44e0e11',
                                        resourceid: "['site-visit-details']['site-visit-details']['resourceInstanceId']",
                                        parenttileid: "['site-visit-details']['site-visit-details']['tileId']"
                                    },
                                },
                            ], 
                        },
                    ],
                },
                {
                    title: 'Recommendations',
                    name: 'site-recommendations',
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'default-card',
                                    uniqueInstanceName: 'site-recommendations', /* unique to step */
                                    tilesManaged: 'one',
                                    parameters: {
                                        graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                                        nodegroupid: 'f5ecfbca-938b-11ea-865d-f875a44e0e11',
                                        resourceid: "['site-visit-details']['site-visit-details']['resourceInstanceId']",
                                        parenttileid: "['site-visit-details']['site-visit-details']['tileId']"
                                    },
                                },
                            ], 
                        },
                    ],
                    required: false,
                    informationboxdata: {
                        heading: 'Recommendations',
                        text: 'Add recommendations from the site visit',
                    }
                },
                {
                    title: 'Site Photos (Upload)',
                    name: 'site-photos-upload',
                    required: false,
                    workflowstepclass: 'consultation-map-step',
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'photo-gallery-step',
                                    uniqueInstanceName: 'site-photos-upload', /* unique to step */
                                    tilesManaged: 'one',
                                    parameters: {
                                        graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                                        nodegroupid: '3a79a0dd-4535-11eb-b88f-f875a44e0e11',
                                        resourceid: "['site-visit-details']['site-visit-details']['resourceInstanceId']",
                                        parenttileid: "['site-visit-details']['site-visit-details']['tileId']"
                                    },
                                },
                            ], 
                        },
                    ],
                    informationboxdata: {
                        heading: 'Upload Site Photos',
                        text: 'Upload photographs from the visit by dragging and dropping or clicking the button',
                    }
                },
                {
                    title: 'Site Visit Workflow Complete',
                    name: 'site-visit-complete',
                    informationboxdata: {
                        heading: 'Workflow Complete: Review your work',
                        text: 'Please review the summary information. You can go back to a previous step to make changes or "Quit Workflow" to discard your changes and start over',
                    },
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'site-visit-final-step',
                                    uniqueInstanceName: 'site-visit-final', /* unique to step */
                                    tilesManaged: 'none',
                                    parameters: {
                                        graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                                        resourceid: "['site-visit-details']['site-visit-details']['resourceInstanceId']",
                                        parenttileid: "['site-visit-details']['site-visit-details']['tileId']"
                                    },
                                },
                            ], 
                        },
                    ],
                }

            ];

            Workflow.apply(this, [params]);
            this.quitUrl = arches.urls.plugin('init-workflow');
        },
        template: siteVisitTemplate
    });
});
