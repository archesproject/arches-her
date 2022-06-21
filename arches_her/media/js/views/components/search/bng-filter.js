define([
    'jquery',
    'underscore',
    'arches',
    'knockout',
    'views/components/search/base-filter',
    'geojson-extent',
    'mapbox-gl',
    'bindings/mapbox-gl',
], function($, _, arches, ko, BaseFilter, geojsonExtent, mapboxgl) {
    var componentName = 'bng-filter';
    return ko.components.register(componentName, {
        viewModel: BaseFilter.extend({
            initialize: function(options) {
                var self = this;

                this.dependenciesLoaded = ko.observable(false)
                this.bng = ko.observable('').extend({ rateLimit: 200 });
                this.mapboxgl = mapboxgl;

                options.name = "BNG Filter";
                BaseFilter.prototype.initialize.call(this, options);

                this.filter = {
                    bng: ko.observable(null),
                    inverted: ko.observable(false)
                };
                
                this.bng.subscribe(function(value) {
                    self.filter.bng(value);
                    self.updateQuery();
                });

                this.filters[componentName](this);
                this.pageLoaded = false;

                var color = "#f0c200";
                this.layers = arches.mapLayers.find(function(layer){
                    return layer.addtomap && !layer.isoverlay;
                })['layer_definitions'].concat([
                    {
                        "id": "grid-square-polygon-fill",
                        "source": "grid-square",
                        "type": "fill",
                        "filter": ['all',[
                            "==", "$type", "Polygon"
                        ]],
                        "paint": {
                            "fill-color": color,
                            "fill-outline-color": color,
                            "fill-opacity": 0.1
                        }
                    }, {
                        "id": "grid-square-polygon-stroke",
                        "source": "grid-square",
                        "type": "line",
                        "filter": ['all',[
                            "==", "$type", "Polygon"
                        ]],
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": color,
                            "line-width": 2
                        }
                    }
                ]);
                this.layers.unshift({
                    "id": "background-fill",
                    "type": "background",
                    "paint": {
                        "background-color": "#f2f2f2"
                    }
                });
                this.sprite = arches.mapboxSprites;
                this.glyphs = arches.mapboxGlyphs;
                this.sources = Object.assign({
                    'grid-square': {
                        "type": "geojson",
                        "data": 
                            {
                                "features": [],
                                "type":"FeatureCollection"
                            }
                    }
                }, arches.mapSources);
                this.grid_source_center = [
                    -1.0711932516186664,
                    52.327530211008224
                ];
                this.grid_source_zoom = 4;

                this.default_bng_extent_geojson = {
                    "type": "FeatureCollection",
                    "features": [
                        {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [
                                    [
                                        [
                                            -8.988809980932643,
                                            49.84875701081509
                                        ],
                                        [
                                            -8.988809980932643,
                                            60.868894210552696
                                        ],
                                        [
                                            3.1647630667817452,
                                            60.868894210552696
                                        ],
                                        [
                                            3.1647630667817452,
                                            49.84875701081509
                                        ],
                                        [
                                            -8.988809980932643,
                                            49.84875701081509
                                        ]
                                    ]
                                ]
                            }
                        }
                    ]
                };

                this.setupMap = function(map){
                    self.map = ko.observable(map);
                    self.restoreState();
                }

                this.searchResults.timestamp.subscribe(function(timestamp) {
                    if(this.pageLoaded) {
                        this.updateResults();
                    }
                }, this);
            },

            updateQuery: function() {
                var self = this;
                if (self.filter.bng() != "" && self.filter.bng() != null) {
                    var queryObj = self.query();
                    if (self.getFilter('term-filter').hasTag(self.type) === false) {
                        self.getFilter('term-filter').addTag('BNG Filter', self.name, self.filter.inverted);
                    }
                    queryObj[componentName] = ko.toJSON(self.filter);
                } 
                else{
                    queryObj = self.query()
                    delete queryObj[componentName];
                    self.getFilter('term-filter').removeTag('BNG Filter');
                }
                self.query(queryObj);
            },

            restoreState: function() {
                var self = this;
                var query = self.query();
                self.pageLoaded = true;
                if (componentName in query) {
                    var bngVal = JSON.parse(query[componentName]);
                    self.getFilter('term-filter').addTag(self.name, self.name, self.filter.inverted);
                    self.filter.inverted(!!bngVal.inverted);
                    self.bng(bngVal.bng);
                }
                self.updateResults();
            },

            clear: function(reset_features) {
                var self = this;
                self.filter.inverted(false);
                self.bng("");
                self.updateQuery();
            },

            updateResults: function() { 
                var self = this;
                var geoJSON = {
                    "type": "FeatureCollection",
                    "features": []
                }

                if(!!self.searchResults[componentName]) {
                    var grid_square = self.searchResults[componentName].grid_square;
                    if(!!grid_square["coordinates"]) {
                        geoJSON.features.push({
                            "type": "Feature",
                            "properties": {},
                            "geometry": grid_square
                        });
                    }
                }

                var bounds_geojson = undefined;
                if(geoJSON.features.length > 0){
                    bounds_geojson = geoJSON;
                }
                else
                {
                    bounds_geojson = self.default_bng_extent_geojson;
                }

                try {
                    self.map().getSource('grid-square')?.setData(geoJSON);
                    var extent = geojsonExtent(bounds_geojson);
                    var bounds = new self.mapboxgl.LngLatBounds(extent);
                    self.map().fitBounds(bounds, {
                        padding: 100,
                        animate: false
                    });
                } catch (error) {
                    
                }
            }


            
        }),
        template: { require: 'text!templates/views/components/search/bng-filter.htm' }
    });
});
