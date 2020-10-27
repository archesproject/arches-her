define([
    'jquery',
    'underscore',
    'arches',
    'knockout',
    'knockout-mapping',
    'mapbox-gl',
    'moment',
    'viewmodels/map',
    'geojson-extent',
    'text!templates/views/components/map-popup-consultations.htm',
    'bindings/mapbox-gl',
    'bindings/sortable'
], function($, _, arches, ko, koMapping, mapboxgl, moment, MapViewModel, geojsonExtent, popupConsultationsTemplate) {
    var viewModel = function(params){
        var self = this;
        this.resourceLookup = {};

        MapViewModel.apply(this, [params]);

        this.getPopupData = function(feature, callback) {
            var id = feature.properties.resourceinstanceid;
            if (id) {
                if (!self.resourceLookup[id]){
                    $.get(arches.urls.resource_descriptors + id, function(descriptorData) {
                        var data = ko.mapping.fromJS({
                            'loading': true,
                            'displayname': '',
                            'graph_name': '',
                            'map_popup': '',
                            'mapImageUrl': false,
                            'zoom': 17,
                            'center': [0,0],
                        });
                        ko.mapping.fromJS(feature.properties, data);
                        ko.mapping.fromJS(descriptorData, data);
                        data.loading(false);
                        data.sprite = arches.mapboxSprites;
                        data.glyphs = arches.mapboxGlyphs;
                        data.reportURL = arches.urls.resource_report;
                        data.editURL = arches.urls.resource_editor;
                        data.sources= ko.observable(arches.mapSources);
                        data.userid = self.userid;
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
                        data.closePopup = function(){
                            self.popup._content.hide();
                            self.popupMap.remove();
                            self.popup._content.empty();
                            self.searchResultFilter.selectedResourceId('');
                        };
                        data.getTargetDays = function(targetdate){
                            return moment(targetdate()).diff(moment().startOf('day'), 'days');
                        };
                        data.setupMapPopup = function(map) {
                            self.popupMap = map;
                            map.on('load', function() {
                                data["mapImageUrl"](map.getCanvas().toDataURL("image/jpeg"));
                            });
                        };
                        data['Geospatial Location'] = ko.toJS(data['Geospatial Location']);
                        data["mapImageUrl"](false);
                        if (!!data['Application Area'] && !!data['Application Area'].displayValue){
                            var areas = ko.observableArray();
                            data['Application Area'].displayValue().split(',').forEach(function(area, index){
                                areas.push({'display_value': area, 'original_value': data['Application Area'].originalValue().split(',')[index]});
                            });
                            data['Application Area'] = areas;
                        }

                        var dataSources = Object.assign({
                            'app-area-geom': {
                                "type": "geojson",
                                "data": data["Geospatial Location"] ?
                                    data["Geospatial Location"] :
                                    {
                                        "features": [],
                                        "type":"FeatureCollection"
                                    }
                            }
                        }, arches.mapSources);
                        data.sources(dataSources);

                        if (!!data["Geospatial Location"]) {
                            if (data["Geospatial Location"]["features"].length > 0) {
                                var bounds = self.getBounds({
                                    type: 'FeatureCollection',
                                    features: data["Geospatial Location"]["features"]
                                });
                                data["center"]([
                                    (bounds[0][0] + bounds[1][0]) / 2,
                                    (bounds[0][1] + bounds[1][1]) / 2
                                ]);
                            }
                        }
                        
                        data.mapCard = self;
                        data.feature = feature;
                        self.resourceLookup[id] = data;
                        callback(self.resourceLookup[id]);
                    });
                }else{
                    callback(self.resourceLookup[id]);
                }

            }
        };
        
        this.onFeatureClick = function(feature, lngLat) {
            if(!!document.getElementById('map-popup')) {
                if(!!self.popup){
                    self.popupMap.remove();
                    self.popup._content.empty();
                }
                self.popup = {};
                self.popup._content = $('#map-popup');
                self.popup._content.html(popupConsultationsTemplate);
                self.getPopupData(feature, function(data){
                    ko.applyBindingsToDescendants(
                        data,
                        self.popup._content[0]
                    );
                    self.popup._content.show();
                });
                if(!!this.getFilter){
                    self.searchResultFilter = this.getFilter('search-results-consultations');
                    self.searchResultFilter.selectedResourceId(feature.properties.resourceinstanceid);
                    $('.search-result.selected')[0].scrollIntoView({
                        behavior: "smooth", // or "auto" or "instant"
                        block: "start" // or "end"
                    });
                }
            } else {
                if(!!self.popup){
                    self.popup.remove();
                }
                self.popup = new mapboxgl.Popup();
                self.popup.setLngLat(lngLat);
                self.popup.setHTML(this.popupTemplate);
                self.popup.addTo(self.map());
                self.getPopupData(feature, function(data){
                    // forces shape expected by generic arches instance
                    data.showEditButton = false; 
                    if (data.permissions ) {
                        try {
                            data.permissions = JSON.parse(ko.unwrap(data.permissions));
                        } catch (err) {
                            data.permissions = koMapping.toJS(ko.unwrap(data.permissions));
                        }
                        Object.keys(data.permissions).forEach(function(permissionKey) {
                            data.permissions[permissionKey] = ko.observableArray(data.permissions[permissionKey]);
                        });
                        if (data.permissions.users_without_edit_perm().indexOf(self.userid()) === -1) {
                            data.showEditButton = true;
                        }
                    }

                    ko.applyBindingsToDescendants(
                        data,
                        self.popup._content
                    );
                });
                if(!!this.getFilter){
                    self.searchResultFilter = this.getFilter('search-results');
                    self.searchResultFilter.selectedResourceId(feature.properties.resourceinstanceid);
                    $('.search-listing.selected')[0].scrollIntoView({
                        behavior: "smooth", // or "auto" or "instant"
                        block: "start" // or "end"
                    });
                    self.popup.on('close', function(){
                        self.searchResultFilter.selectedResourceId('');
                    });
                }
            }


            if(feature.source){
                if (self.map().getStyle() && feature.id){
                    self.map().setFeatureState(feature, { selected: true });
                }
            }
        };

        this.getBounds = function(geoJson) {
            var boundsArray = geojsonExtent(geoJson);
            return [[boundsArray[0], boundsArray[1]], [boundsArray[2], boundsArray[3]]];
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
