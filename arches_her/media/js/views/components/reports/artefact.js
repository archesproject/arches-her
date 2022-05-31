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
            this.configForm = params.configForm || false;
            this.configType = params.configType || 'header';

            Object.assign(self, reportUtils);
            self.sections = [
                {id: 'name', title: 'Names and Identifiers'},
                {id: 'description', title: 'Descriptions and Citations'},
                {id: 'classifications', title: 'Classifications and Dating'},
                {id: 'location', title: 'Location Data'},
                {id: 'discovery', title: 'Discovery'},
                {id: 'protection', title: 'Designation and Protection Status'},
                {id: 'assessments', title: 'Assessments'},
                {id: 'publication', title: 'Publication Details'},
                {id: 'archive', title: 'Archive Holding'},
                {id: 'resources', title: 'Associated Resources'},
                {id: 'json', title: 'JSON'},
            ];

            self.discoveryTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(4).fill(null)
            };

            self.findersTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(4).fill(null)
            };

            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');

            self.nameDataConfig = {
                name: 'artefact',
                type: undefined,
            };

            self.classificationDataConfig = {
                artefactProduction: 'production',
                dimensions: 'measurement event'
            };

            self.descriptionDataConfig = {
                citation: 'bibliographic source citation'
            };

            self.locationDataConfig = {
                location: ['discovery', 'location data']
            };

            self.protectionDataConfig = {
                location: ['discovery', 'location data'],
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
                consultations: undefined,
                archive: undefined,
                actors: undefined
            };

            self.nameCards = {};
            self.assessmentCards = {};
            self.archiveCards = {};
            self.descriptionCards = {};
            self.classificationCards = {};
            self.scientificDateCards = {};
            self.peopleCards = {};
            self.locationCards = {};
            self.protectionCards = {};
            self.resourcesCards = {};
            self.copyrightCards = {};
            self.summary = params.summary;
            self.cards = {};
            self.discovery = ko.observableArray();
            self.finders = ko.observableArray();
            self.visible = {
                discovery: ko.observable(true),
                finders: ko.observable(true),
            }

            if(params.report.cards){
                const cards = params.report.cards;

                self.cards = self.createCardDictionary(cards)

                const tileCards = self.cards?.['discovery']?.tiles()?.[0]?.cards;
                if(tileCards){
                    const tileCardDictionary = self.createCardDictionary(tileCards);
                    Object.assign(self.cards, {finders: tileCardDictionary?.['finder']});
                }

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

                self.resourcesCards = {
                    activities: self.cards?.['associated activities'],
                    files: self.cards?.['associated digital files'],
                    assets: self.cards?.['associated monuments, areas and artefacts']
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
                            landUse: 'land use classification assignment',
                            namedLocations: 'named locations'
                        }
                    }
                }

                Object.assign(self.protectionCards, self.locationCards);

                self.copyrightCards = {
                    copyright: self.cards?.copyright
                }
            }

            const discoveryNode = self.getRawNodeValue(self.resource(), 'discovery');

            if(discoveryNode){
                const method = self.getNodeValue(discoveryNode, 'discovery method');
                const note = self.getRawNodeValue(discoveryNode, 'discovery notes', 'discovery note', '@display_value');
                const technique = self.getNodeValue(discoveryNode, 'recovery technique');
                const tileid = self.getTileId(discoveryNode);

                const finderNode = self.getRawNodeValue(discoveryNode, 'finder');

                if(Array.isArray(finderNode))
                {
                    self.finders(finderNode.map(finderNode => {
                        const name = self.getNodeValue(finderNode, 'finder names', 'finder name');
                        const currency = self.getNodeValue(finderNode, 'finder names', 'finder name currency');
                        const nameUseType = self.getNodeValue(finderNode, 'finder names', 'finder name use type');
                        const tileid = self.getTileId(finderNode);
                        return {
                            name,
                            currency,
                            nameUseType,
                            tileid
                        };
                    }));
                }

                self.discovery.push({
                    method,
                    note,
                    technique,
                    tileid
                });

            }
        },
        template: { require: 'text!templates/views/components/reports/artefact.htm' }
    });
});
