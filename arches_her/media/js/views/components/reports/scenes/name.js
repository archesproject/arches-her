define(['underscore', 'knockout', 'arches', 'utils/report','bindings/datatable', 'views/components/reports/scenes/table'], function(_, ko, arches, reportUtils) {
    return ko.components.register('views/components/reports/scenes/name', {
        viewModel: function(params) {
            var self = this;
            Object.assign(self, reportUtils);

            self.nameTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(4).fill(null)
            };

            self.identifierTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(3).fill(null)
            };

            self.dataConfig = {
                name: 'names'
            }

            self.cards = Object.assign({}, params.cards);
            self.edit = params.editTile || self.editTile;
            self.delete = params.deleteTile || self.deleteTile;
            self.add = params.addTile || self.addNewTile;
            self.names = ko.observableArray();
            self.identifiers = ko.observableArray();
            self.type = ko.observable();
            self.summary = params.summary || false;
            self.visible = {
                names: ko.observable(true),
                identifiers: ko.observable(true),
                classifications: ko.observable(true)
            }
            Object.assign(self.dataConfig, params.dataConfig || {});

            // if params.compiled is set and true, the user has compiled their own data.  Use as is.
            if(params?.compiled){
                self.names(params.data.names);
                self.identifiers(params.data.identifiers);
                self.type(params.data.type);
            } else {
                const rawNameData = self.getRawNodeValue(params.data(), {
                    testPaths: [
                        ["names"],
                        [self.dataConfig.name], 
                        [`${self.dataConfig.name} names`]
                    ]
                });
                const nameData = Array.isArray(rawNameData) ? rawNameData : [rawNameData]

                self.names(nameData.map(x => {
                    const nameUseType = self.getNodeValue(x, {
                        testPaths: [
                            ['name use type'],
                            [`${self.dataConfig.name} name use type`],
                            [`${self.dataConfig.nameChildren} name use type`]
                        ]});
                    const name = self.getNodeValue(x, {
                        testPaths: [
                            ['name'],
                            [`${self.dataConfig.name} name`],
                            [`${self.dataConfig.nameChildren} name`]
                        ]});
                    const currency = self.getNodeValue(x, {
                        testPaths: [
                            ['name currency'],
                            [`${self.dataConfig.name} name currency`],
                            [`${self.dataConfig.nameChildren} name currency`]
                        ]});

                    const tileid = self.getTileId(x);
                    return { name, nameUseType, currency, tileid }
                }));

                let identifierData = params.data()[self.dataConfig.identifier];
                if(identifierData) {
                    if(identifierData.length === undefined){
                        identifierData = [identifierData]
                    } 

                    self.identifiers(identifierData.map(x => {
                        const type = self.getNodeValue(x,{
                            testPaths: [
                                [`${self.dataConfig.identifier.toLowerCase()}_type`], 
                                ['type']
                            ]});
                        const content = self.getNodeValue(x, {
                            testPaths: [
                                [`${self.dataConfig.identifier.toLowerCase()}_content`], 
                                ['content']
                            ]});

                        const tileid = self.getTileId(x);
                        return { type, content, tileid }
                    }));
                }

                self.type(self.getNodeValue(params.data(), self.dataConfig.type));
            } 

        },
        template: { require: 'text!templates/views/components/reports/scenes/name.htm' }
    });
});