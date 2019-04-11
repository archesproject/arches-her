define([
    'jquery',
    'knockout',
    'underscore',
    'dropzone',
    'uuid',
    'viewmodels/file-widget',
    'bindings/dropzone'
], function($, ko, _, Dropzone, uuid, FileWidgetViewModel) {
    /**
    * registers a text-widget component for use in forms
    * @function external:"ko.components".text-widget
    * @param {object} params
    * @param {string} params.value - the value being managed
    * @param {function} params.config - observable containing config object
    * @param {string} params.config().label - label to use alongside the text input
    * @param {string} params.config().placeholder - default text to show in the text input
    */

    return ko.components.register('newfile-widget', {
        viewModel: function(params) {
            params.configKeys = ['acceptedFiles', 'maxFilesize'];
            var self = this;
            FileWidgetViewModel.apply(this, [params]);
            this.selectedFile = ko.observable();
            this.filter = ko.observable("");
            this.filteredList = ko.computed(function() {
                var filter = self.filter();
                filter = filter.toLowerCase();
                var arr = [];
                var lowerName = "";
                if(filter) {
                    self.filesJSON().forEach(function(f, i) {
                        lowerName = f.name.toLowerCase();
                        if(lowerName.includes(filter)) {
                            arr.push(self.filesJSON()[i]);
                        }
                    });
                }
                return arr;
            });

            this.selectedFile(this.filesJSON()[0]);

            this.selectFile = function(sFile) {
                self.selectedFile(sFile);
            };

            this.filesJSON.subscribe(function(val){
                if (val.length > 1 && self.selectedFile() === undefined) {
                    self.selectedFile(val[0]);
                }
            });

            this.showQty = ko.observable();
            this.minQty = ko.computed(function() {
                if(self.filesJSON().length > 5) {
                    return 'visible';
                } else {
                    return 'hidden';
                }
            });

            this.pagedList = function(list) {
                var arr = [];
                var i = 0;
                if(list.length > self.showQty()) {
                    while(arr.length < self.showQty()) {
                        arr.push(list[i++]);
                    }
                    return arr;
                }
                return list;
            }

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
                    self.selectedFile(self.filesJSON()[newfilePosition]);
                }
            };
        },
        template: { 
            require: 'text!widget-templates/newfile'
        }
    });
});
