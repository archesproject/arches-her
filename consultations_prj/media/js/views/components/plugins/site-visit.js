define([
    'knockout',
    'viewmodels/workflow',
    'viewmodels/workflow-step',
    'views/components/workflows/new-tile-step',
    'views/components/workflows/get-tile-value',
    'views/components/workflows/select-resource-step'
], function(ko, Workflow, Step) {
    return ko.components.register('site-visit', {
        viewModel: function(params) {
            console.log(params);
            if (!params.resourceid) {
                params.resourceid = ko.observable();
            }
            console.log(params);
            var self = this;
            params.steps = [
                {
                    title: 'Site Visit Details - Related Consultation',
                    name: 'sitevisitdetailsrelatedconsultation',
                    description: '',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'select-resource-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    // nodegroupid: '1cff60de-a251-11e9-a296-00224800b26d', //Visit Date
                    nodegroupid: "8d41e4ab-a250-11e9-87d1-00224800b26d", //Consultation Name -- strictly used for testing component
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-tag',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]'
                },
                {
                    title: 'Site Visit Attendees',
                    name: 'siteattendees',
                    description: '',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    // nodegroupid: 'ab622f1f-a251-11e9-bda5-00224800b26d', // visit attendees
                    nodegroupid: "8d41e4bd-a250-11e9-89e8-00224800b26d", //Consultation Proposal -- strictly used for testing component
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-user-plus',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]'
                },
                {
                    title: 'Site Visit Observations',
                    name: 'siteobservations',
                    description: '',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: 'bef92340-a251-11e9-81db-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-lightbulb-o',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]'
                },
                {
                    title: 'Recommendations',
                    name: 'siterecommendations',
                    description: '',
                    component: 'views/components/workflows/new-tile-step',
                    componentname: 'new-tile-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: 'cbf8ed4f-a251-11e9-8f8c-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-clipboard',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]'
                },
                {
                    title: 'Site Photos (Upload)',
                    name: 'sitephotosupload',
                    description: '',
                    component: 'views/components/workflows/photo-gallery-step',
                    componentname: 'photo-gallery-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: 'd8c9b821-a251-11e9-879b-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-camera',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]'
                },
                {
                    title: 'Site Visit Workflow Complete',
                    name: 'sitevisitcomplete',
                    description: '',
                    component: 'views/components/workflows/final-step',
                    componentname: 'final-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: '',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    icon: 'fa-check',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]'
                }

            ];

            Workflow.apply(this, [params]);

            self.activeStep.subscribe(this.updateState);

            self.ready(true);
        },
        template: { require: 'text!templates/views/components/plugins/site-visit.htm' }
    });
});
