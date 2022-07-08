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
                this.bng = ko.observable("");
                this.bng_x = ko.observable(0);
                this.bng_y = ko.observable(0);
                this.buffer = ko.observable(0);
                this.mapboxgl = mapboxgl;

                options.name = "BNG Filter";
                BaseFilter.prototype.initialize.call(this, options);

                this.filter = {
                    bng: ko.observable(null),
                    buffer: ko.observable(0),
                    inverted: ko.observable(false)
                };
                
                this.bngMessageError = ko.observable("");
                this.bufferMessageError = ko.observable("");
                this.xyMessageError = ko.observable("");

                this.bngHasError = ko.computed(function() {
                    return self.bngMessageError().length > 0;
                });
                this.bufferHasError = ko.computed(function() {
                    return self.bufferMessageError().length > 0;
                });
                this.xyHasError = ko.computed(function() {
                    return self.xyMessageError().length > 0;
                });

                this.bng.subscribe(function(value) {
                    self.validate();
                    let hasErr = ko.unwrap(self.bngHasError());
                    if(!hasErr){
                        let bng_xy = self.xyFromBng(value);
                        self.bng_x = bng_xy["x"];
                        self.bng_y = bng_xy["y"];
                        self.filter.bng(value);
                        self.updateQuery();
                    }
                });

                this.bng_x.subscribe(function(value) {
                    self.validate();
                    let hasErr = ko.unwrap(self.xyHasError());
                    if(!hasErr){
                        let bng = self.bngFromXy(value, self.bng_y());
                        self.bng(bng);
                        self.filter.bng(bng);
                        self.updateQuery();
                    }
                });

                this.buffer.subscribe(function(value) {
                    self.validate();
                    let hasErr = ko.unwrap(self.bufferHasError());
                    if(!hasErr){
                        self.filter.buffer(parseInt(value));
                        self.updateQuery();
                    }
                });

                /*this.gridList = [
                    "HO", "HP","HT","HU","HW","HX","HY","HZ",
                    "NA","NB","NC","ND","NE","NF","NG","NH","NJ","NK","NL","NM","NN","NO","NP","NQ","NR","NS","NT","NU","NV","NW","NX","NY","NZ",
                    "OA","OB","OF","OG","OL","OM","OQ","OR","OV","OW","SA","SB",
                    "SC","SD","SE","SF","SG","SH","SJ","SK","SL","SM","SN","SO","SP","SQ","SR","SS","ST","SU","SV","SW","SX","SY","SZ",
                    "TA","TB","TF","TG","TL","TM","TQ","TR","TV","TW"
                ]*/

                this.gridList = {
                    "HO": [3, 12],
                    "HP": [4, 12],
                    "HT": [3, 11],
                    "HU": [4, 11],
                    "HW": [1, 10], 
                    "HX": [2, 10],
                    "HY": [3, 10],
                    "HZ": [4, 10],
                    "NA": [0, 9],
                    "NB": [1, 9],
                    "NC": [2, 9],
                    "ND": [3, 9],
                    "NE": [4, 9],
                    "OA": [5, 9],
                    "OB": [6, 9],
                    "NF": [0, 8],
                    "NG": [1, 8],
                    "NH": [2, 8],
                    "NJ": [3, 8],
                    "NK": [4, 8],
                    "OF": [5, 8],
                    "OG": [6, 8],
                    "NL": [0, 7],
                    "NM": [1, 7],
                    "NN": [2, 7],
                    "NO": [3, 7],
                    "NP": [4, 7],
                    "OL": [5, 7],
                    "OM": [6, 7],
                    "NQ": [0, 6],
                    "NR": [1, 6],
                    "NS": [2, 6],
                    "NT": [3, 6],
                    "NU": [4, 6],
                    "OQ": [5, 6],
                    "OR": [6, 6],
                    "NV": [0, 5],
                    "NW": [1, 5],
                    "NX": [2, 5],
                    "NY": [3, 5],
                    "NZ": [4, 5],
                    "OV": [5, 5],
                    "OW": [6, 5],
                    "SA": [0, 4],
                    "SB": [1, 4],
                    "SC": [2, 4],
                    "SD": [3, 4],
                    "SE": [4, 4],
                    "TA": [5, 4],
                    "TB": [6, 4],
                    "SF": [0, 3],
                    "SG": [1, 3],
                    "SH": [2, 3],
                    "SJ": [3, 3],
                    "SK": [4, 3],
                    "TF": [5, 3],
                    "TG": [6, 3],
                    "SL": [0, 2],
                    "SM": [1, 2],
                    "SN": [2, 2],
                    "SO": [3, 2],
                    "SP": [4, 2],
                    "TL": [5, 2],
                    "TM": [6, 2],
                    "SQ": [0, 1],
                    "SR": [1, 1],
                    "SS": [2, 1],
                    "ST": [3, 1],
                    "SU": [4, 1],
                    "TQ": [5, 1],
                    "TR": [6, 1],
                    "SV": [0, 0],
                    "SW": [1, 0],
                    "SX": [2, 0],
                    "SY": [3, 0],
                    "SZ": [4, 0],
                    "TV": [5, 0],
                    "TW": [6, 0]
                }

                this.validateBng = function() {
                    self.bngMessageError("");
                    if (self.bng() && self.bng().length > 0) {
                        // bng must have even number of chars
                        if (self.bng().length % 2 !== 0) {
                            self.bngMessageError("BNG must have an even number of characters");
                            return;
                        }
                        
                        //bng must be between 4 and 12 characters
                        if (self.bng().length < 4 || self.bng().length > 12) {
                            self.bngMessageError("BNG must be between 4 and 12 characters");
                            return;
                        }
                        
                        // the first tochars must be in the gridlist
                        var gridlist = Object.keys(self.gridList);
                        if (gridlist.indexOf(self.bng().toUpperCase().substring(0, 2)) === -1) {
                            self.bngMessageError("BNG must start with a valid 100km grid square identifier");
                            return;
                        }
                        
                        //must start with two letters and then all chars after the first two must be digits
                        var regex = /^[a-zA-Z]{2}[0-9]{2,10}/;
                        var matches = regex.exec(self.bng());
                        if (matches.indexOf(self.bng()) === -1) {
                            self.bngMessageError("BNG must start with two alpha characters followed by 2 to 10 digits");
                            return;
                        }                      

                    }
                }               

                this.validateXy = function() {
                    self.xyMessageError("");
                    if (!self.bng_x() || isNaN(self.bng_x) || self.bng_x() > -1 || !self.bng_y() || isNaN(self.bng_y) || !self.bng_y() > -1) {

                        self.xyMessageError("X and Y must be numeric 0 or greater");
                        return;
                    }
                }

                this.validateBuffer = function() {
                    var buffer = self.buffer();
                    try {
                        buffer = parseFloat(buffer);
                        if (isNaN(buffer)) {
                            self.bufferMessageError("Buffer must be a number");
                            return;
                        }
                    } catch (e) {
                        self.bufferMessageError("Buffer must be a number");
                        return;
                    }

                    if (buffer < 0) {
                        self.bufferMessageError("Buffer must be a positive number");
                        return;
                    }
                                        
                    self.bufferMessageError("");
                    return;
                }
                
                //validate the inputs and
                this.validate = function() {
                    self.validateBng();
                    self.validateBuffer();
                }

                this.xyFromBng = function(bng) {
                    let ret = {"x":0,"y":0};
                    try {
                        if(bng.length() = 12) {
                            let oneHundredKmGrid = self.gridList(bng.substring(0, 2));
                            let x = oneHundredKmGrid[0] * 100000 + parseInt(bng.substring(2, bng.length / 2));
                            let y = oneHundredKmGrid[1] * 100000 + parseInt(bng.substring(bng.length / 2, bng.length));
                            ret = {"x":x,"y":y};
                        }
                    } catch (error) {
                        self.xyMessageError("Could not convert BNG to XY");
                    }
                    
                    return ret;
                }

                this.bngFromXY = function(x,y) {
                    let bng = "";
                    try {
                        let gridlist = self.gridList;
                        let xOneHundredKmGrid = Math.floor(x / 100000);
                        let yOneHundredKmGrid = Math.floor(y / 100000);
                        let xGrid = Math.floor((x % 100000) / 1000);
                        let yGrid = Math.floor((y % 100000) / 1000);
                        bng = gridlist[xOneHundredKmGrid].toString() + gridlist[yOneHundredKmGrid].toString() + xGrid.toString() + yGrid.toString();
                    }
                    catch (error) {
                        self.xyMessageError("Could not convert XY to BNG");
                    }
                    return bng;
                }


                this.filters[componentName](this);
                this.pageLoaded = false;
                var bufferColour = "#009ab9";
                var gridSquareColour = "#f0c200";
                this.layers = arches.mapLayers.find(function(layer){
                    return layer.addtomap && !layer.isoverlay;
                })['layer_definitions'].concat([
                    {
                        "id": "grid-square-polygon-fill",
                        "source": "grid-square",
                        "type": "fill",
                        "filter": ['all',["==", "$type", "Polygon"],["==", "type", "grid_square"]],
                        "paint": {
                            "fill-color": gridSquareColour,
                            "fill-outline-color": gridSquareColour,
                            "fill-opacity": 0.1
                        }
                    }, {
                        "id": "grid-square-polygon-stroke",
                        "source": "grid-square",
                        "type": "line",
                        "filter": ['all',["==", "$type", "Polygon"],["==", "type", "grid_square"]],
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": gridSquareColour,
                            "line-width": 2
                        }
                    }
                    , {
                        "id": "grid-square-buffer-polygon-stroke",
                        "source": "grid-square",
                        "type": "line",
                        "filter": ['all',[
                            "==", "$type", "Polygon"
                        ],["==", "type", "grid_square_buffer"]],
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": bufferColour,
                            "line-width": 2,
                            'line-dasharray': [2, 3],
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
                    self.validate();
                    if(!self.bngHasError() && !self.bufferHasError()) {
                        var queryObj = self.query();
                        if (self.getFilter('term-filter').hasTag(self.type) === false) {
                            self.getFilter('term-filter').addTag('BNG Filter', self.name, self.filter.inverted);
                        }
                        queryObj[componentName] = ko.toJSON(self.filter);
                    }
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
                    self.buffer(bngVal.buffer);
                }
                self.updateResults();
            },

            clear: function() {
                var self = this;
                self.filter.inverted(false);
                self.bng("");
                self.buffer(0);
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
                    if(!!grid_square["features"]) {
                        geoJSON = grid_square;
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
