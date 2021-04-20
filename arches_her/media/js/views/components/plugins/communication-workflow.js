define([
    'knockout',
    'arches',
    'viewmodels/workflow',
    'viewmodels/workflow-step',
    'views/components/workflows/new-tile-step',
    'views/components/workflows/select-resource-step',
    'views/components/workflows/communication-workflow/communication-final-step'
], function(ko, arches, Workflow, Step) {
    return ko.components.register('communication-workflow', {
        viewModel: function(params) {
            var self = this;
            this.resourceId = ko.observable();
            
            params.steps = [
                {
                    title: 'Related Consultation / Details',
                    name: 'related-consultation',
                    description: 'Select the related consultation and Enter the details for this Communication',
                    component: 'views/components/workflows/communication-select-resource',
                    componentname: 'communication-select-resource',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: 'caf5bff1-a3d7-11e9-aa28-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    class: 'show-only-details',
                    required: true,
                    icon: 'fa-tag',
                    nameheading: 'Communication',
                    namelabel: '[no label]',
                    shouldtrackresource: true,
                    informationboxdata: {
                        heading: 'Related Consultation',
                        text: 'Select the related consultation and enter the details for this communication',
                    },
                    wastebin: {tile: null, description: 'a communication tile'}
                },
                {
                    title: 'Notes',
                    name: 'notes',
                    description: 'Meeting notes',
                    component: 'views/components/workflows/communication-hide-card',
                    componentname: 'communication-hide-card',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: 'caf5bff1-a3d7-11e9-aa28-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    class: 'show-only-notes',
                    required: false,
                    icon: 'fa-lightbulb-o',
                    informationboxdata: {
                        heading: 'Meeting notes',
                        text: 'Add notes about the communication',
                    }
                },
                {
                    title: 'Follow-On Actions',
                    name: 'follow-on-actions',
                    description: 'Follow-on actions, To-Dos',
                    component: 'views/components/workflows/communication-hide-card',
                    componentname: 'communication-hide-card',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: 'caf5bff1-a3d7-11e9-aa28-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    class: 'show-only-followup',
                    parenttileid: null,
                    required: false,
                    icon: 'fa-clipboard',
                    informationboxdata: {
                        heading: 'Follow-On Actions',
                        text: 'Add follow-on actions regarding the communication',
                    }
                },
                {
                    title: 'Upload Documents',
                    name: 'upload-documents',
                    description: 'Document Upload',
                    component: 'views/components/workflows/upload-document-step',
                    componentname: 'upload-document-step',
                    graphid: 'a535a235-8481-11ea-a6b9-f875a44e0e11',
                    nodegroupid: '7db68c6c-8490-11ea-a543-f875a44e0e11',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: false,
                    icon: 'fa-file-o',
                    informationboxdata: {
                        heading: 'Upload Documents',
                        text: 'Upload a document or file regarding the communication',
                    },
                    wastebin: {resourceid: null, description: 'a digital object resource'}
                },
                {
                    title: 'Add Communication Complete',
                    name: 'communication-complete',
                    description: 'Choose an option below',
                    component: 'views/components/workflows/component-based-step',
                    componentname: 'component-based-step',
                    externalstepdata: { 
                        relatedconsultationstep: 'related-consultation',
                        uploaddocumentstep: 'upload-documents',
                    },
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'communication-final-step',
                                    uniqueInstanceName: 'communication-final',
                                    tilesManaged: 'none',
                                    parameters: {
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
            this.quitUrl = "/arches-her" + arches.urls.plugin('init-workflow');
            self.getJSON('communication-workflow');

            self.ready(true);
        },
        template: { require: 'text!templates/views/components/plugins/communication-workflow.htm' }
    });
});
