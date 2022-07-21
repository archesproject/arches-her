define([
    'jquery',
    'underscore',
    'knockout',
    'arches',
    'utils/resource',
    'utils/report',
    'templates/views/components/reports/archive-source.htm',
    'views/components/reports/scenes/name',
    'views/components/reports/scenes/json'
], function($, _, ko, arches, resourceUtils, reportUtils, archiveSourceReportTemplate) {
    return ko.components.register('archive-source-report', {
        viewModel: function(params) {
            var self = this;
            params.configKeys = ['tabs', 'activeTabIndex'];
            this.configForm = params.configForm || false;
            this.configType = params.configType || 'header';

            Object.assign(self, reportUtils);
            self.sections = [
                {id: 'name', title: 'Names and Identifiers'},
                {id: 'description', title: 'Descriptions and Citations'},
                {id: 'images', title: 'Images'},
                {id: 'archive', title: 'Archive Holding'},
                {id: 'resources', title: 'Associated Resources'},
                {id: 'json', title: 'JSON'},
            ];
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');

            self.nameDataConfig = {
                name: 'archive source',
            };
            self.descriptionDataConfig = {
                citation: 'bibliographic source citation',
                subject: 'subjects'
            };

            self.imagesDataConfig = {
                copyright: 'copyright_details'
            };

            self.resourceDataConfig = {
                files: 'digital file(s)',
                activities: undefined,
                consultations: undefined,
                assets: undefined,
                period: 'periods',
                actors: undefined
            };

            self.visible = {
                archiveHolding: ko.observable(true)
            }
            self.archiveHolding = ko.observableArray();

            self.nameCards = {};
            self.imagesCards = {};
            self.archiveCards = {};
            self.resourcesCards = {};
            self.classificationCards = {};
            self.descriptionCards = {};
            self.summary = params.summary;
            self.cards = {};

            if(params.report.cards){
                const cards = params.report.cards;

                self.cards = self.createCardDictionary(cards)

                self.nameCards = {
                    name: self.cards?.['archive source names'],
                    externalCrossReferences: self.cards?.['external cross references'],
                    systemReferenceNumbers: self.cards?.['system reference numbers'],
                };

                self.descriptionCards = {
                    descriptions: self.cards?.['descriptions'],
                    citation: self.cards?.['associated bibliographic sources'],
                    subject: self.cards?.['subjects']
                };

                self.imagesCards = {
                    copyright: self.cards?.['copyright details'],
                    images: self.cards?.['images']
                };

                self.resourcesCards = {
                    files: self.cards?.['associated digital files'],
                    period: self.cards?.['associated periods']
                }
            }

            const archiveHoldingNode = self.getRawNodeValue(self.resource(), 'archive holding');

            if(Array.isArray(archiveHoldingNode) && self.cards?.['archive holding']) {
                self.archiveHolding(archiveHoldingNode.map(node => {
                    const tileid = self.getTileId(node);
                    const archiveHoldingTile = self.cards?.['archive holding'].tiles().find(tile => tile.tileid === tileid);
                    const archiveHoldingCards = self.createCardDictionary(archiveHoldingTile.cards);
                    return {
                        tileid,
                        visible: ko.observable(true),
                        data:
                        {
                            section: [{
                                visible: ko.observable(true),
                                card: archiveHoldingCards?.['archive source creation'],
                                tileid: self.getTileId(self.getRawNodeValue(node, 'archive source creation')),
                                title: 'Archive Source Creation',
                                data: [{
                                    key: 'Author',
                                    value: self.getNodeValue(node, 'archive source creation', 'authorship', 'author', 'author names', 'author name'),
                                    type: 'kv'
                                },{
                                    key: 'Editor',
                                    value: self.getNodeValue(node, 'archive source creation', 'editorship', 'editor', 'editor names', 'editor name'),
                                    type: 'kv'
                                },{
                                    key: 'Contribution',
                                    value: self.getNodeValue(node, 'archive source creation', 'contribution', 'contributors', 'contributor names', 'contributor name'),
                                    type: 'kv'
                                },{
                                    key: 'Statement of Responsibility',
                                    value: self.getNodeValue(node, 'archive source creation', 'creation statement of responsibility', 'statement of responsibility'),
                                    type: 'kv'
                                }]
                            }, {
                                visible: ko.observable(true),
                                card: archiveHoldingCards?.['repository storage location'],
                                tileid: self.getTileId(self.getRawNodeValue(node, 'repository storage location')),
                                title: 'Repository Storage Location',
                                data: [{
                                    key: 'Owner',
                                    value: self.getRawNodeValue(node, 'repository storage location', 'repository owner'),
                                    type: 'resource'
                                },{
                                    key: 'Storage Area Name',
                                    value: self.getNodeValue(node, 'repository storage location', 'storage area names', 'storage area name'),
                                    type: 'kv'
                                },{
                                    key: 'Storage Building',
                                    value: self.getNodeValue(node, 'repository storage location', 'storage building', 'storage building name'),
                                    type: 'kv'
                                }]
                            }, {
                                visible: ko.observable(true),
                                card: archiveHoldingCards?.['extent'],
                                tileid: self.getTileId(self.getRawNodeValue(node, 'extent')),
                                title: 'Extent',
                                data: [{
                                    key: 'Measurement Unit',
                                    value: self.getNodeValue(node, 'extent', 'extent measurement unit'),
                                    type: 'kv'
                                },{
                                    key: 'Quantity',
                                    value: self.getNodeValue(node, 'extent', 'quantity'),
                                    type: 'kv'
                                }]
                            }]
                        }
                }}))
            }

        },
        template: archiveSourceReportTemplate
    });
});
