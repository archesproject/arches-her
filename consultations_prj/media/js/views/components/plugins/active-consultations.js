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
            this.resourceEditorURL = '/consultations' + arches.urls.resource_editor;
            this.moment = moment;
            this.layout = ko.observable('grid');
            this.setLayout = function(layout){ self.layout(layout); };
            this.loading = ko.observable(true);
            this.mapImageURL = ko.observable('');
            this.active_items = ko.observableArray([]);
            this.page = ko.observable(1); // pages indexed at 1
            this.sortOptions = [
                "Log Date: Newest to Oldest",
                "Log Date: Oldest to Newest",
                "Casework Officer: A to Z",
                "Casework Officer: Z to A",
                "Consultation Type: A to Z",
                "Consultation Type: Z to A",
                "Consultation Name: A to Z",
                "Consultation Name: Z to A"
            ];
            this.orderByOption = ko.observable();
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

            this.setupMap = function(map, data) {
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
                    data: {
                        "page": self.page(),
                        "order": self.orderByOption()
                    },
                    context: self,
                    success: function(responseText, status, response){
                        Object.entries(response.responseJSON['paginator']).forEach( function(keyPair){
                            self.paginator[keyPair[0]](keyPair[1]);
                        });
                        response.responseJSON['page_results'].forEach( function(consultation) {
                            consultation["mapImageUrl"] = ko.observable(false);
                            consultation["zoom"] = 15;
                            if(consultation['Name'] == undefined) { consultation['Name'] = 'Unnamed Consultation'; }
                            if(consultation['Consultation Type'] == undefined) { consultation['Consultation Type'] = ''; }
                            if(!consultation["Geospatial Location"]) {
                                consultation["Geospatial Location"] = {"features": [{"geometry":{"coordinates":[0,0]}}]};
                                consultation["zoom"] = 0;
                            }
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
