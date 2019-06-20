define([
    'knockout',
    'arches',
    'bindings/chosen',
    'bindings/mapbox-gl'
], function(ko, arches) {
    return ko.components.register('active-consultations',  {
        viewModel: function(params) {
            var self = this;
            this.dataReady = ko.observable(false);
            this.title = 'Active Consultations';
            this.layout = ko.observable('grid');
            this.setLayout = function(layout){
                self.layout(layout);
            };
            this.loading = ko.observable(false);
            this.mapImageURL = ko.observable('');

            // this.active_items = ko.observableArray([]);

            this.setupMap = function(map, data) {
              map.on('load', function() {
                console.log(data)
                self.mapImageURL(map.getCanvas().toDataURL("image/jpeg"));
                data.map_image_url = self.mapImageURL
              })
            };
            this.queryString = "http://localhost:8000/search/resources?paging-filter=1&resource-type-filter=%5B%7B%22graphid%22%3A%2208359c2e-53f0-11e9-b212-dca90488358a%22%2C%22name%22%3A%22Consultation%22%2C%22inverted%22%3Afalse%7D%5D&tiles";

            this.getConsultations = $.ajax({
                type: "GET",
                url: arches.urls.search_results,
                data: self.queryString,
                context: this,
                success: function(response) {
                    console.log(response.results.hits.hits);
                    response.results.hits.hits.forEach( function(hit) {
                        self.active_items.push({"_consultation": hit["_source"], "_id": hit["_id"]});
                        self.active_items
                    });
                    self.loading(false);
                    // var data = this.viewModel.searchResults.updateResults(response);
                    // this.viewModel.alert(false);
                },
                error: function(response, status, error) {
                    if(this.updateRequest.statusText !== 'abort'){
                        this.viewModel.alert(new AlertViewModel('ep-alert-red', arches.requestFailed.title, response.responseText));
                    }
                },
            });

            this.iterateKeys = function() {
                Object.keys(tile["data"]).forEach( function(key) { //to copy all node_ids
                    item[key] = tile["data"[key]];
                });
            }

            this.setNodeIds = function() {
                self.active_items.forEach( function(item) {
                    item["tiles"].forEach( function(tile) {
                        switch(tile["nodegroup_id"]) { //to copy only specific node_ids
                            case "04723f59-53f2-11e9-b091-dca90488358a": //consultation details
                                item["23f845c0-6d24-11e9-b5d0-dca90488358a"] = tile["data"["23f845c0-6d24-11e9-b5d0-dca90488358a"]];
                                break;
                        }
                        Object.keys(tile["data"]).forEach( function(key) { //to copy all node_ids
                            item[key] = tile["data"[key]];
                        })
                    })
                })
            }

            this.active_items = [
                {title: '34 Victoria Street, Westminster', description: 'Consultation/Proposal description, limited to just the first few lines in the consultation so that users can quickly scan and see if it is the consultation they are looking for', author: 'Sarah Harrison', consultation_type: 'Planning application - minor', date_val: 'Jan 30 2018', date_label: 'Due date', application_val: 'Post Application', application_label: 'Type'},
                {title: '18 Minster Yard, Kensington', description: 'Consultation/Proposal description, limited to just the first few lines in the consultation so that users can quickly scan and see if it is the consultation they are looking for', author: 'Laura O\'Gorman', consultation_type: 'Planning application - major', date_val: 'Feb 01 2018', date_label: 'Due date', application_val: 'Post Application', application_label: 'Type'},
                {title: 'Bishops Palace, East Hall', description: 'Another description here', author: 'Stewart Cakebread', consultation_type: 'Planning application - major', date_val: 'Feb 05 2018', date_label: 'Due date', application_val: 'Post Application', application_label: 'Type'}
            ];


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
