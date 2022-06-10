define(['underscore', 'knockout', 'arches', 'utils/report','bindings/datatable'], function(_, ko, arches, reportUtils) {
    return ko.components.register('views/components/reports/scenes/description', {
        viewModel: function(params) {
            const self = this;
            Object.assign(self, reportUtils);

            //Related Resource 2 column table configuration
            self.relatedResourceTwoColumnTableConfig = {
                ...self.defaultTableConfig,
                "paging": true,
                "searching": true,
                "scrollY": "250px",
                "columns": Array(2).fill(null)
            };

            self.descriptionTableConfig = {
                ...self.defaultTableConfig,
                "columns": [
                    { "width": "70%" },
                    { "width": "20%" },
                    null,
                ]
            };

            self.citationTableConfig = {
                ...self.defaultTableConfig,
                "columns": [
                    { "width": "90%" },
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
                ]
            };

            self.dataConfig = {
                descriptions: 'descriptions'
            }

            self.cards = Object.assign({}, params.cards);
            self.edit = params.editTile || self.editTile;
            self.delete = params.deleteTile || self.deleteTile;
            self.add = params.addTile || self.addNewTile;
            self.citations = ko.observableArray();
            self.descriptions = ko.observableArray();
            self.audience = ko.observableArray();
            self.subjectData = ko.observable();
            self.visible = {
                descriptions: ko.observable(true),
                citation: ko.observable(true),
                audience: ko.observable(true)
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
                        const content = self.getRawNodeValue(x, {
                            testPaths: [
                                [self.dataConfig.descriptions.slice(0,-1), '@display_value']
                            ]});

                        const tileid = self.getTileId(x);
                        return { type, content, tileid };
                    }));
                }

                const rawCitationData = self.getRawNodeValue(params.data(), self.dataConfig.citation);
                const citationData = rawCitationData ? Array.isArray(rawCitationData) ? rawCitationData : [rawCitationData] : undefined;
                if(citationData) {
                    self.citations(citationData.map(x => {
                        const link = self.getResourceLink(x);
                        const linkText = self.getNodeValue(x);
                        const sourceNumber = self.getNodeValue(x, 'source number', 'source number value');
                        const pages = self.getNodeValue(x, 'pages', 'page(s)');
                        const figures = self.getNodeValue(x, 'figures', 'figs.');
                        const plates = self.getNodeValue(x, 'plates', 'plate(s)');
                        const comment = self.getNodeValue(x, 'source comment', 'comment')
                        const tileid = self.getTileId(x);
                        return { link, linkText, sourceNumber, pages, figures, plates, comment, tileid };
                    }));
                }

                const rawAudienceTypeNode = self.getRawNodeValue(params.data(), self.dataConfig.audience);
                const audienceTypeNode = rawAudienceTypeNode ? Array.isArray(rawAudienceTypeNode) ? rawAudienceTypeNode : [rawAudienceTypeNode] : undefined;
                if(audienceTypeNode){
                    self.audience(audienceTypeNode.map(x => {
                        const audienceTypeList = self.getRawNodeValue(x, '@display_value');
                        var audienceType = audienceTypeList.replace(/,/g, ", ");
                        const tileid = self.getTileId(x);
                        return {audienceType, tileid};
                    }));
                }


                if(self.dataConfig.subject){
                    self.subjectData = ko.observable({
                        sections:
                            [
                                {
                                    title: 'Archive Subject',
                                    data: [{
                                        key: 'Subject',
                                        value: self.getRawNodeValue(params.data(), self.dataConfig.subject),
                                        type: 'kv',
                                        card: self.cards?.subject
                                    }]
                                }
                            ]
                    });
                }
            }

        },
        template: { require: 'text!templates/views/components/reports/scenes/description.htm' }
    });
});