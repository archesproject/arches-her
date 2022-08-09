define([
    'knockout',
    'templates/views/components/reports/consultations-conditions-mitigations.htm'
], function(ko, consultationsConditionsMitigationsReportTemplate) {
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
                return getTiles('8d41e49f-a250-11e9-b6b3-00224800b26d', '56fa335d-06fa-11eb-8328-f875a44e0e11');
            });

            this.mitigations = ko.computed(function() {
                return getTiles('a5e15f5c-51a3-11eb-b240-f875a44e0e11', 'e2585f8a-51a3-11eb-a7be-f875a44e0e11');
            });
        },
        template: consultationsConditionsMitigationsReportTemplate
    });
});
