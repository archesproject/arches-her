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
    return ko.components.register('monument-report', {
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
                {id: 'protection', title: 'Designation and Protection Status'},
                {id: 'assessments', title: 'Assessments'},
                {id: 'images', title: 'Images'},
                {id: 'people', title: 'Associated People and Organizations'},
                {id: 'resources', title: 'Associated Resources'},
                {id: 'json', title: 'JSON'},
            ];

            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');

            self.nameDataConfig = {
                name: 'monument',
                nameChildren: 'child monument',
                parent: 'parent monument or area'
            };

            self.classificationDataConfig = {
                production: 'construction phases',
                components: 'components',
                usePhase: 'use phases'
            };

            self.descriptionDataConfig = {
                citation: 'bibliographic source citation'
            };

            self.resourceDataConfig = {
                files: 'digital file(s)',
                activities: 'associated activities',
                consultations: 'associated consultations',
                assets: 'associated monuments, areas and artefacts',
                period: undefined,
                actors: undefined,
                archive: 'associated archives',
                resourceinstanceid: ko.unwrap(self.reportMetadata)?.resourceinstanceid
            }

            self.nameCards = {};
            self.descriptionCards = {};
            self.classificationCards = {};
            self.scientificDateCards = {};
            self.assessmentCards = {};
            self.imagesCards = {};
            self.locationCards = {};
            self.protectionCards = {};
            self.peopleCards = {};
            self.resourcesCards = {};
            self.summary = params.summary;
            self.cards = {};

            if(params.report.cards){
                const cards = params.report.cards;

                self.cards = self.createCardDictionary(cards)

                self.nameCards = {
                    name: self.cards?.['monument names'],
                    externalCrossReferences: self.cards?.['external cross references'],
                    systemReferenceNumbers: self.cards?.['system reference numbers'],
                    parent: self.cards?.['parent monuments'],
                };

                self.descriptionCards = {
                    descriptions: self.cards?.['descriptions'],
                    citation: self.cards?.['bibliographic source citation']
                };

                self.classificationCards = {
                    production: self.cards?.['construction phases'],
                    components: self.cards?.['components'],
                    usePhase: self.cards?.['use phase']
                };

                self.assessmentCards = {
                    scientificDate: self.cards?.['scientific date assignment']
                };

                self.imagesCards = {
                    images: self.cards?.['photographs']
                }

                self.peopleCards = {
                    people: self.cards?.['associated people and organizations']
                };

                self.resourcesCards = {
                    activities: self.cards?.['associated activities'],
                    archive: self.cards?.['associated archives'],
                    consultations: self.cards?.['associated consultations'],
                    files: self.cards?.['associated digital file(s)'],
                    assets: self.cards?.['associated monuments, areas and artefacts']
                };

                self.locationCards = {
                    location: {
                        card: self.cards?.['location data'],
                        subCards: {
                            addresses: 'addresses',
                            nationalGrid: 'national grid references',
                            administrativeAreas: 'localities/administrative areas',
                            locationDescriptions: 'location descriptions',
                            areaAssignment: 'area assignments',
                            landUse: 'land use classification assignment',
                            locationGeometry: 'geometry',
                            namedLocations: 'named locations'
                        }
                    }
                }

                self.protectionCards = {
                    designations: self.cards?.['designation and protection assignment']
                };

                Object.assign(self.protectionCards, self.locationCards);
            }

        },
        template: { require: 'text!templates/views/components/reports/monument.htm' }
    });
});
