define([
    'jquery',
    'underscore',
    'knockout',
    'arches',
    'utils/resource',
    'utils/report',
    'templates/views/components/reports/place.htm',
    'views/components/reports/scenes/name',
    'views/components/reports/scenes/json'
], function($, _, ko, arches, resourceUtils, reportUtils, placeReportTemplate) {
    return ko.components.register('place-report', {
        viewModel: function(params) {
            var self = this;
            params.configKeys = ['tabs', 'activeTabIndex'];
            this.configForm = params.configForm || false;
            this.configType = params.configType || 'header';

            Object.assign(self, reportUtils);
            self.sections = [
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

            self.nameDataConfig = {
                name: 'names',
                nameChildren: 'placename'
            };

            self.classificationDataConfig = {
                type: 'place type'
            };
            self.locationDataConfig = {
                location: [],
                locationDescription: undefined,
                nationalGrid: undefined,
                administrativeAreas: 'localities/administrative area types'
            }

            self.nameCards = {};
            self.descriptionCards = {};
            self.classificationCards = {};
            self.locationCards = {};
            self.summary = params.summary;
            self.cards = {};

            if(params.report.cards){
                const cards = params.report.cards;
                
                self.cards = self.createCardDictionary(cards)

                self.nameCards = {
                    name: self.cards?.['placenames'],
                    externalCrossReferences: self.cards?.['external cross references'],
                    systemReferenceNumbers: self.cards?.['system reference numbers'],
                };

                self.descriptionCards = {
                    descriptions: self.cards?.['descriptions'],
                };

                self.classificationCards = {
                    type: self.cards?.['place type'],
                };

                self.locationCards = {
                    cards: self.cards,
                    location: {
                        card: null,
                        subCards: {
                            locationGeometry: 'mapped location',
                            administrativeAreas: 'localities/administrative area types',
                            addresses: 'addresses',
                        }
                    }
                }
            }

        },
        template: placeReportTemplate
    });
});
