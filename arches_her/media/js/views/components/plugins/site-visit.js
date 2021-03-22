define([
    'knockout',
    'arches',
    'viewmodels/workflow',
    'viewmodels/workflow-step',
    'views/components/workflows/new-tile-step',
    'views/components/workflows/select-resource-step'
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
                        heading: '',
                        text: 'Select a Consultation and Enter datails for the Visit',
                    },
                    wastebin: {tile: null, description: 'a site visit instance'}
                },
                {
                    title: 'Site Visit Attendees',
                    name: 'site-visit-attendees',
                    description: 'Site Visit Attendees',
                    component: 'views/components/workflows/component-based-step',
                    componentname: 'component-based-step',
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
                                    },
                                },
                            ], 
                        },
                    ],
                    informationboxdata: {
                        heading: 'Site Visit Attendees',
                        text: 'Add all the Attendees and Click Save and Coninue when done',
                    },
                },
                {
                    title: 'Site Visit Observations',
                    name: 'site-visit-observations',
                    description: '',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: 'a2b47f25-938d-11ea-82cb-f875a44e0e11',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: false,
                    icon: 'fa-lightbulb-o',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]',
                    informationboxdata: {
                        heading: 'Site Visit Observations',
                        text: 'Add the Observations during the Visit',
                    }
                },
                {
                    title: 'Recommendations',
                    name: 'site-recommendations',
                    description: '',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: 'f5ecfbca-938b-11ea-865d-f875a44e0e11',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: true,
                    icon: 'fa-clipboard',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]',
                    informationboxdata: {
                        heading: 'Recommendations',
                        text: 'Add recommendations from the Visit',
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
                    icon: 'fa-camera',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]',
                    createTile: false,
                    autoAdvance: false,
                    informationboxdata: {
                        heading: 'Site Photos',
                        text: 'Upload a Photographs from the Visit by Drag & Drop or Click the button',
                    }
                },
                {
                    title: 'Site Visit Workflow Complete',
                    name: 'site-visit-complete',
                    description: '',
                    component: 'views/components/workflows/consultations-final-step',
                    componentname: 'consultations-final-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-check',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]',
                    informationboxdata: {
                        heading: 'Site Visit Workflow Complete',
                        text: 'Choose an option below',
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
