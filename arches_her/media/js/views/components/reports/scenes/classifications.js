define(['underscore', 'knockout', 'arches', 'utils/report','bindings/datatable'], function(_, ko, arches, reportUtils) {
    return ko.components.register('views/components/reports/scenes/classifications', {
        viewModel: function(params) {
            const self = this;
            Object.assign(self, reportUtils);

            self.auditTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(7).fill(null)
            };

            self.dataConfig = {
                production: undefined,
                type: undefined,
                activityTimespan: undefined,
                constructionPhase: undefined,
                components: undefined,
                usePhase: undefined,
                dimensions: undefined,
                inscriptions: undefined,
                dates: undefined,
                hlcPhase: undefined,
                organizationCurrency: undefined,
                organizationFormation: undefined
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
                if(self.dataConfig.type){
                    self.typeData = ko.observable({
                        sections:
                            [
                                {
                                    title: 'Type',
                                    data: [{
                                        key: 'Type',
                                        value: self.getRawNodeValue(params.data(), self.dataConfig.type),
                                        type: 'kv'
                                    }]
                                }
                            ]
                    });
                }

                if(self.dataConfig.activityTimespan){
                    self.activityTimespan = ko.observable({
                        sections:
                            [
                                {
                                    title: 'Activity Timespan',
                                    data: [{
                                        key: 'Display Date',
                                        value: self.getNodeValue(params.data(), self.dataConfig.activityTimespan, 'Display Date'),
                                        type: 'kv'
                                    },{
                                        key: 'Activity Start Date',
                                        value: self.getNodeValue(params.data(), self.dataConfig.activityTimespan, 'Activity Start Date'),
                                        type: 'kv'
                                    },{
                                        key: 'Activity End Date',
                                        value: self.getNodeValue(params.data(), self.dataConfig.activityTimespan, 'Activity End Date'),
                                        type: 'kv'
                                    },{
                                        key: 'Activity Date Qualifier',
                                        value: self.getNodeValue(params.data(), self.dataConfig.activityTimespan, 'Activity Date Qualifier'),
                                        type: 'kv'
                                    }]
                                }
                            ]
                    });
                }
            } 

        },
        template: { require: 'text!templates/views/components/reports/scenes/classifications.htm' }
    });
});