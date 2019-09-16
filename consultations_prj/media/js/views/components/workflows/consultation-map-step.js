define([
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'geojson-extent',
    'views/components/workflows/new-tile-step'
], function($, arches, ko, koMapping, geojsonExtent, NewTileStep) {
    function viewModel(params) {
        var self = this;
        this.applicationAreaBounds = ko.observable();
        NewTileStep.apply(this, [params]);
        this.tile.subscribe(function(tile) {
            var geoJSON = koMapping.toJS(tile.data['8d41e4d6-a250-11e9-accd-00224800b26d']);
            if (!geoJSON || geoJSON.features.length === 0) {
                var tiles = self.getTiles('8d41e4ba-a250-11e9-9b20-00224800b26d');
                if (tiles.length > 0) {
                    var resourceIds = koMapping.toJS(tiles[0].data['8d41e4de-a250-11e9-973b-00224800b26d']);
                    $.getJSON({
                        url: arches.urls.geojson,
                        data: {
                            resourceid:resourceIds.join(',')
                        }
                    }, function(geojson) {
                        if (geojson.features.length > 0) self.applicationAreaBounds(geojsonExtent(geojson));
                    });
                }
            }
        });
    }

    ko.components.register('consultation-map-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/consultation-map-step.htm'
        }
    });

    return viewModel;
});
