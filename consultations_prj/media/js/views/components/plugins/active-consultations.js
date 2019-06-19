define([
    'knockout',
    'bindings/chosen',
    'bindings/mapbox-gl'
], function(ko) {
    return ko.components.register('active-consultations',  {
        viewModel: function(params) {
            var self = this;
            this.title = 'Active Consultations';
            this.layout = ko.observable('grid');
            this.setLayout = function(layout){
                self.layout(layout);
            };
            this.mapImageURL = ko.observable('');

            this.setupMap = function(map, data) {
              map.on('load', function() {
                console.log(data)
                self.mapImageURL(map.getCanvas().toDataURL("image/jpeg"));
                data.map_image_url = self.mapImageURL
              })
            }


            this.active_items = [
                {title: '34 Victoria Street, Westminster', description: 'Consultation/Proposal description, limited to just the first few lines in the consultation so that users can quickly scan and see if it is the consultation they are looking for', author: 'Sarah Harrison', consultation_type: 'Planning application - minor'},
                {title: '18 Minster Yard, Kensington', description: 'Consultation/Proposal description, limited to just the first few lines in the consultation so that users can quickly scan and see if it is the consultation they are looking for', author: 'Laura O\'Gorman', consultation_type: 'Planning application - major'},
                {title: 'Bishops Palace, East Hall', description: 'Another description here', author: 'Stewart Cakebread', consultation_type: 'Planning application - major'}
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
