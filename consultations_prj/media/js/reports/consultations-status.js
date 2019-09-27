define([
    'knockout',
    'underscore'
], function(ko, _) {
    ko.components.register('consultations-status', {
        viewModel: function(params) {
            var getNodeValues = function(nodeId) {
                var values = [];
                ko.unwrap(params.tiles).forEach(function(tile) {
                    _.each(tile.data, function(val, key) {
                        if (key === nodeId) {
                            values.push(ko.unwrap(val));
                        }
                    }, this);
                }, this);
                return values;
            };
            
            this.logDate = ko.computed(function() {
                return getNodeValues('8d41e4cf-a250-11e9-a86d-00224800b26d')[0];
            });
            
            this.dueDate = ko.computed(function() {
                return getNodeValues('8d41e4cb-a250-11e9-9cf2-00224800b26d')[0];
            });
            
            this.completionDate = ko.computed(function() {
                return getNodeValues('8d41e4cd-a250-11e9-a25b-00224800b26d')[0];
            });
            
            this.planningOutcome = ko.computed(function() {
                return getNodeValues('8d41e4e3-a250-11e9-89d8-00224800b26d')[0];
            });
            
            this.auditOutcome = ko.computed(function() {
                return getNodeValues('8d41e4e4-a250-11e9-9907-00224800b26d')[0];
            });
            
            this.references = ko.computed(function() {
                var tiles = ko.unwrap(params.tiles).filter(function(tile) {
                    return ko.unwrap(tile.nodegroup_id) === '8d41e4a2-a250-11e9-82f1-00224800b26d';
                });
                
                return tiles.map(function(tile) {
                    return {
                        identifier: tile.data['8d41e4c9-a250-11e9-b2d4-00224800b26d'],
                        agency: tile.data['8d41e4dc-a250-11e9-8e44-00224800b26d']
                    };
                });
            });
        },
        template: { require: 'text!templates/views/components/reports/consultations-status.htm' }
    });
});
