define([
    'knockout',
    'knockout-mapping',
    'underscore',
    'dropzone',
    'uuid',
    'viewmodels/card-component',
    'views/components/workbench',
    'viewmodels/photo-gallery',
    'bindings/slide',
    'bindings/fadeVisible',
    'bindings/dropzone'
], function(ko, koMapping, _, Dropzone, uuid, CardComponentViewModel, WorkbenchComponentViewModel, PhotoGallery) {
    return ko.components.register('photo-gallery-card', {
        viewModel: function(params) {
            params.configKeys = ['acceptedFiles', 'maxFilesize'];
            var self = this;
            CardComponentViewModel.apply(this, [params]);
            WorkbenchComponentViewModel.apply(this, [params]);
            this.photoGallery = new PhotoGallery();
            this.lastSelected = 0;
            this.selected = ko.observable();
            this.selected.subscribe(function(val){
                if (val && val.data) {
                    console.log('val', koMapping.toJS(val.data));
                }
            })

            this.getUrl = function(tile){
                var url = '';
                _.each(tile.data,
                    function(v, k) {
                        var val = ko.unwrap(v);
                        if (Array.isArray(val)
                            && val.length == 1
                            && (ko.unwrap(val[0].url) || ko.unwrap(val[0].content))) {
                            url = ko.unwrap(val[0].url) || ko.unwrap(val[0].content);
                        }
                    });
                console.log('returning url', url);
                return url;
            };

            this.unique_id = uuid.generate();
            this.uniqueidClass = ko.computed(function() {
                return "unique_id_" + self.unique_id;
            });

            this.showThumbnails = ko.observable(false);

            this.selectDefault = function(){
                var self = this;
                return function() {
                    var selectedIndex = self.card.tiles.indexOf(self.selected())
                    if(self.card.tiles().length > 0 && selectedIndex === -1) {
                        selectedIndex = 0;
                    }
                    self.card.tiles()[selectedIndex]
                    self.photoGallery.selectItem(self.card.tiles()[selectedIndex])
                }
            };
            this.defaultSelector = this.selectDefault();

            this.displayContent = ko.pureComputed(function(){
                var photo;
                var selectedIndex = 0;
                var selected = this.card.tiles().find(
                    function(tile){
                        console.log(tile);
                        return tile.selected() === true
                    });
                if (selected) {
                    this.selected(selected);
                    photo = this.getUrl(selected);
                }
                else {
                    this.selected(undefined);
                }
                return photo;
            }, this);

            if (!this.displayContent()) {
                var selectedIndex = 0;
                console.log(this.card.tiles())
                // if (this.card.tiles().length > 0) {
                //     this.photoGallery.selectItem(this.card.tiles()[selectedIndex])
                // }
            }

            this.removeTile = function(val){
                var tileCount = this.parent.tiles().length;
                var index = this.parent.tiles.indexOf(val);
                val.deleteTile();
                setTimeout(self.defaultSelector, 150);
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
                        self.saveTile(newtile);
                    }, self);

                    this.on("error", function(file, error) {
                        file.error = error;
                        console.log(error);
                    });
                }
            };
        },
        template: {
            require: 'text!templates/views/components/card_components/photo-gallery-card.htm'
        }
    });
});
