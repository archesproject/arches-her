define(['underscore', 'knockout', 'arches', 'utils/report','bindings/datatable'], function(_, ko, arches, reportUtils) {
    return ko.components.register('views/components/reports/scenes/people', {
        viewModel: function(params) {
            const self = this;
            Object.assign(self, reportUtils);

            // Scientific Dates table configuration
            self.peopleTableConfig = {
                ...self.defaultTableConfig,
                paging: true,
                searching: true,
                scrollY: "250px",
                columns: Array(7).fill(null)
            };

            self.dataConfig = {
                people: 'associated actors',
            }

            self.cards = Object.assign({}, params.cards);
            self.edit = params.editTile || self.editTile;
            self.delete = params.deleteTile || self.deleteTile;
            self.add = params.addTile || self.addNewTile;
            self.people = ko.observableArray();
            self.visible = {
                people: ko.observable(true),
            }
            Object.assign(self.dataConfig, params.dataConfig || {});

            // if params.compiled is set and true, the user has compiled their own data.  Use as is.
            if(params?.compiled){
            } else {
                const peopleNode = self.getRawNodeValue(params.data(), self.dataConfig.people); 
                if(peopleNode?.length){
                    self.people(peopleNode.map(x => {
                        const actor = self.getNodeValue(x, 'associated actor', 'actor');
                        const role = self.getNodeValue(x, 'associated actor', 'role type');
                        const startOfRole = self.getNodeValue(x, 'associated actor', 'associated actor timespan', 'associated actor start date');
                        const endOfRole = self.getNodeValue(x, 'associated actor', 'associated actor timespan', 'associated actor end date');
                        const displayDate = self.getNodeValue(x, 'associated actor', 'associated actor timespan', 'associated actor display date');
                        const dateQualifier = self.getNodeValue(x, 'associated actor', 'associated actor timespan', 'associated actor date qualifier');
                        const tileid = self.getTileId(x); 
                        return {
                            actor,
                            role,
                            startOfRole,
                            endOfRole,
                            displayDate,
                            dateQualifier,
                            tileid
                        };
                    }));
                }
            } 
        },
        template: { require: 'text!templates/views/components/reports/scenes/people.htm' }
    });
});