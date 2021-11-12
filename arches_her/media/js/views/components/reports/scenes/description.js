define(['underscore', 'knockout', 'arches', 'utils/report','bindings/datatable'], function(_, ko, arches, reportUtils) {
    return ko.components.register('views/components/reports/scenes/description', {
        viewModel: function(params) {
            const self = this;
            Object.assign(self, reportUtils);

            self.descriptionTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(3).fill(null)
            };

            self.dataConfig = {
                descriptions: 'descriptions',
            }

            self.cards = Object.assign({}, params.cards);
            self.edit = params.editTile || self.editTile;
            self.delete = params.deleteTile || self.deleteTile;
            self.add = params.addTile || self.addNewTile;
            self.descriptions = ko.observableArray();
            self.visible = {
                descriptions: ko.observable(true),
            }
            Object.assign(self.dataConfig, params.dataConfig || {});

            // if params.compiled is set and true, the user has compiled their own data.  Use as is.
            if(params?.compiled){
                self.descriptions(params.data.descriptions);
            } else {
                const rawDescriptionData = self.getRawNodeValue(params.data(), self.dataConfig.descriptions);
                const descriptionData = rawDescriptionData ? Array.isArray(rawDescriptionData) ? rawDescriptionData : [rawDescriptionData] : undefined; 
                if(descriptionData) {
                    self.descriptions(descriptionData.map(x => {
                        const type = self.getNodeValue(x, {
                            testPaths: [
                                [`${self.dataConfig.descriptions.slice(0,-1)} type`]
                            ]});
                        const content = self.getNodeValue(x, {
                            testPaths: [
                                [self.dataConfig.descriptions.slice(0,-1)]
                            ]});

                        const tileid = self.getTileId(x);
                        return { type, content, tileid };
                    }));
                }

            } 

        },
        template: { require: 'text!templates/views/components/reports/scenes/description.htm' }
    });
});