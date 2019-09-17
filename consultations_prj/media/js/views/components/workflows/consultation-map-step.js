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
        var color = 'rgb(102, 195, 91)';
        this.sources = {
            "related-application-area": {
                "type": "geojson",
                "generateId": true,
                "data": {
                    "type": "FeatureCollection",
                    "features": []
                }
            }
        };
        this.layers = [{
            "id": "related-application-area-polygon-fill",
            "source": "related-application-area",
            "type": "fill",
            "filter": [
                "==", "$type", "Polygon"
            ],
            "paint": {
                "fill-color": color,
                "fill-outline-color": color,
                "fill-opacity": 0.1
            }
        }, {
            "id": "related-application-area-polygon-stroke",
            "source": "related-application-area",
            "type": "line",
            "filter": [
                "==", "$type", "Polygon"
            ],
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": color,
                "line-width": 2
            }
        }, {
            "id": "related-application-area-line",
            "source": "related-application-area",
            "type": "line",
            "filter": [
                "==", "$type", "LineString"
            ],
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": color,
                "line-width": 2
            }
        }, {
            "id": "related-application-area-point-stroke",
            "source": "related-application-area",
            "type": "circle",
            "filter": [
                "==", "$type", "Point"
            ],
            "paint": {
                "circle-radius": 6,
                "circle-opacity": 1,
                "circle-color": "#fff"
            }
        }, {
            "id": "related-application-area-point",
            "source": "related-application-area",
            "type": "circle",
            "filter": [
                "==", "$type", "Point"
            ],
            "paint": {
                "circle-radius": 3,
                "circle-color": color
            }
        }];
        this.map = ko.observable();
        
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
                        if (geojson.features.length > 0) {
                            self.applicationAreaBounds(geojsonExtent(geojson));
                            if (self.map()) {
                                self.map().getSource('related-application-area').setData(geojson);
                            } else {
                                self.map.subscribe(function(map) {
                                    map.getSource('related-application-area').setData(geojson);
                                });
                            }
                        }
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
