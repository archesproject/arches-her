define([
    'knockout',
    'arches',
    'jquery',
    'moment',
    'viewmodels/alert',
    'bindings/chosen',
    'bindings/mapbox-gl'
], function(ko, arches, $, moment, AlertViewModel) {
    return ko.components.register('active-consultations',  {
        viewModel: function(params) {
            var self = this;
            console.log(arches.mapLayers, arches.mapSources);
            this.resourceEditorURL = arches.urls.resource_editor;
            this.moment = moment;
            this.layout = ko.observable('grid');
            this.setLayout = function(layout){ self.layout(layout); };
            this.loading = ko.observable(true);
            // this.mapImageURL = ko.observable('');
            this.active_items = ko.observableArray([]);
            this.page = ko.observable(1); // pages indexed at 1
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

            this.mapLayer = arches.mapLayers.find(function(layerObj){
                return layerObj["maplayerid"] == "f573f1f2-d406-11e9-8594-0b4fc47c70d9";
            });
            this.layers = ko.observable(
                [
                    {
                        "id":"mapbox-streets-layer",
                        "source":"mapbox-streets",
                        "type":"background"
                    },
                    // {
                    //     "id": "app-area-geom",
                    //     "source": "app-area-geom-src",
                    //     "type": "line",
                    //     "paint": {
                    //         "line-color": "#40a9ff"
                    //     }
                    // }
                ]
            );
            
            this.sprite = arches.mapboxSprites;
            this.glyphs = arches.mapboxGlyphs;

            this.setupMap = function(map, data) {
                console.log(data["Geospatial Location"]);
                map.on('load', function() {
                    data["mapImageUrl"](map.getCanvas().toDataURL("image/jpeg"));
                });
                $("#map").remove();
            };

            this.newPage = function(page){ if(page){ this.page(page); }};

            this.page.subscribe(function(timestamp) {
                this.getConsultations();
            }, this);

            this.getConsultations = function() {
                self.active_items.removeAll();
                $.ajax({
                    type: "GET",
                    url: arches.urls.root + 'activeconsultations',
                    data: {"page": self.page()},
                    context: self,
                    success: function(responseText, status, response){
                        Object.entries(response.responseJSON['paginator']).forEach( function(keyPair){
                            self.paginator[keyPair[0]](keyPair[1]);
                        });
                        response.responseJSON['page_results'].forEach( function(consultation, i) {
                            consultation["mapImageUrl"] = ko.observable(false);
                            consultation["zoom"] = 5;
                            if(consultation['Name'] == undefined) { consultation['Name'] = 'Unnamed Consultation'; }
                            if(consultation['Consultation Type'] == undefined) { consultation['Consultation Type'] = ''; }
                            if(!consultation["Geospatial Location"]) {
                                consultation["Geospatial Location"] = {
                                    "features": [{"geometry":{"coordinates":[0,0]}}],
                                    "type":"FeatureCollection"
                                };
                                consultation["zoom"] = 0;
                                consultation["sources"] = {
                                    "app-area-geom-src": {
                                        "type": "geojson",
                                        "data": {}
                                    },
                                    "mapbox-streets": arches.mapSources["mapbox-streets"]
                                }
                            } else {
                                consultation["sources"] = {
                                    "app-area-geom-src": {
                                        "type": "geojson",
                                        "data": consultation["Geospatial Location"]
                                    },
                                    "mapbox-streets": arches.mapSources["mapbox-streets"]
                                }
                            }
                            consultation["layers"] = [
                                {
                                    "id":"mapbox-streets-layer"+i,
                                    "source":"mapbox-streets",
                                    "source-layer":"mapbox-streets",
                                    "type":"background"
                                },
                                {
                                    "id": "app-area-geom"+i,
                                    "source": "app-area-geom-src",
                                    "source-layer":"app-area-geom-src",
                                    "type": "line",
                                    "paint": {
                                        "line-color": "#40a9ff"
                                    }
                                }
                            ]
                            if(typeof consultation["Geospatial Location"]["features"][0]["geometry"]["coordinates"][0] != "number") {
                                consultation["center"] = consultation["Geospatial Location"]["features"][0]["geometry"]["coordinates"][0][0];
                            } else {
                                consultation["center"] = consultation["Geospatial Location"]["features"][0]["geometry"]["coordinates"];
                            }
                            self.active_items.push(consultation);
                        });
                        self.loading(false);
                    },
                    error: function(response, status, error) {
                        if(response.statusText !== 'abort'){
                            this.viewModel.alert(new AlertViewModel('ep-alert-red', arches.requestFailed.title, response.responseText));
                        }
                    }
                });
            }

            if(self.loading()) { self.getConsultations(); }

            this.tableConfig = {
                ajax: {
                    type: "GET",
                    url: arches.urls.root + 'activeconsultations',
                    data: {"page": -1},
                    dataSrc: function(data) {
                        var results = [], consultations = data["results"];
                        consultations.forEach( function(consultation) {
                            results.push([
                                $('<p></p>').text(consultation['Name'])[0].outerHTML,
                                $('<p></p>').text(consultation['Consultation Type'])[0].outerHTML,
                                $('<p></p>').text(consultation['Target Date'])[0].outerHTML,
                                $('<p></p>').text(consultation['Casework Officer'])[0].outerHTML,
                                $('<p></p>').html(consultation['Proposal'])[0].outerHTML
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
        template: { require: 'text!templates/views/components/plugins/active-consultations.htm' }
    });
});
