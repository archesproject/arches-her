define(['underscore', 'knockout', 'arches', 'utils/report','bindings/datatable'], function(_, ko, arches, reportUtils) {
    return ko.components.register('views/components/reports/scenes/audit', {
        viewModel: function(params) {
            const self = this;
            Object.assign(self, reportUtils);

            self.auditTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(7).fill(null)
            };

            self.dataConfig = {
                audit: 'audit metadata',
                resource: 'resource model type'
            }

            self.cards = Object.assign({}, params.cards);
            self.edit = params.editTile || self.editTile;
            self.delete = params.deleteTile || self.deleteTile;
            self.add = params.addTile || self.addNewTile;
            self.audit = ko.observable();
            self.visible = {
                audit: ko.observable(true),
            }
            Object.assign(self.dataConfig, params.dataConfig || {});

            // if params.compiled is set and true, the user has compiled their own data.  Use as is.
            if(params?.compiled){
                self.audit(params.data.audit);
            } else {
                const auditData = self.getRawNodeValue(params.data(), self.dataConfig.audit);
                if(auditData) {
                    const audit = {};
                    audit.creationDate = self.getNodeValue(auditData, 'audit creation', 'creation timespan', 'creation date');
                    audit.creator =  self.getNodeValue(auditData, 'audit creation', 'creator', 'creator names', 'creator name');
                    audit.updateDate = self.getNodeValue(auditData, 'audit update', 'update timespan', 'date of last update');
                    audit.updater =  self.getNodeValue(auditData, 'audit update', 'updater', 'updater names', 'updater name');
                    audit.validation = self.getNodeValue(auditData, 'validation');
                    audit.note = self.getNodeValue(auditData, 'audit notes', 'audit note');
                    audit.tileid = self.getTileId(auditData)
                    self.audit(audit);
                }

                self.resourceData =  ko.observable({
                    sections:
                        [
                            {
                                title: 'Type',
                                data: [{
                                    key: 'Resource Model Type',
                                    value: self.getNodeValue(params.data(), self.dataConfig.resource),
                                    type: 'kv',
                                    card: self.cards?.['type']
                                }]
                            }
                        ]
                });

            } 

        },
        template: { require: 'text!templates/views/components/reports/scenes/audit.htm' }
    });
});