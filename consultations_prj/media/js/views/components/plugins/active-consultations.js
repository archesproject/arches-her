define([
    'knockout',
    'arches',
    'jquery',
    'moment',
    'bindings/chosen',
    'bindings/mapbox-gl'
], function(ko, arches, $, moment) {
    return ko.components.register('active-consultations',  {
        viewModel: function(params) {
            var self = this;
            this.moment = moment;
            this.layout = ko.observable('grid');
            this.setLayout = function(layout){ self.layout(layout); };
            this.loading = ko.observable(true);
            this.mapImageURL = ko.observable('');
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
            this.getTargetDays = function(targetdate){
                return moment(targetdate).diff(moment().startOf('day'), 'days')
            }

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
                    data: {"page": self.page()},
                    context: self,
                    success: function(responseText, status, response){
                        Object.entries(response.responseJSON['paginator']).forEach( function(keyPair){
                            self.paginator[keyPair[0]](keyPair[1]);
                        });
                        response.responseJSON['page_results'].forEach( function(consultation) {
                            consultation["mapImageUrl"] = ko.observable(false);
                            consultation["zoom"] = 15;
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

            if(self.loading()) {
                self.getConsultations();
            }
        },
        template: { require: 'text!templates/views/components/plugins/active-consultations.htm' }
    });
});
