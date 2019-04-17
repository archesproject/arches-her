define([
    'knockout',
    'underscore',
    'viewmodels/card-component',
    'viewmodels/photo-gallery'
], function(ko, _, CardComponentViewModel, PhotoGallery) {
    return ko.components.register('photo-gallery-card', {
        viewModel: function(params) {
            params.configKeys = ['acceptedFiles', 'maxFilesize'];
            var self = this;
            CardComponentViewModel.apply(this, [params]);

            this.photoGallery = new PhotoGallery();


            this.getUrl = function(tile){
                _.each(tile.data,
                    function(v, k) {
                        val = ko.unwrap(v);
                        if (Array.isArray(val)
                            && val.length == 1
                            && (ko.unwrap(val[0].url) || ko.unwrap(val[0].content))) {
                                url = ko.unwrap(val[0].url) || ko.unwrap(val[0].content);
                            }
                        });
                    console.log(url)
                    return url
                };

            // getUrl should instead be a function that takes a tile and returns it's url

            this.displayContent = ko.pureComputed(function(){
                var photo;
                var selected = this.card.tiles().find(
                    function(tile){
                        return tile.selected() === true
                    });
                if (selected) {
                        photo = this.getUrl(selected);
                    }
                return photo;
            }, this);

            if (!this.displayContent()) {
                if (this.card.tiles().length > 0) {
                    this.card.tiles()[0].selected(true)
                }
            }


            this.dropzoneOptions = {
                url: "arches.urls.root",
                dictDefaultMessage: '',
                autoProcessQueue: false,
                autoQueue: false,
                previewsContainer: '#hidden-dz-previews',
                init: function() {
                    self.dropzone = this;
                    this.on("addedfile", function(file) {
                        var newtile;
                        newtile = self.card.getNewTile();
                        newtile.data['e60af863-5d48-11e9-b44f-c4b301baab9f'](file);
                        self.form.saveTile(newtile);
                    }, self);

                    this.on("error", function(file, error) {
                        file.error = error;
                        console.log(error);
                    });
                }
            };

            this.tabItems = [
                {'name': 'alpha', 'icon': 'fa fa-android'},
                {'name': 'beta', 'icon': 'fa fa-anchor'},
                {'name': 'delta', 'icon': 'fa fa-camera'}
            ];

            this.activeTab = ko.observable();
            this.setActiveTab = function(tabname){
                var name = this.activeTab() === tabname ? '' : tabname;
                this.activeTab(name);
            };

        },
        template: {
            require: 'text!templates/views/components/card_components/photo-gallery-card.htm'
        }
    });
});
