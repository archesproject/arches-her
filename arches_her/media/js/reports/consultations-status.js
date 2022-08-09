define([
    'knockout',
    'underscore',
    'templates/views/components/reports/consultations-status.htm'
], function(ko, _, consultationsStatusReportTemplate) {
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
            
            this.consultationStatus = ko.computed(function() {
                return getNodeValues('6a773228-db20-11e9-b6dd-784f435179ea')[0];
            });
            
            this.logDate = ko.computed(function() {
                return getNodeValues('40eff4cd-893a-11ea-b0cc-f875a44e0e11')[0];
            });
            
            this.dueDate = ko.computed(function() {
                return getNodeValues('7224417b-893a-11ea-b383-f875a44e0e11')[0];
            });
            
            this.completionDate = ko.computed(function() {
                return getNodeValues('40eff4ce-893a-11ea-ae2e-f875a44e0e11')[0];
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
                        identifier: tile.data['c128bf36-9384-11ea-bfe1-f875a44e0e11'],
                        agency: tile.data['8d41e4dc-a250-11e9-8e44-00224800b26d']
                    };
                });
            });
        },
        template: consultationsStatusReportTemplate
    });
});
