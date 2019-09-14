define([
    'knockout',
    'viewmodels/workflow',
    'viewmodels/workflow-step',
    'views/components/workflows/new-tile-step',
    'views/components/workflows/select-resource-step'
], function(ko, Workflow, Step) {
    return ko.components.register('correspondence-workflow', {
        viewModel: function(params) {
            var self = this;
            params.steps = [
                {
                    title: 'Select Related Consultation',
                    description: 'New Correspondence',
                    component: 'views/components/workflows/select-resource-step',
                    componentname: 'select-resource-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '8d41e4b4-a250-11e9-993d-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-tag',
                    wastebin: {tile: null, description: 'A Communication Instance'}
                },
                {
                    title: 'Review Letter',
                    name: 'reviewcorrespondence',
                    description: 'New Correspondence',
                    component: 'views/components/workflows/correspondence-letter-step',
                    componentname: 'correspondence-letter-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '8d41e4d1-a250-11e9-9a12-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-file-text-o'
                },
                {
                    title: 'Correspondence Workflow Complete',
                    name: 'correspondencecomplete',
                    description: '',
                    component: 'views/components/workflows/consultations-final-step',
                    componentname: 'consultations-final-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-cloud-upload',
                    nameheading: 'New Correspondence',
                    namelabel: '[no label]'
                }
            ];

            Workflow.apply(this, [params]);
            self.getJSON('correspondence-workflow');

            self.activeStep.subscribe(this.updateState);

            self.ready(true);
        },
        template: { require: 'text!templates/views/components/plugins/correspondence-workflow.htm' }
    });
});
