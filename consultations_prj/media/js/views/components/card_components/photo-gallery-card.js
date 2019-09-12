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
            if (this.card && this.card.activeTab) {
                self.activeTab(this.card.activeTab);
            }

            this.photoGallery = new PhotoGallery();
            this.lastSelected = 0;
            this.selected = ko.observable();
            self.activeTab.subscribe(function(val){self.card.activeTab = val;});
            self.card.tiles.subscribe(function(val){
                if (val.length === 0) {
                    self.activeTab(null);
                }
            });

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
                return url;
            };

            this.uniqueId = uuid.generate();
            this.uniqueidClass = ko.computed(function() {
                return "unique_id_" + self.uniqueId;
            });

            this.showThumbnails = ko.observable(false);

            this.selectDefault = function(){
                var self = this;
                return function() {
                    var selectedIndex = self.card.tiles.indexOf(self.selected());
                    if(self.card.tiles().length > 0 && selectedIndex === -1) {
                        selectedIndex = 0;
                    }
                    self.card.tiles()[selectedIndex];
                    self.photoGallery.selectItem(self.card.tiles()[selectedIndex]);
                };
            };
            this.defaultSelector = this.selectDefault();

            this.displayContent = ko.pureComputed(function(){
                var photo;
                var selected = this.card.tiles().find(
                    function(tile){
                        return tile.selected() === true;
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

            if (this.displayContent() === undefined) {
                var selectedIndex = 0;
                if (
                    this.card.tiles().length > 0 &&
                    this.form &&
                    (ko.unwrap(this.form.selection) && this.form.selection() !== 'root') ||
                    (this.form && !ko.unwrap(this.form.selection))) {
                    this.photoGallery.selectItem(this.card.tiles()[selectedIndex]);
                }
            }

            this.removeTile = function(val){
                //TODO: Upon deletion select the tile to the left of the deleted tile
                //If the deleted tile is the first tile, then select the tile to the right
                // var tileCount = this.parent.tiles().length;
                // var index = this.parent.tiles.indexOf(val);
                val.deleteTile();
                setTimeout(self.defaultSelector, 150);
            };

            this.dropzoneOptions = {
                url: "arches.urls.root",
                dictDefaultMessage: '',
                autoProcessQueue: false,
                autoQueue: false,
                clickable: ".fileinput-button." + this.uniqueidClass(),
                previewsContainer: '#hidden-dz-previews',
                init: function() {
                    var targetNode;
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
                        newtile.save();
                    }, self);

                    this.on("error", function(file, error) {
                        file.error = error;
                    });
                }
            };
        },
        template: {
            require: 'text!templates/views/components/card_components/photo-gallery-card.htm'
        }
    });
});
