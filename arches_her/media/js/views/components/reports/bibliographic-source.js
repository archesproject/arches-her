define([
    'jquery',
    'underscore',
    'knockout',
    'arches',
    'utils/resource',
    'utils/report',
    'views/components/reports/scenes/name',
    'views/components/reports/scenes/audit',
    'views/components/reports/scenes/default',
    'views/components/reports/scenes/json'
], function($, _, ko, arches, resourceUtils, reportUtils) {
    return ko.components.register('bibliographic-source-report', {
        viewModel: function(params) {
            var self = this;
            params.configKeys = ['tabs', 'activeTabIndex'];
            this.configForm = params.configForm || false;
            this.configType = params.configType || 'header';

            Object.assign(self, reportUtils);
            self.sections = [
                {id: 'source', title: 'Bibliographic Source Details'},
                {id: 'name', title: 'Identifiers'},
                {id: 'description', title: 'Descriptions and Citations'},
                {id: 'classifications', title: 'Source Type'},
                {id: 'publication', title: 'Publication Details'},
                {id: 'resources', title: 'Associated Resources'},
                {id: 'json', title: 'JSON'},
            ];
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('source');

            self.publicationTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(4).fill(null)
            };

            self.sourceNamesTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(4).fill(null)
            };
            self.sourceCreationConfig = {
                ...self.defaultTableConfig,
                columns: Array(5).fill(null)
            };

            self.nameDataConfig = {
                name: 'bibliographic source'
            };

            self.classificationDataConfig = {
                type: 'bibliographic source type'
            };

            self.resourceDataConfig = {
                activities: undefined,
                archive: undefined,
                consultations: undefined,
                assets: undefined,
                files: 'digital file(s)',
                actors: undefined
            };

            self.publication = ko.observableArray();
            self.sourceNames = ko.observableArray();
            self.sourceCreation = ko.observableArray();

            self.nameCards = {};
            self.archiveCards = {};
            self.classificationCards = {};
            self.resourceCards = {};
            self.descriptionCards = {};
            self.copyrightCards = {};
            self.summary = params.summary;
            self.cards = {};
            self.add = params.addTile || self.addNewTile;

            self.visible = {
                publication: ko.observable(true),
                sourceNames: ko.observable(true),
                sourceCreation: ko.observable(true),
            }

            if(params.report.cards){
                const cards = params.report.cards;

                self.cards = self.createCardDictionary(cards)

                self.nameCards = {
                    name: self.cards?.['bibliographic source names'],
                    externalCrossReferences: self.cards?.['external cross references'],
                    systemReferenceNumbers: self.cards?.['system reference numbers'],
                };

                self.classificationCards = {
                    type: self.cards?.['bibliographic source types']
                };

                self.descriptionCards = {
                    descriptions: self.cards?.descriptions,
                    citation: self.cards?.['bibliographic source citation']
                };

                self.resourceCards = {
                    files: self.cards?.['associated digital files']
                };

                self.copyrightCards = {
                    copyright: self.cards?.copyright
                };

                self.sourceCreationCards = {
                    sourceCreation: self.cards?.sourceCreation
                };

                Object.assign(self.cards, {
                    sourceNames: self.cards?.['bibliographic source names'],
                    sourceCreation: self.cards?.['bibliographic source creation']
                })
            }

            const publicationNode = self.getRawNodeValue(self.resource(), 'publication');

            if(publicationNode){
                const place = self.getNodeValue(publicationNode, 'publication event', 'place of publication', 'publication placename', 'publication placename value');
                const date = self.getNodeValue(publicationNode, 'publication event', 'publication time span', 'date of publication');
                const name = self.getNodeValue(publicationNode, 'publication event', 'publishers', 'publisher names', 'publisher');
                const tileid = self.getTileId(publicationNode);

                self.publication([{
                    place,
                    date,
                    name,
                    tileid
                }]);
            }

            const sourceNames =  self.getRawNodeValue(self.resource(), 'bibliographic source names');
            if(Array.isArray(sourceNames)) {
                self.sourceNames(sourceNames.map(node => {
                    const name = self.getNodeValue(node, 'bibliographic source name');
                    const volume = self.getNodeValue(node, 'bibliographic source volume number', 'volume number');
                    const part = self.getNodeValue(node, 'bibliographic source volume part', 'volume part');

                    const tileid = self.getTileId(node);
                    return { name, volume, part, tileid };
                }));
            }

            const sourceCreationNode = self.getRawNodeValue(self.resource(), 'bibliographic source creation')
            if(Array.isArray(sourceCreationNode)) {
                self.sourceCreation(sourceCreationNode.map(x => {
                    const author = self.getNodeValue(x, 'authorship', 'author', 'author names', 'author name');
                    const editor = self.getNodeValue(x, 'editorship', 'editor', 'editor names', 'editor name');
                    const contributor = self.getNodeValue(x, 'contribution', 'contributors', 'contributor names', 'contributor name');
                    const statement = self.getRawNodeValue(x, 'creation statement of responsibility', 'statement of responsibility', '@display_value');
                    const tileid = self.getTileId(x);
                    return {
                        author,
                        editor,
                        contributor,
                        statement,
                        tileid
                    };
                }));
            }

            self.bibliographicSourceData = ko.observable({
                sections:
                    [
                        {
                            title: 'Other',
                            data: [{
                                key: 'Journal or Serial',
                                value: self.getRawNodeValue(self.resource(), 'journal or serial'),
                                type: 'resource',
                                card: self.cards?.['journal or series']
                            },{
                                key: 'Pages',
                                value: self.getNodeValue(self.resource(), 'pages', 'number of pages'),
                                type: 'kv',
                                card: self.cards?.['pages']
                            },{
                                key: 'Page Reference',
                                value: self.getRawNodeValue(self.resource(), 'page references', 'page reference', 'page(s)', '@display_value'),
                                type: 'kv',
                                card: self.cards?.['page reference']
                            }]
                        }
                    ]
            });

        },
        template: { require: 'text!templates/views/components/reports/bibliographic-source.htm' }
    });
});
