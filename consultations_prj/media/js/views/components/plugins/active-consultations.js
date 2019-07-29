define([
    'knockout',
    'arches',
    'jquery',
    'bindings/chosen',
    'bindings/mapbox-gl'
], function(ko, arches, $) {
    return ko.components.register('active-consultations',  {
        viewModel: function(params) {
            var self = this;
            this.layout = ko.observable('grid');
            this.setLayout = function(layout){
                self.layout(layout);
            };
            this.loading = ko.observable(true);
            this.mapImageURL = ko.observable('');

            this.active_items = ko.observableArray([]);

            this.setupMap = function(map, data) {
                map.on('load', function() {
                    data["mapImageUrl"](map.getCanvas().toDataURL("image/jpeg"));
                });
                $("#map").remove();
            };

            this.getConsultations = $.ajax({
                type: "GET",
                url: arches.urls.root + 'activeconsultations',
                data: {},
                context: self,
                success: function(responseText, status, response){
                    Object.entries(response.responseJSON['tile_dict']).forEach( function(pair) {
                        if(pair[1]['Consultation Type'] == undefined) {
                            pair[1]['Consultation Type'] = '';
                        }
                        pair[1]["mapImageUrl"] = ko.observable(false);
                        if(typeof pair[1]["Geospatial Location"]["features"][0]["geometry"]["coordinates"][0] != "number") {
                            pair[1]["center"] = pair[1]["Geospatial Location"]["features"][0]["geometry"]["coordinates"][0][0];
                        } else {
                            pair[1]["center"] = pair[1]["Geospatial Location"]["features"][0]["geometry"]["coordinates"];
                        }
                        self.active_items.push(pair[1]);
                    });
                    self.loading(false);
                },
                error: function(response, status, error) {
                    if(response.statusText !== 'abort'){
                        this.viewModel.alert(new AlertViewModel('ep-alert-red', arches.requestFailed.title, response.responseText));
                    }
                }
            });

        },
        template: { require: 'text!templates/views/components/plugins/active-consultations.htm' }
    });
});
