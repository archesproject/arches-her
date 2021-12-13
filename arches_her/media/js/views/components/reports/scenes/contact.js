define(['underscore', 'knockout', 'arches', 'utils/report','bindings/datatable'], function(_, ko, arches, reportUtils) {
    return ko.components.register('views/components/reports/scenes/contact', {
        viewModel: function(params) {
            const self = this;
            Object.assign(self, reportUtils);

            self.contactTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(5).fill(null)
            };

            self.dataConfig = {
                contact: 'contact details'
            }

            self.cards = Object.assign({}, params.cards);
            self.edit = params.editTile || self.editTile;
            self.delete = params.deleteTile || self.deleteTile;
            self.add = params.addTile || self.addNewTile;
            self.contact = ko.observableArray();
            self.visible = {
                contact: ko.observable(true),
            }
            Object.assign(self.dataConfig, params.dataConfig || {});

            const contactNode = self.getRawNodeValue(params.data(), self.dataConfig.contact);

            if(contactNode){
                self.contact(contactNode.map(node => {
                    const name = self.getNodeValue(node, 'contact names', 'contact name for correspondence');
                    const currency = self.getNodeValue(node, 'contact names', 'contact name currency');
                    const type = self.getNodeValue(node, 'contact point type');
                    const point = self.getNodeValue(node, 'contact point');
                    const tileid = self.getTileId(node);
                    return { name, currency, point, type, tileid };
                }));
            }

        },
        template: { require: 'text!templates/views/components/reports/scenes/contact.htm' }
    });
});