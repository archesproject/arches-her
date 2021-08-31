define([
    'knockout',
    'arches',
    'viewmodels/workflow',
    'viewmodels/workflow-step',
    'views/components/workflows/new-tile-step',
    'views/components/workflows/select-resource-step',
    'views/components/workflows/correspondence-final-step'
], function(ko, arches, Workflow, Step) {
    return ko.components.register('correspondence-workflow', {
        viewModel: function(params) {
            this.componentName = 'application-area';

            this.stepConfig = [
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
                    informationboxdata: {
                        heading: 'Select Related Consultation',
                        text: 'Select a consultation and a letter type to create a Letter',
                    },
                    wastebin: {resourceid: null, description: 'a digital object instance'}
                },
                {
                    title: 'Correspondence Workflow Complete',
                    name: 'correspondence-complete',
                    description: '',
                    component: 'views/components/workflows/component-based-step',
                    componentname: 'component-based-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '8d41e4d1-a250-11e9-9a12-00224800b26d',
                    externalstepdata: { 
                        relatedconsultationstep: 'select-related-consultation',
                    },
                    layoutSections: [
                        {
                            componentConfigs: [
                                { 
                                    componentName: 'correspondence-final-step',
                                    uniqueInstanceName: 'correspondence-final',
                                    tilesManaged: 'none',
                                    parameters: {
                                    },
                                },
                            ], 
                        },
                    ],
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-cloud-upload',
                    nameheading: 'New Correspondence',
                    namelabel: '[no label]',
                    informationboxdata: {
                        heading: 'Correspondence Workflow Complete',
                        text: 'A letter has been created. click Download to review the letter',
                    },
                    wastebin: {tile: null, description: 'a correspondence tile'}
                }
            ];

            Workflow.apply(this, [params]);
        },
        template: { require: 'text!templates/views/components/plugins/correspondence-workflow.htm' }
    });
});
