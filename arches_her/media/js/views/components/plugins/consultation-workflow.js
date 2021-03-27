define([
    'knockout',
    'jquery',
    'arches',
    'viewmodels/workflow',
    'viewmodels/workflow-step'
], function(ko, $, arches, Workflow) {
    return ko.components.register('consultation-workflow', {
        viewModel: function(params) {

            var self = this;
            this.resourceId = ko.observable();

            params.steps = [
                {
                    title: 'Consultation GeoJSON',
                    name: 'consultation-location',
                    icon: 'fa-map-marker',
                    description: 'Set geospatial data for this consultation',
                    informationboxdata: {
                        heading: 'Consultation GeoJSON',
                        text: 'Set geospatial data for this consultation',
                    },
                    component: 'views/components/workflows/component-based-step',
                    componentname: 'component-based-step',
                    required: true,
                    wastebin: {resourceid: null, description: 'a consultation instance'},
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentPath: 'views/components/workflows/consultation-map-step',  /* necessary for custom components */
                                    componentName: 'consultation-map-step',
                                    uniqueInstanceName: 'app-cons-details', /* unique to step */
                                    tilesManaged: 'one',
                                    parameters: {
                                        graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                                        nodegroupid: '152aa058-936d-11ea-b517-f875a44e0e11',
                                    },
                                },
                            ], 
                        },
                    ],
                },
                {
                    title: 'Consultation Dates',
                    name: 'set-date-details',
                    description: 'Consultation Dates',
                    informationboxdata: {
                        heading: 'Consultation Dates',
                        text: 'The target date is automatically set 21 days from log date',
                    },
                    component: 'views/components/workflows/consultation-dates-step',
                    componentname: 'consultation-dates-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '40eff4c9-893a-11ea-ac3a-f875a44e0e11',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: false,
                    class: 'hide-completion-date',
                    icon: 'fa-calendar-o'
                },
                {
                    title: 'Consultation Details/Type',
                    name: 'set-cons-details',
                    icon: 'fa-list-alt',
                    description: 'Consultation Details',
                    informationboxdata: {
                        heading: 'Consultation Details',
                        text: 'Select the type of consultation',
                    },
                    component: 'views/components/workflows/component-based-step',
                    componentname: 'component-based-step',
                    required: true,
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'grouping-card-component',
                                    uniqueInstanceName: 'app-cons-details', /* unique to step */
                                    tilesManaged: 'one',
                                    parameters: {
                                        graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                                        nodegroupid: '771bb1e2-8895-11ea-8446-f875a44e0e11', //consultation type node
                                    },
                                },
                            ], 
                        },
                    ],
                },
                {
                    title: 'Reference Numbers',
                    name: 'set-ref-numbers',
                    description: 'Application Reference Numbers',
                    informationboxdata: {
                        heading: 'Application Reference Numbers',
                        text: 'Save one or more reference numbers before moving to the next step',
                    },
                    icon: 'fa-hashtag',
                    component: 'views/components/workflows/component-based-step',
                    componentname: 'component-based-step',
                    required: true,
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'default-card',
                                    uniqueInstanceName: 'app-ref-numbers', /* unique to step */
                                    tilesManaged: 'many',
                                    parameters: {
                                        graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                                        nodegroupid: '8d41e4a2-a250-11e9-82f1-00224800b26d',
                                    },
                                },
                            ], 
                        },
                    ],
                },
                {
                    title: 'Application Proposal',
                    name: 'application-proposal',
                    icon: 'fa-clipboard',
                    description: 'Summary of the Application that will be reviewed under this Consultation',
                    informationboxdata: {
                        heading: 'Application Proposal',
                        text: 'Summary of the application that will be reviewed under this consultation',
                    },
                    component: 'views/components/workflows/component-based-step',
                    componentname: 'component-based-step',
                    required: true,
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'default-card',
                                    uniqueInstanceName: 'app-proposal', /* unique to step */
                                    tilesManaged: 'one',
                                    parameters: {
                                        graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                                        nodegroupid: '1b0e15e9-8864-11ea-b5f3-f875a44e0e11',
                                    },
                                },
                            ], 
                        },
                    ],
                },
                {
                    title: 'Contacts',
                    name: 'consultation-contacts',
                    description: 'Identify the key people/organizations associated with this consultation',
                    informationboxdata: {
                        heading: 'Contacts',
                        text: 'Identify the key people/organizations associated with this consultation',
                    },
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '4ea4a189-184f-11eb-b45e-f875a44e0e11',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: false,
                    icon: 'fa-users'
                },
                {
                    title: 'Add Consulation Complete',
                    name: 'consultation-complete',
                    description: 'Choose an option below',
                    component: 'views/components/workflows/consultations-final-step',
                    componentname: 'consultations-final-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '6a773228-db20-11e9-b6dd-784f435179ea', // consultation status
                    icon: 'fa-check',
                    updatestatus: true,
                    resourceid: null,
                    tileid: null,
                    parenttileid: null
                }
            ];

            Workflow.apply(this, [params]);
            this.quitUrl = "/arches-her" + arches.urls.plugin('init-workflow');
            self.getJSON('consultation-workflow');


            self.ready(true);
        },
        template: { require: 'text!templates/views/components/plugins/consultation-workflow.htm' }
    });
});
