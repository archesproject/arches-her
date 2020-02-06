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
            if (!params.resourceid) {
                params.resourceid = ko.observable();
            }
            var self = this;
            params.steps = [
                {
                    title: 'Site Visit Details - Related Consultation',
                    name: 'sitevisitdetailsrelatedconsultation',
                    description: '',
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
                    wastebin: {tile: null, description: 'a site visit instance'}
                },
                {
                    title: 'Site Visit Attendees',
                    name: 'siteattendees',
                    description: '',
                    component: 'views/components/workflows/new-multi-tile-step',
                    componentname: 'new-multi-tile-step',
                    graphid: '8d41e49e-a250-11e9-9eab-00224800b26d',
                    nodegroupid: 'ab622f1f-a251-11e9-bda5-00224800b26d',
                    resourceid: null,
                    tileid: null,
                    parenttileid: null,
                    required: false,
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
                    required: false,
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
                    required: false,
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
                    required: false,
                    icon: 'fa-camera',
                    nameheading: 'New Site Visit',
                    namelabel: '[no label]',
                    createTile: false,
                    autoAdvance: false
                },
                {
                    title: 'Site Visit Workflow Complete',
                    name: 'sitevisitcomplete',
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
                    namelabel: '[no label]'
                }

            ];

            Workflow.apply(this, [params]);
            this.quitUrl = "/Arches-HER" + arches.urls.plugin('init-workflow');
            self.getJSON('site-visit');

            self.activeStep.subscribe(this.updateState);

            self.ready(true);
        },
        template: { require: 'text!templates/views/components/plugins/site-visit.htm' }
    });
});
