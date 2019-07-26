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
            this.dataReady = ko.observable(false);
            // this.title = 'Active Consultations';
            this.layout = ko.observable('grid');
            this.setLayout = function(layout){
                self.layout(layout);
            };
            // this.mapData = ko.observable();
            this.loading = ko.observable(true);
            this.mapImageURL = ko.observable('');

            this.active_items = ko.observableArray([]);

            this.setupMap = function(map, data) {
                map.on('load', function() {
                    data["mapImageUrl"](map.getCanvas().toDataURL("image/jpeg"));
                });
                $("#map").remove();

            };
            this.queryString = {
                "advanced-search": [
                    {"op":"and","8d41e4dd-a250-11e9-9032-00224800b26d":{"op":"","val":""},"8d41e4d5-a250-11e9-b968-00224800b26d":{"op":"","val":""},"8d41e4cc-a250-11e9-87b3-00224800b26d":{"op":"","val":""},"8d41e4d3-a250-11e9-8977-00224800b26d":{"op":"!","val":"149f3488-70ba-4ec0-aa49-d37bf879d133"}},{"op":"and","8d41e4dd-a250-11e9-9032-00224800b26d":{"op":"","val":""},"8d41e4d5-a250-11e9-b968-00224800b26d":{"op":"","val":""},"8d41e4cc-a250-11e9-87b3-00224800b26d":{"op":"","val":""},"8d41e4d3-a250-11e9-8977-00224800b26d":{"op":"!","val":"7b3c5855-10f4-4b7f-807b-b68397535613"}}
                ]
            }

            this.getConsultations = $.ajax({
                type: "GET",
                url: arches.urls.root + 'activeconsultations',
                data: {},
                context: self,
                success: function(responseText, status, response){
                    Object.entries(response.responseJSON['tile_dict']).forEach( function(pair) {
                        console.log(pair[1]);
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
                    console.log(response.responseJSON);
                    self.loading(false);
                },
                error: function(response, status, error) {
                    console.log(response);
                    if(response.statusText !== 'abort'){
                        this.viewModel.alert(new AlertViewModel('ep-alert-red', arches.requestFailed.title, response.responseText));
                    }
                }
            });



            // this.doQuery = function() {
            //     var queryString = this.queryString();
            //     queryString.page = this.viewModel.searchResults.page();
            //     if (this.updateRequest) {
            //         this.updateRequest.abort();
            //     }

            //     this.viewModel.loading(true);

            //     this.updateRequest = $.ajax({
            //         type: "GET",
            //         url: arches.urls.search_results,
            //         data: queryString,
            //         context: this,
            //         success: function(response) {
            //             var data = this.viewModel.searchResults.updateResults(response);
            //             this.viewModel.alert(false);
            //         },
            //         error: function(response, status, error) {
            //             if(this.updateRequest.statusText !== 'abort'){
            //                 this.viewModel.alert(new AlertViewModel('ep-alert-red', arches.requestFailed.title, response.responseText));
            //             }
            //         },
            //         complete: function(request, status) {
            //             this.viewModel.loading(false);
            //             this.updateRequest = undefined;
            //             window.history.pushState({}, '', '?' + $.param(queryString).split('+').join('%20'));
            //         }
            //     });
            // }



        },
        template: { require: 'text!templates/views/components/plugins/active-consultations.htm' }
    });
});
