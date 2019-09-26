define([
    'knockout',
    'knockout-mapping',
    'underscore',
    'geojson-extent',
    'views/components/map',
    'views/components/cards/select-feature-layers',
], function(ko, koMapping, _, geojsonExtent, MapComponentViewModel, selectFeatureLayersFactory) {
    ko.components.register('consultations-map', {
        viewModel: function(params) {
            var self = this;
            var featureCollection = ko.computed(function() {
                var features = [];
                ko.unwrap(params.tiles).forEach(function(tile) {
                    _.each(tile.data, function(val) {
                        if ('features' in val) {
                            features = features.concat(koMapping.toJS(val.features));
                        }
                    }, this);
                }, this);
                return {
                    type: 'FeatureCollection',
                    features: features
                };
            });
            
            if (featureCollection().features.length > 0) {
                params.bounds = geojsonExtent(featureCollection());
                params.fitBoundsOptions = { padding: 40 };
            }
            
            params.activeTab = false;
            params.sources = Object.assign({
                "consultations-map-data": {
                    "type": "geojson",
                    "data": featureCollection()
                }
            }, params.sources);
            params.layers = selectFeatureLayersFactory(
                '',
                'consultations-map-data',
                undefined,
                [],
                true
            );
            MapComponentViewModel.apply(this, [params]);
            
            featureCollection.subscribe(function(featureCollection) {
                self.map().getSource('consultations-map').setData(featureCollection);
            });
        },
        template: { require: 'text!templates/views/components/map.htm' }
    });
});
