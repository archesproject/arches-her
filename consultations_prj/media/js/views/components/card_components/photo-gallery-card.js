define([
    'knockout',
    'underscore',
    'dropzone',
    'uuid',
    'viewmodels/card-component',
    'viewmodels/photo-gallery',
    'bindings/slide',
    'bindings/dropzone'
], function(ko, _, Dropzone, uuid, CardComponentViewModel, PhotoGallery) {
    return ko.components.register('photo-gallery-card', {
        viewModel: function(params) {
            params.configKeys = ['acceptedFiles', 'maxFilesize'];
            var self = this;
            CardComponentViewModel.apply(this, [params]);

            this.photoGallery = new PhotoGallery();

            this.getUrl = function(tile){
                var url = '';
                _.each(tile.data,
                    function(v, k) {
                        val = ko.unwrap(v);
                        if (Array.isArray(val)
                            && val.length == 1
                            && (ko.unwrap(val[0].url) || ko.unwrap(val[0].content))) {
                                url = ko.unwrap(val[0].url) || ko.unwrap(val[0].content);
                            }
                        });
                    return url
                };

            this.unique_id = uuid.generate();
            this.uniqueidClass = ko.computed(function() {
                return "unique_id_" + self.unique_id;
            });

            this.showThumbnails = ko.observable(false);

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
                }
            }

            this.removeTile = function(val){
                val.deleteTile();
            }

            this.dropzoneOptions = {
                url: "arches.urls.root",
                dictDefaultMessage: '',
                autoProcessQueue: false,
                autoQueue: false,
                clickable: ".fileinput-button." + this.uniqueidClass(),
                previewsContainer: '#hidden-dz-previews',
                init: function() {
                    self.dropzone = this;
                    this.on("addedfile", function(file) {
                        var newtile;
                        newtile = self.card.getNewTile();
                        console.log('adding tile')
                        var tilevalue = {
                            name: file.name,
                            accepted: true,
                            height: file.height,
                            lastModified: file.lastModified,
                            size: file.size,
                            status: file.status,
                            type: file.type,
                            width: file.width,
                            url: null,
                            file_id: null,
                            index: 0,
                            content: URL.createObjectURL(file),
                            error: file.error
                        };
                        newtile.data['e60af863-5d48-11e9-b44f-c4b301baab9f']([tilevalue]);
                        newtile.formData.append('file-list_' + 'e60af863-5d48-11e9-b44f-c4b301baab9f', file, file.name);
                        self.form.saveTile(newtile);
                    }, self);

                    this.on("error", function(file, error) {
                        file.error = error;
                        console.log(error);
                    });
                }
            };

            this.tabItems = [
                {'name': 'edit', 'icon': 'fa fa-pencil'},
                {'name': 'beta', 'icon': 'fa fa-android'},
            ];

            this.activeTab = ko.observable('edit');
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
