define([
    'knockout',
    'arches',
    'viewmodels/workflow',
    'viewmodels/workflow-step',
    'views/components/workflows/new-tile-step',
    'views/components/workflows/select-resource-step',
    'views/components/workflows/site-visit/site-visit-final-step'
], function(ko, arches, Workflow, Step) {
    return ko.components.register('site-visit', {
        viewModel: function(params) {
            /*if (!params.resourceid) {
                params.resourceid = ko.observable();
            }*/
            var self = this;
            this.resourceId = ko.observable()

            params.steps = [
                {
                    title: 'Site Visit Details',
                    name: 'site-visit-details',
                    description: 'Site Visit Details - Related Consultation',
                    component: 'views/components/workflows/select-resource-step',
                    componentname: 'select-resource-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '066cb8f0-a251-11e9-85d5-00224800b26d', //Visit Date & desc
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: true,
                    icon: 'fa-tag',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]',
                    shouldtrackresource: true,
                    informationboxdata: {
                        heading: 'Site Visit Details',
                        text: 'Select a consultation and enter datails for the site visit',
                    },
                    wastebin: {tile: null, description: 'a site visit instance'}
                },
                {
                    title: 'Site Visit Attendees',
                    name: 'site-visit-attendees',
                    description: 'Site Visit Attendees',
                    component: 'views/components/workflows/component-based-step',
                    componentname: 'component-based-step',
                    externalstepdata: { 
                        sitevisitedetailsstep: 'site-visit-details',
                    },
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'default-card',
                                    uniqueInstanceName: 'foo', /* unique to step */
                                    tilesManaged: 'many',
                                    parameters: {
                                        graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                                        nodegroupid: 'ab622f1f-a251-11e9-bda5-00224800b26d',
                                        parenttilesourcestep: 'sitevisitedetailsstep'
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
                    description: '',
                    component: 'views/components/workflows/component-based-step',
                    componentname: 'component-based-step',
                    externalstepdata: { 
                        sitevisitedetailsstep: 'site-visit-details',
                    },
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'default-card',
                                    uniqueInstanceName: 'foo', /* unique to step */
                                    tilesManaged: 'one',
                                    parameters: {
                                        graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                                        nodegroupid: 'a2b47f25-938d-11ea-82cb-f875a44e0e11',
                                        parenttilesourcestep: 'sitevisitedetailsstep'
                                    },
                                },
                            ], 
                        },
                    ],
                    required: false,
                    informationboxdata: {
                        heading: 'Site Visit Observations',
                        text: 'Add the observations during the site visit',
                    }
                },
                {
                    title: 'Recommendations',
                    name: 'site-recommendations',
                    description: '',
                    component: 'views/components/workflows/component-based-step',
                    componentname: 'component-based-step',
                    externalstepdata: { 
                        sitevisitedetailsstep: 'site-visit-details',
                    },
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'default-card',
                                    uniqueInstanceName: 'foo', /* unique to step */
                                    tilesManaged: 'one',
                                    parameters: {
                                        graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                                        nodegroupid: 'f5ecfbca-938b-11ea-865d-f875a44e0e11',
                                        parenttilesourcestep: 'sitevisitedetailsstep'
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
                    description: '',
                    component: 'views/components/workflows/photo-gallery-step',
                    componentname: 'photo-gallery-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '3a79a0dd-4535-11eb-b88f-f875a44e0e11',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: false,
                    externalstepdata: { 
                        sitevisitedetailsstep: 'site-visit-details',
                    },
                    icon: 'fa-camera',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]',
                    createTile: false,
                    autoAdvance: false,
                    informationboxdata: {
                        heading: 'Upload Site Photos',
                        text: 'Upload photographs from the visit by dragging and dropping or clicking the button',
                    }
                },
                {
                    title: 'Site Visit Workflow Complete',
                    name: 'site-visit-complete',
                    description: '',
                    component: 'views/components/workflows/component-based-step',
                    componentname: 'component-based-step',
                    externalstepdata: { 
                        sitevisitedetailsstep: 'site-visit-details',
                    },
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'site-visit-final-step',
                                    uniqueInstanceName: 'site-visit-final', /* unique to step */
                                    tilesManaged: 'none',
                                    parameters: {},
                                },
                            ], 
                        },
                    ],
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-check',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]',
                    informationboxdata: {
                        heading: 'Workflow Complete: Review your work',
                        text: 'Please review the summary information. You can go back to a previous step to make changes or "Quit Workflow" to discard your changes and start over',
                    }
                }

            ];

            Workflow.apply(this, [params]);
            this.quitUrl = "/arches-her" + arches.urls.plugin('init-workflow');
            self.getJSON('site-visit');
            
            self.ready(true);
        },
        template: { require: 'text!templates/views/components/plugins/site-visit.htm' }
    });
});
