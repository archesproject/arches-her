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
    return ko.components.register('heritage-story-report', {
        viewModel: function(params) {
            var self = this;
            params.configKeys = ['tabs', 'activeTabIndex'];
            this.configForm = params.configForm || false;
            this.configType = params.configType || 'header';

            Object.assign(self, reportUtils);
            self.sections = [
                {id: 'name', title: 'Names and Identifiers'},
                {id: 'description', title: 'Descriptions and Citations'},
                {id: 'location', title: 'Location Data'},
                {id: 'resources', title: 'Associated Resources'},
                {id: 'json', title: 'JSON'},
            ];
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');

            self.nameDataConfig = {
                parent: 'parent story'
            };

            self.descriptionDataConfig = {
                audience: 'audience type',
                citation: 'bibliographic source citation'
            };

            self.resourceDataConfig = {
                activities: undefined,
                consultations: undefined,
                files: undefined,
                assets: 'associated heritage assets, areas and artefacts',
                translation: 'translation',
                period: 'temporal coverage',
                archive: undefined,
                actors: 'associated actors'
            };

            self.locationDataConfig = {
                location: ['geographic coverage'],
                addresses: undefined,
                locationDescription: undefined,
                nationalGrid: undefined,
                namedLocations: undefined
            }

            self.nameCards = {};
            self.descriptionCards = {};
            self.resourcesCards = {};
            self.locationCards = {};
            self.summary = params.summary;
            self.cards = {};

            if(params.report.cards){
                const cards = params.report.cards;

                self.cards = self.createCardDictionary(cards)

                self.nameCards = {
                    name: self.cards?.['names'],
                    externalCrossReferences: self.cards?.['external cross references'],
                    systemReferenceNumbers: self.cards?.['system reference numbers'],
                    parent: self.cards?.['parent story']
                };

                self.descriptionCards = {
                    descriptions: self.cards?.['descriptions'],
                    subjects: self.cards?.['subjects'],
                    audience: self.cards?.['audience type']
                };

                self.locationCards = {
                    cards: self.cards,
                    location: {
                        card: null,
                        subCards: {
                            locationGeometry: ['geographic coverage', 'geometry'],
                            administrativeAreas: 'localities/administrative areas',
                        }
                    }
                }

                self.resourcesCards = {
                    translation: self.cards?.['translation'],
                    period: self.cards?.['temporal coverage'],
                    assets: self.cards?.['associated heritage assets, areas and artefacts'],
                    actors: self.cards?.['associated people and organizations']
                }
            }

        },
        template: { require: 'text!templates/views/components/reports/heritage-story.htm' }
    });
});
