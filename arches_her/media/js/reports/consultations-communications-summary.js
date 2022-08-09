define([
    'knockout',
    'templates/views/components/reports/consultations-communications-summary.htm'
], function(ko, consultationsCommunicationsSummaryReportTemplate) {
    ko.components.register('consultations-communications-summary', {
        viewModel: function(params) {
            this.communications = ko.computed(function() {
                return ko.unwrap(params.tiles).filter(function(tile) {
                    return ko.unwrap(tile.nodegroup_id) === 'caf5bff1-a3d7-11e9-aa28-00224800b26d';
                }).map(function(tile) {
                    return {
                        tileid: tile.tileid,
                        date: tile.data['caf5bff5-a3d7-11e9-8c7e-00224800b26d'],
                        type: tile.data['caf5bff4-a3d7-11e9-99c5-00224800b26d']
                    };
                });
            });
            
            this.correspondences = ko.computed(function() {
                return ko.unwrap(params.tiles).filter(function(tile) {
                    return ko.unwrap(tile.nodegroup_id) === '8d41e4b4-a250-11e9-993d-00224800b26d';
                }).map(function(tile) {
                    return {
                        tileid: tile.tileid,
                        type: tile.data['8d41e4df-a250-11e9-af01-00224800b26d']
                    };
                });
            });
        },
        template: consultationsCommunicationsSummaryReportTemplate
    });
});
