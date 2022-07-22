define([
    'knockout',
    'arches',
    'jquery',
    'moment',
    'viewmodels/alert',
    'geojson-extent',
    'templates/views/components/plugins/active-consultations.htm',
    'bindings/chosen',
    'bindings/mapbox-gl',
], function(ko, arches, $, moment, AlertViewModel, geojsonExtent, activeConsultationsTemplate) {
    return ko.components.register('active-consultations',  {
        viewModel: function(params) {
            var self = this;

            this.urls = arches.urls;
            this.resourceEditorURL = '/arches-her' + arches.urls.resource_editor;
            this.moment = moment;
            this.layout = ko.observable('grid');
            this.setLayout = function(layout){ self.layout(layout); };
            this.loading = ko.observable(true);
            // this.mapImageURL = ko.observable('');
            this.activeItems = ko.observableArray([]);
            this.page = ko.observable(1); // pages indexed at 1
            this.orderByOption = ko.observable("");
            this.keyword = ko.observable("");
            this.searched = false;
            this.keywordSearch = function() {
                if(self.keyword() && self.keyword() != "") {
                    self.orderByOption("");
                    self.getConsultations();
                    self.searched = true;
                }
            };
            this.resetKeywordSearch = function() {
                self.keyword("");
                self.orderByOption("");
                self.getConsultations();
                self.searched = false;
            };
            this.activeConsulationConfig = { // could pass this into GET req
                "nodes":{
                    "Geospatial Coordinates":"b949053a-184f-11eb-ac4a-f875a44e0e11",
                    "Consultation Name":"4ad69684-951f-11ea-b5c3-f875a44e0e11",
                    "Consultation Type":"8d41e4dd-a250-11e9-9032-00224800b26d",
                    "Proposal Text":"1b0e15ec-8864-11ea-8493-f875a44e0e11",
                    "Target Date Start":"7224417b-893a-11ea-b383-f875a44e0e11",
                    "Casework Officer":"4ea4a197-184f-11eb-9152-f875a44e0e11",
                    "Log Date":"40eff4cd-893a-11ea-b0cc-f875a44e0e11"
                },
                "sort config":{
                    "Log Date: Newest to Oldest":["Log Date",false],
                    "Log Date: Oldest to Newest":["Log Date",true],
                    "Casework Officer: A to Z":["Casework Officer",false],
                    "Casework Officer: Z to A":["Casework Officer",true],
                    "Consultation Type: A to Z":["Consultation Type",false],
                    "Consultation Type: Z to A":["Consultation Type",true],
                    "Consultation Name: A to Z":["Consultation Name",false],
                    "Consultation Name: Z to A":["Consultation Name",true]
                }
            };
            this.sortOptions = ko.observableArray([]);
            Object.keys(this.activeConsulationConfig["sort config"]).forEach(function(key) {
                self.sortOptions.push(key);
            });
            this.orderByOption.subscribe(function(val) {
                if(val) { self.getConsultations(); }
            });
            this.userRequestedNewPage = false;
            this.paginator = {
                current_page: ko.observable(),
                end_index: ko.observable(),
                has_next: ko.observable(),
                has_other_pages: ko.observable(),
                has_previous: ko.observable(),
                next_page_number: ko.observable(),
                previous_page_number: ko.observable(),
                start_index: ko.observable(),
                pages: ko.observable()
            };
            this.tablePageCt = ko.observable(25);
            this.getTargetDays = function(targetdate){
                return moment(targetdate).diff(moment().startOf('day'), 'days');
            };

            var color = "#f0c200";
            this.layers = arches.mapLayers.find(function(layer){
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
            this.layers.unshift({
                "id": "background-fill",
                "type": "background",
                "paint": {
                    "background-color": "#f2f2f2"
                }
            });
            this.sprite = arches.mapboxSprites;
            this.glyphs = arches.mapboxGlyphs;

            this.setupMap = function(map, data) {
                map.on('load', function() {
                    data["mapImageUrl"](map.getCanvas().toDataURL("image/jpeg"));
                });
            };

            this.newPage = function(page){ if(page){ this.page(page); }};

            this.page.subscribe(function(timestamp) {
                this.getConsultations();
            }, this);

            this.getConsultations = function() {
                self.loading(true);
                self.activeItems.removeAll();
                $.ajax({
                    type: "GET",
                    url: arches.urls.root + 'activeconsultations',
                    data: {
                        "page": self.page(),
                        "order": self.orderByOption(),
                        "keyword": self.keyword()
                        // "config": self.activeConsulationConfig
                    },
                    context: self,
                    success: function(responseText, status, response){
                        Object.entries(response.responseJSON['paginator']).forEach( function(keyPair){
                            self.paginator[keyPair[0]](keyPair[1]);
                        });
                        response.responseJSON['page_results'].forEach( function(consultation) {
                            consultation["mapImageUrl"] = ko.observable(false);
                            consultation["zoom"] = 0, consultation["center"] = [0,0]; //defaults

                            consultation.sources = Object.assign({
                                'app-area-geom': {
                                    "type": "geojson",
                                    "data": consultation["Geospatial Coordinates"] ?
                                        consultation["Geospatial Coordinates"] :
                                        {
                                            "features": [],
                                            "type":"FeatureCollection"
                                        }
                                }
                            }, arches.mapSources);
                            if (consultation["Geospatial Coordinates"]) {
                                if (consultation["Geospatial Coordinates"]["features"].length > 0) {
                                    consultation.bounds = geojsonExtent({
                                        type: 'FeatureCollection',
                                        features: consultation["Geospatial Coordinates"]["features"]
                                    });
                                    consultation.fitBoundsOptions = {
                                        padding: 40,
                                        maxZoom: 15
                                    };
                                }
                            }

                            consultation.layers = self.layers;
                            self.activeItems.push(consultation);
                        });
                        self.loading(false);
                    },
                    error: function(response, status, error) {
                        if(response.statusText !== 'abort'){
                            this.viewModel.alert(new AlertViewModel('ep-alert-red', arches.requestFailed.title, response.responseText));
                        }
                    }
                });
            };

            if(self.loading()) { self.getConsultations(); }

            this.tableConfig = {
                ajax: {
                    type: "GET",
                    url: arches.urls.root + 'activeconsultations',
                    data: {"page": -1},
                    dataSrc: function(data) {
                        var results = [], consultations = data["results"];
                        consultations.forEach( function(consultation) {
                            var link= arches.urls.resource+'/'+consultation["resourceinstanceid"];
                            results.push([
                                $('<a></a>').attr("href",link).text(consultation['Consultation Name'])[0].outerHTML,
                                $('<a></a>').attr("href",link).text(consultation['Consultation Type'])[0].outerHTML,
                                $('<a></a>').attr("href",link).text(consultation['Target Date Start'])[0].outerHTML,
                                $('<a></a>').attr("href",link).text(consultation['Casework Officer'])[0].outerHTML,
                                $('<a></a>').attr("href",link).html(consultation['Proposal Text'])[0].outerHTML
                            ]);
                        });
                        return results;
                    }
                },
                dom: "<'row'<'col-sm-6'B><'col-sm-6'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-5'i><'col-sm-7'p>>",
                pageLength: self.tablePageCt()

            };
        },
        template: activeConsultationsTemplate
    });
});
