define([
    'jquery',
    'underscore',
    'knockout',
    'arches',
    'utils/resource',
    'utils/report',
    'views/components/reports/scenes/name',
    'views/components/reports/scenes/json',
    'views/components/reports/scenes/archive'
], function($, _, ko, arches, resourceUtils, reportUtils) {
    return ko.components.register('artefact-report', {
        viewModel: function(params) {
            var self = this;
            params.configKeys = ['tabs', 'activeTabIndex'];
            Object.assign(self, reportUtils);
            self.sections = [
                {id: 'name', title: 'Names and Identifiers'},
                {id: 'description', title: 'Descriptions and Citations'},
                {id: 'classifications', title: 'Classifications and Dating'},
                {id: 'location', title: 'Location Data'},
                {id: 'discovery', title: 'Discovery'},
                {id: 'protection', title: 'Designation and Protection Status'},
                {id: 'assessments', title: 'Assessments'},
                {id: 'archive', title: 'Archive Holding'},
                {id: 'resources', title: 'Associated Resources'},
                {id: 'audit', title: 'Audit Data'},
                {id: 'json', title: 'JSON'},
            ];
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');

            self.nameDataConfig = {
                name: 'artefact',
                type: undefined,
            };

            self.classificationDataConfig = {
                production: 'production',
                dimensions: 'measurement event'
            };

            self.descriptionDataConfig = {
                citation: 'bibliographic source citation'
            };

            self.locationDataConfig = {
                location: ['discovery', 'location data']
            };

            self.protectionDataConfig = {
                protection: undefined
            };

            self.assessmentsDataConfig = {
                artefactCondition: 'condition assessment'
            };

            self.archiveDataConfig = {
                repositoryStorage: 'repository storage location'
            };

            self.resourceDataConfig = {
                files: 'digital file(s)',
                consultations: undefined
            };

            self.nameCards = {};
            self.auditCards = {};
            self.assessmentCards = {};
            self.archiveCards = {};
            self.descriptionCards = {};
            self.classificationCards = {};
            self.scientificDateCards = {};
            self.peopleCards = {};
            self.locationCards = {};
            self.protectionCards = {};
            self.resourcesCards = {};
            self.summary = params.summary;
            self.cards = {};

            if(params.report.cards){
                const cards = params.report.cards;
                
                self.cards = self.createCardDictionary(cards)

                self.nameCards = {
                    name: self.cards?.['artefact names'],
                    externalCrossReferences: self.cards?.['external cross references'],
                    systemReferenceNumbers: self.cards?.['system reference numbers']
                };

                self.descriptionCards = {
                    descriptions: self.cards?.['descriptions'],
                    citation: self.cards?.['bibliographic source citation']
                };

                self.classificationCards = {
                    production: self.cards?.['artefact production'],
                    dimensions: self.cards?.['artefact dimensions']
                };

                self.assessmentCards = {
                    scientificDate: self.cards?.['scientific date assignment'],
                    artefactCondition: self.cards?.['artefact condition assessment']
                };

                self.peopleCards = {
                    people: self.cards?.['associated people and organizations']
                };

                self.archiveCards = {
                    repositoryStorage: self.cards?.['repository storage location']
                };

                self.auditCards = {
                    audit: self.cards?.['audit metadata'],
                    type: self.cards?.['resource model type']
                };
                
                self.resourcesCards = {
                    activities: self.cards?.['associated activities'],
                    files: self.cards?.['associated digital files'],
                    assets: self.cards?.['associated heritage assets, areas and artefacts']
                };

                self.discoveryCards = {
                    discovery: self.cards?.['discovery']
                }

                const discoveryTile = self.discoveryCards.discovery?.tiles()?.[0];

                const discoveryChildCards = self.createCardDictionary(discoveryTile?.cards);

                self.locationCards = {
                    location: {
                        card: discoveryChildCards?.['location data'] || self.discoveryCards?.discovery,
                        subCards: {
                            addresses: 'addresses',
                            nationalGrid: 'national grid references',
                            administrativeAreas: 'localities/administrative areas',
                            locationDescriptions: 'location descriptions',
                            areaAssignment: 'area assignments',
                            landUse: 'land use classification assignment'
                        }
                    }
                }

                Object.assign(self.protectionCards, self.locationCards);
            }

        },
        template: { require: 'text!templates/views/components/reports/artefact.htm' }
    });
});
