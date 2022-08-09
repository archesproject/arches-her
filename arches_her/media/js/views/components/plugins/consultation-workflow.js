define([
    'knockout',
    'jquery',
    'arches',
    'viewmodels/workflow',
    'templates/views/components/plugins/consultation-workflow.htm',
    'viewmodels/workflow-step',
    'views/components/workflows/consultation/consultation-dates-step',
    'views/components/workflows/consultation/consultation-map-step',
    'views/components/workflows/consultation/consultations-final-step'
], function(ko, $, arches, Workflow, consultationWorkflowTemplate) {
    return ko.components.register('consultation-workflow', {
        viewModel: function(params) {

            this.componentName = 'consultation-workflow';
            this.stepConfig = [
                {
                    title: 'Consultation Location',
                    name: 'consultation-location',
                    informationboxdata: {
                        heading: 'Consultation GeoJSON',
                        text: 'Set geospatial data for this consultation',
                    },
                    required: true,
                    workflowstepclass: 'consultation-map-step',
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'consultation-map-step',
                                    uniqueInstanceName: 'consultation-map-step', /* unique to step */
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
                    layoutSections: [
                        {
                            componentConfigs: [
                                {
                                    componentName: 'consultation-dates-step',
                                    uniqueInstanceName: 'consultation-dates-step',
                                    tilesManaged: 'one',
                                    parameters: {
                                        graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                                        nodegroupid: '40eff4c9-893a-11ea-ac3a-f875a44e0e11',
                                        resourceid: "['consultation-location']['consultation-map-step'][0]['resourceid']",
                                        hiddenNodes: "[40eff4ce-893a-11ea-ae2e-f875a44e0e11]",
                                    },
                                }
                            ]
                        }
                    ],
                    required: true
                },
                {
                    title: 'Consultation Details/Type',
                    name: 'set-cons-details',
                    informationboxdata: {
                        heading: 'Consultation Details',
                        text: 'Select the type of consultation',
                    },
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
                                        nodegroupid: '771bb1e2-8895-11ea-8446-f875a44e0e11',  //consultation type node
                                        resourceid: "['consultation-location']['consultation-map-step'][0]['resourceid']",
                                    },
                                },
                            ], 
                        },
                    ],
                },
                {
                    title: 'Reference Numbers',
                    name: 'set-ref-numbers',
                    informationboxdata: {
                        heading: 'Application Reference Numbers',
                        text: 'Save one or more reference numbers before moving to the next step',
                    },
                    required: false,
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
                                        resourceid: "['consultation-location']['consultation-map-step'][0]['resourceid']",
                                    },
                                },
                            ], 
                        },
                    ],
                },
                {
                    title: 'Application Proposal',
                    name: 'application-proposal',
                    informationboxdata: {
                        heading: 'Application Proposal',
                        text: 'Summary of the application that will be reviewed under this consultation',
                    },
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
                                        resourceid: "['consultation-location']['consultation-map-step'][0]['resourceid']",
                                    },
                                },
                            ], 
                        },
                    ],
                },
                {
                    title: 'Contacts',
                    name: 'consultation-contacts',
                    informationboxdata: {
                        heading: 'Contacts',
                        text: 'Identify the key people/organizations associated with this consultation',
                    },
                    required: false,
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'default-card',
                                    uniqueInstanceName: 'app-contacts', /* unique to step */
                                    tilesManaged: 'one',
                                    parameters: {
                                        graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                                        nodegroupid: '4ea4a189-184f-11eb-b45e-f875a44e0e11',
                                        resourceid: "['consultation-location']['consultation-map-step'][0]['resourceid']",
                                    },
                                },
                            ], 
                        },
                    ],
                },
                {
                    title: 'Add Consulation Complete',
                    name: 'consultation-complete',
                    description: 'Choose an option below',
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'consultations-final-step',
                                    uniqueInstanceName: 'consultation-final', /* unique to step */
                                    tilesManaged: 'none',
                                    parameters: {
                                        resourceid: "['consultation-location']['consultation-map-step'][0]['resourceid']",
                                    },
                                },
                            ], 
                        },
                    ],
                    informationboxdata: {
                        heading: 'Workflow Complete: Review your work',
                        text: 'Please review the summary information. You can go back to a previous step to make changes or "Quit Workflow" to discard your changes and start over',
                    }
                },
            ];

            Workflow.apply(this, [params]);
            this.quitUrl = arches.urls.plugin('init-workflow');
        },
        template: consultationWorkflowTemplate
    });
});
