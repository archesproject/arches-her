define([
    'knockout'
], function(ko) {
    ko.components.register('consultations-conditions-mitigations', {
        viewModel: function(params) {
            var getTiles = function(nodegroupId, typeNodeId) {
                var tiles = ko.unwrap(params.tiles).filter(function(tile) {
                    return ko.unwrap(tile.nodegroup_id) === nodegroupId;
                });
                
                return tiles.map(function(tile) {
                    return {
                        tileid: tile.tileid,
                        type: tile.data[typeNodeId]
                    };
                });
            };
            
            this.conditions = ko.computed(function() {
                return getTiles('8d41e49f-a250-11e9-b6b3-00224800b26d', '8d41e4db-a250-11e9-bddf-00224800b26d');
            });
            
            this.mitigations = ko.computed(function() {
                return getTiles('8d41e4ae-a250-11e9-8c00-00224800b26d', '8d41e4ca-a250-11e9-abe7-00224800b26d');
            });
        },
        template: { require: 'text!templates/views/components/reports/consultations-conditions-mitigations.htm' }
    });
});
