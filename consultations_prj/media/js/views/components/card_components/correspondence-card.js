define([
    'knockout',
    'underscore',
    'dropzone',
    'uuid',
    'viewmodels/card-component',
    'bindings/dropzone'
], function(ko, _, Dropzone, uuid, CardComponentViewModel, PhotoGallery) {
    return ko.components.register('correspondence-card', {
        viewModel: function(params) {
            params.configKeys = ['acceptedFiles', 'maxFilesize'];
            var self = this;
            CardComponentViewModel.apply(this, [params]);

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
                        Object.keys(newtile.data).forEach(function(val){
                            if (newtile.datatypeLookup && newtile.datatypeLookup[val] === 'file-list') {
                                targetNode = val;
                            }
                        });
                        newtile.data[targetNode]([tilevalue]);
                        newtile.formData.append('file-list_' + targetNode, file, file.name);
                        self.form.saveTile(newtile);
                    }, self);

                    this.on("error", function(file, error) {
                        file.error = error;
                        console.log(error);
                    });
                }
            };

        },
        template: {
            require: 'text!templates/views/components/card_components/correspondence-card.htm'
        }
    });
});
