define(['underscore', 'knockout', 'arches', 'utils/report','bindings/datatable'], function(_, ko, arches, reportUtils) {
    return ko.components.register('views/components/reports/scenes/images', {
        viewModel: function(params) {
            const self = this;
            Object.assign(self, reportUtils);

            self.copyrightTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(3).fill(null)
            };

            self.dataConfig = {
                images: 'images'
            }

            self.cards = Object.assign({}, params.cards);
            self.edit = params.editTile || self.editTile;
            self.delete = params.deleteTile || self.deleteTile;
            self.add = params.addTile || self.addNewTile;
            self.images = ko.observableArray();
            self.copyright = ko.observableArray();
            self.visible = {
                copyright: ko.observable(true),
                images: ko.observable(true)
            }
            Object.assign(self.dataConfig, params.dataConfig || {});

            // if params.compiled is set and true, the user has compiled their own data.  Use as is.
            if(params?.compiled){
            } else {
                const imagesNode = self.getRawNodeValue(params.data(), self.dataConfig.images); 
                if(imagesNode?.length) {
                    this.images(imagesNode.map(x => {
                        const caption = self.getNodeValue(x, {
                            testPaths: [
                                ['captions', 'caption'],
                                ['captions', 'captiion'],
                                ['caption notes', 'caption note', '@display_value'],
                            ]
                        });
                        const copyrightHolder = self.getNodeValue(x, 'copyright', 'copyright holder');
                        const copyrightNote = self.getNodeValue(x, 'copyright', 'copyright note', 'copyright note text');
                        const copyrightType = self.getNodeValue(x, 'copyright', 'copyright type');
                        const path = self.getNodeValue(x);
                        const tileid = self.getTileId(x);

                        return { 
                            caption,
                            copyrightHolder,
                            copyrightNote,
                            copyrightType,
                            path,
                            tileid
                        };
                    }));
                }


                const copyrightNode = self.getRawNodeValue(params.data(), self.dataConfig.copyright); 
                if(copyrightNode?.length) {
                    self.copyright(copyrightNode.map(x => {
                        const copyrightStatement = self.getNodeValue(x, 'copyright statement');
                        const copyrightType = self.getNodeValue(x, 'copyright type');
                        const tileid = self.getTileId(x);

                        return { 
                            copyrightStatement,
                            copyrightType,
                            tileid
                        };
                    }));
                }
            } 
        },
        template: { require: 'text!templates/views/components/reports/scenes/images.htm' }
    });
});