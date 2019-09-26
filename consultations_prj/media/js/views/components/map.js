define([
    'jquery',
    'underscore',
    'arches',
    'knockout',
    'mapbox-gl',
    'moment',
    'viewmodels/map',
    'geojson-extent',
    'bindings/mapbox-gl',
    'bindings/sortable'
], function($, _, arches, ko, mapboxgl, moment, MapViewModel, geojsonExtent) {
    var viewModel = function(params){
        var self = this;
        this.data = {};
        this.resourceEditorURL = arches.urls.resource_editor;
        MapViewModel.apply(this, [params]);

        this.getPopupData = function(feature) {
            var data = feature.properties;
            var id = data.resourceinstanceid;
            if (id) {
                if (true || !self.resourceLookup[id]){
                    data = _.defaults(data, {
                        'loading': true,
                        'displayname': '',
                        'graph_name': '',
                        'map_popup': '',
                        'resourceEditorURL': arches.urls.resource_editor,
                        'mapImageUrl': false
                    });
                    data = ko.mapping.fromJS(data);
                    data.reportURL = arches.urls.resource_report;
                    data.editURL = arches.urls.resource_editor;
                    data.sprite = arches.mapboxSprites;
                    data.glyphs = arches.mapboxGlyphs;
                    data.feature = feature;
                    data.mapCard = self;
                    data.getTargetDays = function(targetdate){
                        return moment(targetdate).diff(moment().startOf('day'), 'days');
                    };
                    data.setupMapPopup = function(map) {
                        map.on('load', function() {
                            data["mapImageUrl"](map.getCanvas().toDataURL("image/jpeg"));
                        });
                    };

                    var color = "#f0c200";
                    data.layers = arches.mapLayers.find(function(layer){
                        return layer.addtomap && !layer.isoverlay;
                    })['layer_definitions'].concat([
                        {
                            "id": "app-area-geom-polygon-fill",
                            "source": "app-area-geom",
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
                            "id": "app-area-geom-polygon-stroke",
                            "source": "app-area-geom",
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
                        }, {
                            "id": "app-area-geom-line",
                            "source": "app-area-geom",
                            "type": "line",
                            "filter": ['all',[
                                "==", "$type", "LineString"
                            ]],
                            "layout": {
                                "line-cap": "round",
                                "line-join": "round"
                            },
                            "paint": {
                                "line-color": color,
                                "line-width": 2
                            }
                        }, {
                            "id": "app-area-geom-point-stroke",
                            "source": "app-area-geom",
                            "type": "circle",
                            "filter": ['all',[
                                "==", "$type", "Point"
                            ]],
                            "paint": {
                                "circle-radius": 6,
                                "circle-opacity": 1,
                                "circle-color": "#fff"
                            }
                        }, {
                            "id": "app-area-geom-point",
                            "source": "app-area-geom",
                            "type": "circle",
                            "filter": ['all',[
                                "==", "$type", "Point"
                            ]],
                            "paint": {
                                "circle-radius": 3,
                                "circle-color": color
                            }
                        }
                    ]);
                    data.layers.unshift({
                        "id": "background-fill",
                        "type": "background",
                        "paint": {
                            "background-color": "#f2f2f2"
                        }
                    });

                    self.resourceLookup[id] = data;
                    $.get(arches.urls.resource_descriptors + id, function(data) {
                        ko.mapping.fromJS(data, self.resourceLookup[id]);
                        //_.extend(data, self.resourceLookup[id]);
                        console.log(self.resourceLookup[id]);
                        self.resourceLookup[id].loading(false);
                        self.resourceLookup[id]['Geospatial Location'] = ko.toJS(self.resourceLookup[id]['Geospatial Location']);
                        self.resourceLookup[id]["mapImageUrl"](false);
                        self.resourceLookup[id]["zoom"] = 0;
                        self.resourceLookup[id]["center"] = [0,0]; //defaults
                        var areas = ko.observableArray();
                        self.resourceLookup[id]['Application Area'].displayValue().split(',').forEach(function(area, index){
                            areas.push({'display_value': area, 'original_value': self.resourceLookup[id]['Application Area'].originalValue().split(',')[index]})
                        })
                        self.resourceLookup[id]['Application Area'] = areas;

                        self.resourceLookup[id].sources = Object.assign({
                            'app-area-geom': {
                                "type": "geojson",
                                "data": self.resourceLookup[id]["Geospatial Location"] ?
                                    self.resourceLookup[id]["Geospatial Location"] :
                                {
                                    "features": [],
                                    "type":"FeatureCollection"
                                }
                            }
                        }, arches.mapSources);

                        if (self.resourceLookup[id]["Geospatial Location"]) {
                            if (self.resourceLookup[id]["Geospatial Location"]["features"].length > 0) {
                                self.resourceLookup[id].bounds = geojsonExtent({
                                    type: 'FeatureCollection',
                                    features: self.resourceLookup[id]["Geospatial Location"]["features"]
                                });
                                self.resourceLookup[id].fitBoundsOptions = {
                                    padding: 40,
                                    maxZoom: 15
                                };
                            }
                        }
                        ko.applyBindingsToDescendants(
                            self.resourceLookup[id],
                            self.popup._content
                        );
                    });
                } else {
                    ko.applyBindingsToDescendants(
                        self.resourceLookup[id],
                        self.popup._content
                    );
                }
            }
        };
        
        this.onFeatureClick = function(feature, lngLat) {
            var map = self.map();
            self.popup = new mapboxgl.Popup()
                .setLngLat(lngLat)
                .setHTML(self.popupTemplate)
                .addTo(map);
            self.getPopupData(feature);
            // _.extend(this.data, popupData);
            // this.data.getTargetDays = this.getTargetDays;
            // this.data.Name = 'Test Name';
            // if(!this.data["Geospatial Location"]) {
            //     this.data["Geospatial Location"] = {"features": [{"geometry":{"coordinates":[0,0]}}]};
            //     this.data["zoom"] = 0;
            // }
            // if(typeof this.data["Geospatial Location"]["features"][0]["geometry"]["coordinates"][0] != "number") {
            //     this.data["center"] = this.data["Geospatial Location"]["features"][0]["geometry"]["coordinates"][0][0];
            // } else {
            //     this.data["center"] = this.data["Geospatial Location"]["features"][0]["geometry"]["coordinates"];
            // }
            // ko.applyBindingsToDescendants(
            //     this.data,
            //     self.popup._content
            // );
            if (map.getStyle()) map.setFeatureState(feature, { selected: true });
            self.popup.on('close', function() {
                if (map.getStyle()) map.setFeatureState(feature, { selected: false });
                self.popup = undefined;
            });
        };
    };

    ko.components.register('arches-map', {
        viewModel: MapViewModel,
        template: {
            require: 'text!templates/views/components/map.htm'
        }
    });
    return viewModel;
});
