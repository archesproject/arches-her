define([
    'jquery',
    'knockout',
    'underscore',
    'dropzone',
    'uuid',
    'viewmodels/file-widget',
    'templates/views/components/widgets/photo.htm',
    'bindings/gallery',
    'bindings/dropzone'
], function($, ko, _, Dropzone, uuid, FileWidgetViewModel, photoWidgetTemplate) {
    /**
     * registers a file-widget component for use in forms
     * @function external:"ko.components".file-widget
     * @param {object} params
     * @param {string} params.value - the value being managed
     * @param {function} params.config - observable containing config object
     * @param {string} params.config().acceptedFiles - accept attribute value for file input
     * @param {string} params.config().maxFilesize - maximum allowed file size in MB
     */

    return ko.components.register('photo-widget', {
        viewModel: function(params) {
            params.configKeys = ['acceptedFiles', 'maxFilesize'];
            var self = this;
            FileWidgetViewModel.apply(this, [params]);

            this.filesJSON().forEach(function(photo){
                if (ko.unwrap(photo.selected) === undefined || ko.isObservable(photo.selected) === false) {
                    photo.selected = ko.observable(false);
                }
            });

            this.selectedPhoto = ko.observable();

            this.selectedPhoto(this.filesJSON()[0]);

            this.pan = ko.observable()
            this.updatePan = function(val){
                if (this.pan() !== val) {
                    this.pan(val);
                } else {
                    this.pan.valueHasMutated();
                }
            }

            this.selectPhoto = function(photo) {
                self.filesJSON().forEach(function(f) {
                    f.selected(false);
                });
                self.selectedPhoto(photo);
                photo.selected(true);
            };

            this.filesJSON.subscribe(function(val){
                val.forEach(function(photo){
                    if (ko.unwrap(photo.selected) === undefined || ko.isObservable(photo.selected) === false) {
                        photo.selected = ko.observable(false);
                    }
                });
                if (val.length > 1 && self.selectedPhoto() === undefined) {
                    self.selectedPhoto(val[0]);
                }
            })

            this.hoveredOverImage = ko.observable(false);

            this.toggleHoveredOverImage = function(val, event){
                var res = event.target === event.toElement ? true : false;
                this.hoveredOverImage(res);
            };

            this.removeFile = function(file) {
                var filePosition;
                self.filesJSON().forEach(function(f, i) {
                    if (f.file_id === file.file_id) {
                        filePosition = i;
                    }
                });
                var newfilePosition = filePosition === 0 ? 1 : filePosition - 1;
                var filesForUpload = self.filesForUpload();
                var uploadedFiles = self.uploadedFiles();
                if (file.file_id) {
                    file = _.find(uploadedFiles, function(uploadedFile) {
                        return file.file_id ===  ko.unwrap(uploadedFile.file_id);
                    });
                    self.uploadedFiles.remove(file);
                } else {
                    file = filesForUpload[file.index];
                    self.filesForUpload.remove(file);
                }
                if (self.filesJSON().length > 0) {
                    self.selectedPhoto(self.filesJSON()[newfilePosition]);
                }
            };
        },
        template: photoWidgetTemplate
    });

});
