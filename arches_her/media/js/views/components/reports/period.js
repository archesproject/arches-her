define([
    'jquery',
    'underscore',
    'knockout',
    'arches',
    'utils/resource',
    'utils/report',
    'views/components/reports/scenes/name',
    'views/components/reports/scenes/json'
], function($, _, ko, arches, resourceUtils, reportUtils) {
    return ko.components.register('period-report', {
        viewModel: function(params) {
            var self = this;
            params.configKeys = ['tabs', 'activeTabIndex'];
            this.configForm = params.configForm || false;
            this.configType = params.configType || 'header';

            Object.assign(self, reportUtils);
            self.sections = [
                {id: 'period', title: 'Period Names'},
                {id: 'name', title: 'Names and Identifiers'},
                {id: 'description', title: 'Descriptions and Citations'},
                {id: 'classifications', title: 'Classifications and Dating'},
                {id: 'location', title: 'Location Data'},
                {id: 'json', title: 'JSON'},
            ];
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');
            self.names = ko.observableArray();

            self.nameTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(3).fill(null)
            };

            self.nameDataConfig = {
                name: undefined,
                parent: 'parent period'
            };

            self.descriptionDataConfig = {
                descriptions: 'period descriptions',
            };

            self.locationDataConfig = {
                location: [],
                addresses: undefined,
                nationalGrid: undefined,
                locationDescription: undefined,
                administrativeAreas: undefined
            }

            self.classificationDataConfig = {
                dates: 'period dates',
                type: 'period type'
            };

            self.nameCards = {};
            self.locationCards = {};
            self.descriptionCards = {};
            self.classificationCards = {};
            self.summary = params.summary;
            self.cards = {};

            self.visible = {
                names: ko.observable(true)
            };

            if(params.report.cards){
                const cards = params.report.cards;
                
                self.cards = self.createCardDictionary(cards)

                self.nameCards = {
                    name: self.cards?.['preferred period names'],
                    externalCrossReferences: self.cards?.['external cross references'],
                    systemReferenceNumbers: self.cards?.['system reference numbers'],
                    parent: self.cards?.['parent period']
                };

                self.descriptionCards = {
                    descriptions: self.cards?.['period descriptions'],
                };

                Object.assign(self.cards, {
                    name: self.cards?.['alternative names']
                });

                self.classificationCards = {
                    type: self.cards?.['period types'],
                    dates: self.cards?.dates
                };

                self.locationCards = {
                    cards: self.cards,
                    location: {
                        card: null,
                        subCards: {
                            locationGeometry: 'spatial extent'
                        }
                    }
                }
            }

            const alternativeNameNode = self.getRawNodeValue(self.resource(), 'alternative names');

            if(Array.isArray(alternativeNameNode)) {
                self.names(alternativeNameNode.map(node => {
                    const name = self.getNodeValue(node, 'alternative name');
                    const currency = self.getNodeValue(node, 'alternative name currency type');
                    const tileid = self.getTileId(node);
                    return { name, currency, tileid }
                }));
            }

            self.periodNameData = ko.observable({
                sections:
                    [
                        {
                            title: 'Period Names',
                            data: [{
                                key: 'Name',
                                value: self.getNodeValue(self.resource(), 'period names', 'period name'),
                                type: 'kv',
                                card: self.cards?.['preferred period names']
                            }]
                        }
                    ]
            });

        },
        template: { require: 'text!templates/views/components/reports/period.htm' }
    });
});
