define([
    'knockout'
], function(ko) {
    ko.components.register('consultations-site-visits-summary', {
        viewModel: function(params) {
            this.visits = ko.computed(function() {
                return ko.unwrap(params.tiles).filter(function(tile) {
                    return ko.unwrap(tile.nodegroup_id) === '066cb8f0-a251-11e9-85d5-00224800b26d';
                }).map(function(tile) {
                    return {
                        tileid: tile.tileid,
                        date: tile.data['299e6d51-a251-11e9-9eb6-00224800b26d']
                    };
                });
            });
        },
        template: { require: 'text!templates/views/components/reports/consultations-site-visits-summary.htm' }
    });
});
