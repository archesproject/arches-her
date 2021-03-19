define([
    'knockout',
    'arches',
    'viewmodels/workflow',
    'viewmodels/workflow-step',
    'views/components/workflows/new-tile-step',
    'views/components/workflows/select-resource-step'
], function(ko, arches, Workflow, Step) {
    return ko.components.register('correspondence-workflow', {
        viewModel: function(params) {
            var self = this;
            this.resourceId = ko.observable();
            params.steps = [
                {
                    title: 'Select Related Consultation',
                    name: 'select-related-consultation',
                    description: 'New Correspondence',
                    component: 'views/components/workflows/correspondence-select-resource',
                    componentname: 'correspondence-select-resource',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '8d41e4b4-a250-11e9-993d-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: true,
                    class: 'hide-letter-resource',
                    icon: 'fa-tag',
                    shouldtrackresource: true,
                    wastebin: {resourceid: null, description: 'a digital object instance'}
                },
                {
                    title: 'Correspondence Workflow Complete',
                    name: 'correspondence-complete',
                    description: '',
                    component: 'views/components/workflows/correspondence-final-step',
                    componentname: 'correspondence-final-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '8d41e4d1-a250-11e9-9a12-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-cloud-upload',
                    nameheading: 'New Correspondence',
                    namelabel: '[no label]',
                    wastebin: {tile: null, description: 'a correspondence tile'}
                }
            ];

            Workflow.apply(this, [params]);
            this.quitUrl = "/arches-her" + arches.urls.plugin('init-workflow');
            self.getJSON('correspondence-workflow');

            self.ready(true);
        },
        template: { require: 'text!templates/views/components/plugins/correspondence-workflow.htm' }
    });
});
