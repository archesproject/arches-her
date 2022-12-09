define([
    'jquery',
    'underscore',
    'knockout',
    'arches',
    'utils/resource',
    'utils/report',
    'templates/views/components/reports/maritime-vessel.htm',
    'views/components/reports/scenes/name',
    'views/components/reports/scenes/json'
], function($, _, ko, arches, resourceUtils, reportUtils, maritimeVesselReport) {
    return ko.components.register('maritime-vessel-report', {
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
                {id: 'status', title: 'Status and Ownership'},
                {id: 'journey', title: 'Journey Details'},
                {id: 'people', title: 'Associated People and Organizations'},
                {id: 'resources', title: 'Associated Resources'},
                {id: 'json', title: 'JSON'},
            ];

            self.nationalitiesTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(3).fill(null)
            };

            self.ownersTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(6).fill(null)
            };

            self.voyagesTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(16).fill(null)
            };

            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');
            self.nationalities = ko.observableArray();
            self.owners = ko.observableArray();
            self.voyages = ko.observableArray();

            self.classificationDataConfig = {
                maritimeProduction: 'construction phases',
                components: undefined,
                dimensions: 'asset dimensions',
                usePhase: 'use phases'
            };

            self.descriptionDataConfig = {
                citation: 'bibliographic source citation'
            };

            self.resourceDataConfig = {
                files: 'digital file(s)',
                actors: undefined
            }

            self.nameCards = {};
            self.descriptionCards = {};
            self.assessmentCards = {};
            self.classificationCards = {};
            self.imagesCards = {};
            self.peopleCards = {};
            self.locationCards = {};
            self.protectionCards = {};
            self.resourcesCards = {};
            self.summary = params.summary;
            self.cards = {};

            self.visible = {
                nationalities: ko.observable(true),
                owners: ko.observable(true),
                voyages: ko.observable(true)
            }

            if(params.report.cards){
                const cards = params.report.cards;

                self.cards = self.createCardDictionary(cards)

                self.nameCards = {
                    name: self.cards?.['names'],
                    externalCrossReferences: self.cards?.['external cross references'],
                    systemReferenceNumbers: self.cards?.['system reference numbers'],
                };

                self.descriptionCards = {
                    descriptions: self.cards?.['descriptions'],
                    citation: self.cards?.['bibliographic source citation']
                };

                self.classificationCards = {
                    production: self.cards?.['construction phases'],
                    dimensions: self.cards?.['asset dimensions'],
                    usePhase: self.cards?.['use phase']
                };

                self.assessmentCards = {
                    scientificDate: self.cards?.['scientific date assignment']
                };

                self.peopleCards = {
                    people: self.cards?.['associated people and organizations']
                };

                self.resourcesCards = {
                    activities: self.cards?.['associated activities'],
                    consultations: self.cards?.['associated consultations'],
                    files: self.cards?.['associated digital file(s)'],
                    assets: self.cards?.['associated heritage assets, areas and artefacts']
                };

                self.imagesCards = {
                    images: self.cards?.['images']
                }

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
                            namedLocations: 'named locations'
                        }
                    }
                };

                self.cards = Object.assign(self.cards, {
                    nationalities: self.cards?.['nationalities and registration details'],
                    owners: self.cards?.['owner']
                });

                self.protectionCards = {
                    designations: self.cards?.['designation and protection assignment']
                };

                Object.assign(self.protectionCards, self.locationCards);
            }

            self.statusData = ko.observable({
                sections:
                    [
                        {
                            title: "Vessel Status",
                            data: [{
                                key: 'Status',
                                value: self.getNodeValue(self.resource(), 'status'),
                                card: self.cards?.['status'],
                                type: 'kv'
                            }]
                        }
                    ]
            });

            const nationalityNode = self.getRawNodeValue(self.resource(), 'nationalities');

            if(Array.isArray(nationalityNode)){
                self.nationalities(nationalityNode.map(node => {
                    const nationality = self.getNodeValue(node, 'craft nationality');
                    const placeOfRegistration = self.getNodeValue(node, 'place of registration')
                    const tileid = self.getTileId(node);
                    return { nationality, placeOfRegistration, tileid };
                }));
            }

            const ownersNode = self.getRawNodeValue(self.resource(), 'owner');

            if(Array.isArray(ownersNode)){
                self.owners(ownersNode.map(node => {
                    const owner = self.getNodeValue(node);
                    const ownerLink = self.getResourceLink(node);
                    const startDate = self.getNodeValue(node, 'ownership', 'ownership timespan', 'ownership start date');
                    const endDate = self.getNodeValue(node, 'ownership', 'ownership timespan', 'ownership end date');
                    const dateQualifier = self.getNodeValue(node, 'ownership', 'ownership timespan', 'ownership date qualifier');
                    const displayDate = self.getNodeValue(node, 'ownership', 'ownership timespan', 'ownership date qualifier');
                    const tileid = self.getTileId(node);
                    return { owner, ownerLink, startDate, endDate, dateQualifier, displayDate, tileid };
                }));
            }


            const voyagesNode = self.getRawNodeValue(self.resource(), 'voyages');

            if(voyagesNode){
                self.voyages(voyagesNode.map(node => {
                    const description = self.getNodeValue(node, 'voyage descriptions', 'voyage description');

                    const crewNode = self.getRawNodeValue(node, 'crew');
                    let crew = [];
                    if(Array.isArray(crewNode))
                    {
                        crew = crewNode.map(crewNode => {
                            const name = self.getNodeValue(crewNode, 'crew member');
                            const link = self.getResourceLink(self.getRawNodeValue(crewNode, 'crew member'));
                            const role = self.getNodeValue(crewNode, 'crew member', 'crew role');
                            return { name, link, role };
                        })
                    }

                    const departureName = self.getNodeValue(node, 'place of departure', 'departure placenames', 'place of departure name');
                    const departureNameCurrency = self.getNodeValue(node, 'place of departure', 'departure placenames', 'place of departure name currency');
                    const destinationName = self.getNodeValue(node, 'place of destination', 'destination placenames', 'place of destination name');
                    const destinationNameCurrency = self.getNodeValue(node, 'place of destination', 'destination placenames', 'place of destination name currency');
                    const cargo = self.getNodeValue(node, 'cargo', 'cargo type');
                    const lossStartDate = self.getNodeValue(node, 'loss timespan', 'date of loss start');
                    const lossEndDate = self.getNodeValue(node, 'loss timespan', 'date of loss end');
                    const lossDateQualifier = self.getNodeValue(node, 'loss timespan', 'date of loss qualifier');
                    const expectedArrivalDate = self.getNodeValue(node, 'voyage time span', 'expected date of arrival');
                    const arrivalDate = self.getNodeValue(node, 'voyage time span', 'date of arrival');
                    const departureDate = self.getNodeValue(node, 'voyage time span', 'date of departure');
                    const type = self.getNodeValue(node, 'voyage type');
                    const mannerOfLoss = self.getNodeValue(node, 'manner of loss');
                    const tileid = self.getTileId(node);

                    return {
                        arrivalDate,
                        lossStartDate,
                        lossEndDate,
                        lossDateQualifier,
                        description,
                        crew,
                        departureName,
                        departureNameCurrency,
                        destinationName,
                        destinationNameCurrency,
                        cargo,
                        departureDate,
                        expectedArrivalDate,
                        type,
                        mannerOfLoss,
                        tileid
                    };
                }))
            }

        },
        template: maritimeVesselReport
    });
});
