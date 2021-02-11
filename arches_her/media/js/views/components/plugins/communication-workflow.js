define([
    'knockout',
    'arches',
    'viewmodels/workflow',
    'viewmodels/workflow-step',
    'views/components/workflows/new-tile-step',
    'views/components/workflows/select-resource-step'
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
                    component: 'views/components/workflows/select-resource-step',
                    componentname: 'select-resource-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: 'caf5bff1-a3d7-11e9-aa28-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: true,
                    icon: 'fa-tag',
                    nameheading: 'Communication',
                    namelabel: '[no label]',
                    shouldtrackresource: true,
                    wastebin: {tile: null, description: 'a communication instance'}
                },
                {
                    title: 'Notes',
                    name: 'notes',
                    description: ' Meeting notes',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: 'caf5bffb-a3d7-11e9-aebc-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: false,
                    icon: 'fa-lightbulb-o'
                },
                {
                    title: 'Follow-On Actions',
                    name: 'follow-on-actions',
                    description: 'Follow-on actions, To-Dos',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: 'caf5bff8-a3d7-11e9-a37c-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: false,
                    icon: 'fa-clipboard'
                },
                {
                    title: 'Upload Documents',
                    name: 'upload-documents',
                    description: 'Document Upload',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: 'caf5bff7-a3d7-11e9-baa0-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: false,
                    icon: 'fa-file-o'
                },
                {
                    title: 'Add Communication Complete',
                    name: 'communication-complete',
                    description: 'Choose an option below',
                    component: 'views/components/workflows/consultations-final-step',
                    componentname: 'consultations-final-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '6a773228-db20-11e9-b6dd-784f435179ea',
                    icon: 'fa-check',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null
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
