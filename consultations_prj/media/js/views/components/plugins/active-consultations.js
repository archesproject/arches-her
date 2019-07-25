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
            this.title = 'Active Consultations';
            this.layout = ko.observable('grid');
            this.setLayout = function(layout){
                self.layout(layout);
            };
            this.mapData = ko.observable();
            this.loading = ko.observable(true);
            this.mapImageURL = ko.observable('');

            this.active_items = ko.observableArray([]);
            this.listOfIds = [];

            this.setupMap = function(map, data) {
                if(data["80be6194-5675-11e9-8571-dca90488358a"] != undefined) {
                    self.mapData(data["80be6194-5675-11e9-8571-dca90488358a"]);
                } else {
                    self.mapData('mapData');
                }

                map.on('load', function() {
                    data["mapImageUrl"](map.getCanvas().toDataURL("image/jpeg"));
                });
                $("#map").remove();

            };
            this.queryString = "http://localhost:8000/search?paging-filter=1&resource-type-filter=%5B%7B%22graphid%22%3A%228d41e49e-a250-11e9-9eab-00224800b26d%22%2C%22name%22%3A%22GLHER_Consultation_Complex%22%2C%22inverted%22%3Afalse%7D%5D";
            // this.queryString = "http://localhost:8000/search?paging-filter=1&advanced-search=%5B%7B%22op%22%3A%22and%22%2C%228d41e4dd-a250-11e9-9032-00224800b26d%22%3A%7B%22op%22%3A%22%22%2C%22val%22%3A%22%22%7D%2C%228d41e4d5-a250-11e9-b968-00224800b26d%22%3A%7B%22op%22%3A%22%22%2C%22val%22%3A%22%22%7D%2C%228d41e4cc-a250-11e9-87b3-00224800b26d%22%3A%7B%22op%22%3A%22%22%2C%22val%22%3A%22%22%7D%2C%228d41e4d3-a250-11e9-8977-00224800b26d%22%3A%7B%22op%22%3A%22!%22%2C%22val%22%3A%22149f3488-70ba-4ec0-aa49-d37bf879d133%22%7D%7D%5D"

            // this.getConsultations = $.ajax({
            //     type: "GET",
            //     url: arches.urls.search_results,
            //     data: self.queryString,
            //     context: this,
            //     success: function(response) {
            //         response.results.hits.hits.forEach( function(hit) {
            //             console.log(hit);
            //             self.listOfIds.push(hit["_id"]);
                        
            //             // self.active_items.push({"_consultation": hit["_source"], "_id": hit["_id"]});
            //         });
            //         // self.setNodeIds();
            //         self.loading(false);
            //     },
            //     error: function(response, status, error) {
            //         if(this.updateRequest.statusText !== 'abort'){
            //             this.viewModel.alert(new AlertViewModel('ep-alert-red', arches.requestFailed.title, response.responseText));
            //         }
            //     },
            // }).then(self.hitView());

            this.hitView = function() {
                $.ajax({
                    type: "GET",
                    url: arches.urls.root + 'activeconsultations',
                    data: {
                        "instance_ids": self.listOfIds
                    },
                    context: self,
                    success: function(responseText, status, response){
                        console.log(response.responseJSON);
                    },
                    error: function(response, status, error) {
                        console.log(response);
                        if(response.statusText !== 'abort'){
                            this.viewModel.alert(new AlertViewModel('ep-alert-red', arches.requestFailed.title, response.responseText));
                        }
                    }
                });
            }

            this.getConsultations = $.ajax({
                type: "GET",
                url: arches.urls.search_results,
                data: self.queryString,
                context: this,
                success: function(response) {
                    response.results.hits.hits.forEach( function(hit) {
                        console.log(hit);
                        self.listOfIds.push(hit["_id"]);
                        
                        // self.active_items.push({"_consultation": hit["_source"], "_id": hit["_id"]});
                    });
                    // self.setNodeIds();
                    self.loading(false);
                },
                error: function(response, status, error) {
                    if(this.updateRequest.statusText !== 'abort'){
                        this.viewModel.alert(new AlertViewModel('ep-alert-red', arches.requestFailed.title, response.responseText));
                    }
                },
            }).then(self.hitView());

            this.setNodeIds = function() {
                ko.utils.arrayForEach(self.active_items(), function(item) {
                    if(item["_consultation"]) {
                        item["_consultation"]["tiles"].forEach( function(tile) {
                            switch(tile["nodegroup_id"]) {
                                case "04723f59-53f2-11e9-b091-dca90488358a": //consultation details -- concept select (not multi)
                                    item["23f845c0-6d24-11e9-b5d0-dca90488358a"] = tile["data"]["23f845c0-6d24-11e9-b5d0-dca90488358a"]; //Application Type
                                    item["86ebeb8f-6d24-11e9-826c-dca90488358a"] = tile["data"]["86ebeb8f-6d24-11e9-826c-dca90488358a"]; //Consultation Status
                                    item["c24b0e40-6d23-11e9-b710-dca90488358a"] = tile["data"]["c24b0e40-6d23-11e9-b710-dca90488358a"]; //Consultation Type
                                    item["5ee5f3fa-6d24-11e9-8d9d-dca90488358a"] = tile["data"]["5ee5f3fa-6d24-11e9-8d9d-dca90488358a"]; //Development Type
                                    break;
                                case "17c07f07-53f5-11e9-9c94-dca90488358a": //contacts -- resource inst select, multi-select
                                    item["0eb94b28-6c4a-11e9-9cc1-dca90488358a"] = tile["data"]["0eb94b28-6c4a-11e9-9cc1-dca90488358a"]; //Agent
                                    item["20b7d2f5-6c4a-11e9-ba38-dca90488358a"] = tile["data"]["20b7d2f5-6c4a-11e9-ba38-dca90488358a"]; //Application Area Representative
                                    item["36a6c511-6c49-11e9-b450-dca90488358a"] = tile["data"]["36a6c511-6c49-11e9-b450-dca90488358a"]; //Casework Officer
                                    item["f4ed9651-6c49-11e9-8eb7-dca90488358a"] = tile["data"]["f4ed9651-6c49-11e9-8eb7-dca90488358a"]; //Owner
                                    item["d3033421-6c49-11e9-b310-dca90488358a"] = tile["data"]["d3033421-6c49-11e9-b310-dca90488358a"]; //Planning Officer
                                    break;
                                case "f34ebbd4-53f3-11e9-b649-dca90488358a": //proposal -- rich text
                                    item["proposal"] = tile["data"]["f34ebbd4-53f3-11e9-b649-dca90488358a"];
                                    break;
                                case "9dc86b0c-6c48-11e9-8cbe-dca90488358a": //address -- text
                                    item["Postal Code"] = tile["data"]["9dc872f0-6c48-11e9-a2e3-dca90488358a"];
                                    item["Street Number/Name"] = tile["data"]["9dc87480-6c48-11e9-ad10-dca90488358a"];
                                    item["Town/City"] = tile["data"]["9dc870ae-6c48-11e9-aa71-dca90488358a"];
                                    break;
                                case "b979d03d-53f2-11e9-91e4-dca90488358a": //dates -- datepicker (might no longer be in consultation?)
                                    item["0316def5-5675-11e9-8804-dca90488358a"] = tile["data"]["0316def5-5675-11e9-8804-dca90488358a"]; //Completion Date
                                    item["49f806e6-5674-11e9-a5b2-dca90488358a"] = tile["data"]["49f806e6-5674-11e9-a5b2-dca90488358a"]; //Consultation Log Date
                                    item["date_val"] = tile["data"]["eb2bebeb-5674-11e9-8ec3-dca90488358a"]; //Due Date
                                    break;
                                case "80be5b5c-5675-11e9-b68d-dca90488358a": //map -- mapwidget
                                    item["80be6194-5675-11e9-8571-dca90488358a"] = tile["data"]["80be6194-5675-11e9-8571-dca90488358a"];
                                    // console.log(typeof item["80be6194-5675-11e9-8571-dca90488358a"]["features"][0]["geometry"]["coordinates"][0]);
                                    if(typeof item["80be6194-5675-11e9-8571-dca90488358a"]["features"][0]["geometry"]["coordinates"][0] != "number") {
                                        item["center"] = item["80be6194-5675-11e9-8571-dca90488358a"]["features"][0]["geometry"]["coordinates"][0][0];
                                    } else {
                                        item["center"] = item["80be6194-5675-11e9-8571-dca90488358a"]["features"][0]["geometry"]["coordinates"];
                                    }
                                    item["zoom"] = 10;
                                    break;
                                default:
                                    break;
                            }
                        });
                        item["title"] = item["Street Number/Name"]+", "+item["Town/City"];
                        item["author"] = "n/a";
                        item["consultation_type"] = "n/a";
                        // item["date_val"] = "01/01/2020";
                        item["date_label"] = 'Due date';
                        item["application_val"] = "n/a";
                        item["application_label"] = "Type";
                        item["mapImageUrl"] = ko.observable();
                        if(!item["center"]) { item["center"] = [0,0]; }
                        if(!item["zoom"]) { item["zoom"] = 0; }
                        if(!item["proposal"]) { item["proposal"] = "(no proposal)";}
                    }
                });
                self.loading(false);
            };


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
