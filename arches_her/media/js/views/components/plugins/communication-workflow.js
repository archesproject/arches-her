define([
    'knockout',
    'arches',
    'viewmodels/workflow',
    'templates/views/components/plugins/communication-workflow.htm',
    'views/components/workflows/communication-workflow/communication-select-resource',
    'views/components/workflows/communication-workflow/upload-document-step',
    'views/components/workflows/communication-workflow/communication-final-step'
], function(ko, arches, Workflow, communicationWorkflowTemplate) {
    return ko.components.register('communication-workflow', {
        viewModel: function(params) {
            this.componentName = 'communication-workflow';
            this.stepConfig = [
                {
                    title: 'Related Consultation / Details',
                    name: 'related-consultation',
                    class: 'show-only-details',
                    required: true,
                    informationboxdata: {
                        heading: 'Related Consultation',
                        text: 'Select the related consultation and enter the details for this communication',
                    },
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'communication-select-resource',
                                    uniqueInstanceName: 'communication-select-resource', /* unique to step */
                                    parameters: {
                                        graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                                        nodegroupid: 'caf5bff1-a3d7-11e9-aa28-00224800b26d',
                                    },
                                },
                            ], 
                        },
                    ],
                },
                {
                    title: 'Notes',
                    name: 'notes',
                    required: false,
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'default-card',
                                    uniqueInstanceName: 'communication-notes-step', /* unique to step */
                                    tilesManaged: 'one',
                                    parameters: {
                                        graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                                        nodegroupid: 'caf5bff1-a3d7-11e9-aa28-00224800b26d',
                                        resourceid: "['related-consultation']['communication-select-resource']['resourceid']",
                                        tileid: "['related-consultation']['communication-select-resource']['tileid']",
                                        hiddenNodes: [
                                            'caf5bffa-a3d7-11e9-8b1b-00224800b26d',
                                            '85af6942-9379-11ea-88ff-f875a44e0e11',
                                            '25b8c1e7-937a-11ea-a856-f875a44e0e11',
                                            'caf5bff5-a3d7-11e9-8c7e-00224800b26d',
                                            'f4ea6a31-9378-11ea-9b10-f875a44e0e11',
                                            'e4cd8a65-9377-11ea-942c-f875a44e0e11',
                                            'e4cd8a66-9377-11ea-b4d9-f875a44e0e11',
                                            'f4ea6a30-9378-11ea-a36d-f875a44e0e11',
                                            'c631d1fa-9534-11ea-af75-f875a44e0e11',
                                            'b0330f90-9535-11ea-9d50-f875a44e0e11',
                                            '5d89cd18-51a5-11eb-a920-f875a44e0e11',
                                            'c44bc4cc-1851-11eb-946c-f875a44e0e11',
                                            '2401e470-9535-11ea-88fd-f875a44e0e11',
                                            'caf5bff4-a3d7-11e9-99c5-00224800b26d',
                                            'f76b68f4-9534-11ea-b94c-f875a44e0e11',
                                        ]
                                    },
                                },
                            ], 
                        },
                    ],
                    informationboxdata: {
                        heading: 'Meeting notes',
                        text: 'Add notes about the communication',
                    }
                },
                {
                    title: 'Follow-On Actions',
                    name: 'follow-on-actions',
                    required: false,
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'default-card',
                                    uniqueInstanceName: 'communication-follow-on-actions-step', /* unique to step */
                                    tilesManaged: 'one',
                                    parameters: {
                                        graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                                        nodegroupid: 'caf5bff1-a3d7-11e9-aa28-00224800b26d',
                                        resourceid: "['related-consultation']['communication-select-resource']['resourceid']",
                                        tileid: "['related-consultation']['communication-select-resource']['tileid']",
                                        hiddenNodes: [
                                            'caf5bffa-a3d7-11e9-8b1b-00224800b26d',
                                            '85af6942-9379-11ea-88ff-f875a44e0e11',
                                            '25b8c1e7-937a-11ea-a856-f875a44e0e11',
                                            'caf5bff5-a3d7-11e9-8c7e-00224800b26d',
                                            'f4ea6a31-9378-11ea-9b10-f875a44e0e11',
                                            '25b8c1e6-937a-11ea-9524-f875a44e0e11',
                                            'e4cd8a66-9377-11ea-b4d9-f875a44e0e11',
                                            'f4ea6a30-9378-11ea-a36d-f875a44e0e11',
                                            'c631d1fa-9534-11ea-af75-f875a44e0e11',
                                            'b0330f90-9535-11ea-9d50-f875a44e0e11',
                                            '5d89cd18-51a5-11eb-a920-f875a44e0e11',
                                            'c44bc4cc-1851-11eb-946c-f875a44e0e11',
                                            '2401e470-9535-11ea-88fd-f875a44e0e11',
                                            'caf5bff4-a3d7-11e9-99c5-00224800b26d',
                                            'f76b68f4-9534-11ea-b94c-f875a44e0e11',
                                        ]
                                    },
                                },
                            ], 
                        },
                    ],
                    informationboxdata: {
                        heading: 'Follow-On Actions',
                        text: 'Add follow-on actions regarding the communication',
                    }
                },
                {
                    title: 'Upload Documents',
                    name: 'upload-documents',
                    required: false,
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'upload-document-step',
                                    uniqueInstanceName: 'upload-documents-step', /* unique to step */
                                    tilesManaged: 'one',
                                    parameters: {
                                        graphid: 'a535a235-8481-11ea-a6b9-f875a44e0e11',
                                        nodegroupid: '7db68c6c-8490-11ea-a543-f875a44e0e11',
                                        consultationResourceid: "['related-consultation']['communication-select-resource']['resourceid']",
                                        consultationTileid: "['related-consultation']['communication-select-resource']['tileid']",
                                    },
                                },
                            ], 
                        },
                    ],
                    informationboxdata: {
                        heading: 'Upload Documents',
                        text: 'Upload a document or file regarding the communication',
                    },
                },
                {
                    title: 'Add Communication Complete',
                    name: 'communication-complete',
                    description: 'Choose an option below',
                    component: 'views/components/workflows/component-based-step',
                    componentname: 'component-based-step',
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'communication-final-step',
                                    uniqueInstanceName: 'communication-final',
                                    tilesManaged: 'none',
                                    parameters: {
                                        digitalObject: "['upload-documents']['upload-documents-step']",
                                        consultationTileid: "['related-consultation']['communication-select-resource']['tileid']",
                                        consultationResourceid: "['related-consultation']['communication-select-resource']['resourceid']",
                                    },
                                },
                            ], 
                        },
                    ],
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '6a773228-db20-11e9-b6dd-784f435179ea',
                    icon: 'fa-check',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    informationboxdata: {
                        heading: 'Workflow Complete: Review your work',
                        text: 'Please review the summary information. You can go back to a previous step to make changes or "Quit Workflow" to discard your changes and start over',
                    }
                }
            ];
            
            Workflow.apply(this, [params]);
            this.quitUrl = arches.urls.plugin('init-workflow');
        },
        template: communicationWorkflowTemplate
    });
});
