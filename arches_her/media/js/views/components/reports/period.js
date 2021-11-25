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
            Object.assign(self, reportUtils);
            self.sections = [
                {id: 'name', title: 'Names and Identifiers'},
                {id: 'description', title: 'Descriptions and Citations'},
                {id: 'classifications', title: 'Classifications and Dating'},
                {id: 'location', title: 'Location Data'},
                {id: 'period', title: 'Period Names'},
                {id: 'audit', title: 'Audit Data'},
                {id: 'json', title: 'JSON'},
            ];
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');

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
            self.auditCards = {};
            self.locationCards = {};
            self.descriptionCards = {};
            self.classificationCards = {};
            self.summary = params.summary;
            self.cards = {};

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

                self.auditCards = {
                    audit: self.cards?.['audit metadata'],
                    type: self.cards?.['resource model type']
                };
                
                self.classificationCards = {
                    type: self.cards?.['period types'],
                    dates: self.cards?.['dates']
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
