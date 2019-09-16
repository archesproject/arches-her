define([
    'jquery',
    'knockout',
    'underscore',
    'dropzone',
    'uuid',
    'viewmodels/file-widget',
    'bindings/dropzone'
], function($, ko, _, Dropzone, uuid, FileWidgetViewModel) {

    return ko.components.register('newfile-widget', {
        viewModel: function(params) {
            params.configKeys = ['acceptedFiles', 'maxFilesize', 'maxFiles'];
            var self = this;
            FileWidgetViewModel.apply(this, [params]);
            self.dropzoneOptions.uploadMultiple = true;
            this.filter = ko.observable("");
            this.filteredList = ko.computed(function() {
                var arr = [], lowerName = "";
                if(self.filter().toLowerCase()) {
                    self.filesJSON().forEach(function(f, i) {
                        lowerName = f.name.toLowerCase();
                        if(lowerName.includes(filter)) { arr.push(self.filesJSON()[i]); }
                    });
                }
                return arr;
            });
            this.selectedFile = ko.observable(self.filesJSON()[0]);
            this.selectFile = function(sFile) { self.selectedFile(sFile); }
            this.filesJSON.subscribe(function(val){
                if (val.length > 1 && self.selectedFile() === undefined) { self.selectedFile(val[0]); }
            });

            this.pageCt = ko.observable(5);
            this.pageCtReached = ko.computed(function() {
                return (self.filesJSON().length > self.pageCt() ? 'visible' : 'hidden');
            });

            this.pagedList = function(list) {
                var arr = [], i = 0;
                if(list.length > self.pageCt()) {
                    while(arr.length < self.pageCt()) { arr.push(list[i++]); }
                    return arr;
                }
                return list;
            }

            this.removeFile = function(file) {
                var filePosition;
                self.filesJSON().forEach(function(f, i) { if (f.file_id === file.file_id) { filePosition = i; } });
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
                if (self.filesJSON().length > 0) { self.selectedFile(self.filesJSON()[newfilePosition]); }
            };
        },
        template: { require: 'text!widget-templates/newfile' }
    });
});
