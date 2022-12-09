define([
    'jquery',
    'underscore',
    'knockout',
    'arches',
    'utils/resource',
    'utils/report',
    'templates/views/components/reports/historic-aircraft.htm',
    'views/components/reports/scenes/name',
    'views/components/reports/scenes/json'
], function($, _, ko, arches, resourceUtils, reportUtils, historicAircraftReportTemplate) {
    return ko.components.register('historic-aircraft-report', {
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
                {id: 'status', title: 'Status and Ownership'},
                {id: 'journey', title: 'Journey Details'},
                {id: 'people', title: 'Associated People and Organizations'},
                {id: 'resources', title: 'Associated Resources'},
                {id: 'json', title: 'JSON'},
            ];
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');
            self.flights = ko.observableArray();
            self.lastFlight = ko.observableArray();

            self.flightsTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(10).fill(null)
            };

            self.lastFlightTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(16).fill(null)
            };

            self.classificationDataConfig = {
                aircraftProduction: 'aircraft_construction_phase',
                dimensions: 'aircraft dimensions'
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
            self.classificationCards = {};
            self.assessmentCards = {};
            self.imagesCards = {};
            self.peopleCards = {};
            self.locationCards = {};
            self.protectionCards = {};
            self.resourcesCards = {};
            self.summary = params.summary;
            self.cards = {};
            self.visible = {
                flights: ko.observable(true),
                lastFlight: ko.observable(true)
            };

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
                    production: self.cards?.['construction phase(s)'],
                    dimensions: self.cards?.['aircraft dimensions']
                };

                self.assessmentCards = {
                    scientificDate: self.cards?.['scientific date assignment']
                };

                self.peopleCards = {
                    people: self.cards?.['associated people and organizations']
                };

                Object.assign(self.cards, {
                    flights: self.cards?.['flights']
                });

                self.resourcesCards = {
                    activities: self.cards?.['associated activities'],
                    consultations: self.cards?.['associated consultations'],
                    files: self.cards?.['associated digital file(s)'],
                    assets: self.cards?.['associated heritage assets, areas and artefacts'],
                    archive: self.cards?.['associated archives']
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
                            namedLocations: 'named locations'
                        }
                    }
                }

                self.protectionCards = {
                    designations: self.cards?.['designation and protection assignment']
                };

                Object.assign(self.protectionCards, self.locationCards);
            }

            self.statusOwnerData = ko.observable({
                sections:
                    [
                        {
                            title: "Status and Ownership",
                            data: [{
                                key: 'Status',
                                value: self.getNodeValue(self.resource(), 'status'),
                                card: self.cards?.['status'],
                                type: 'kv'
                            }, {
                                key: 'Nationality',
                                value: self.getRawNodeValue(self.resource(), 'nationalities')?.map(node =>
                                    self.getNodeValue(node, 'aircraft nationality')
                                ),
                                card: self.cards?.['nationality'],
                                type: 'kv'
                            }]
                        }
                    ]
            });

            const flightsNode = self.getRawNodeValue(self.resource(), 'flights')?.filter(f => f['Flight Type']['value'] !== 'Final');

            if(Array.isArray(flightsNode)){
                // const notFinalFlight = flightsNode.filter(f => f['Last Flight Type']['value'] !== 'Final');
                self.flights(flightsNode.map(node => {
                    const cargoType = self.getNodeValue(node, 'cargo', 'cargo type');

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

                    const flightDescription = self.getRawNodeValue(node, 'flight descriptions', 'flight description', '@display_value');
                    const flightDeparture = self.getNodeValue(node, 'place of departure', 'departure placenames', 'place of departure name');
                    const flightDestination = self.getNodeValue(node, 'place of destination', 'destination placenames', 'place of destination name');
                    const flightArrivalDate = self.getNodeValue(node, 'flight timespan', 'expected date of arrival', 'expected date start');
                    const flightDepartureDate = self.getNodeValue(node, 'flight timespan', 'date of departure');
                    const flightDateQualifier = self.getNodeValue(node, 'flight timespan', 'flight date qualifier');
                    const flightType = self.getNodeValue(node, 'flight type');
                    const tileid = self.getTileId(node);


                    return {
                        cargoType,
                        crew,
                        flightDescription,
                        flightDeparture,
                        flightDestination,
                        flightArrivalDate,
                        flightDepartureDate,
                        flightDateQualifier,
                        flightType,
                        tileid
                    }
                }));
            }

            const finalFlight = Object.assign({}, self.getRawNodeValue(self.resource(), 'flights')?.filter(f => f['Flight Type']['value'] === 'Final'))[0];

            if(finalFlight){
                const description = self.getRawNodeValue(finalFlight, 'flight descriptions', 'flight description', '@display_value');
                const crashSiteType = self.getNodeValue(finalFlight, 'crash site', 'crash site type');
                const crashSiteNode = self.getRawNodeValue(finalFlight, 'crash site', 'instance_details');
                let crashSites = [];
                if(Array.isArray(crashSiteNode)){
                    crashSites = crashSiteNode.map(crashSiteNode => {
                        const crashSiteName = self.getNodeValue(crashSiteNode);
                        const crashSiteLink = self.getResourceLink(crashSiteNode);
                        return { crashSiteName, crashSiteLink };
                    })
                }


                const crewNode = self.getRawNodeValue(finalFlight, 'crew');
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

                const departureName = self.getNodeValue(finalFlight, 'place of departure', 'departure placenames', 'place of departure name');
                const departureNameCurrency = self.getNodeValue(finalFlight, 'place of departure', 'departure placenames', 'place of departure name currency');
                const destinationName = self.getNodeValue(finalFlight, 'place of destination', 'destination placenames', 'place of destination name');
                const destinationNameCurrency = self.getNodeValue(finalFlight, 'place of destination', 'destination placenames', 'place of destination name currency');
                const cargo = self.getNodeValue(finalFlight, 'cargo', 'cargo type');
                const departureDate = self.getNodeValue(finalFlight, 'flight timespan', 'date of departure');
                const lossDate = self.getNodeValue(finalFlight, 'flight timespan', 'date of loss');
                const expectedArrivalDate = self.getNodeValue(finalFlight, 'flight timespan', 'expected date of arrival', 'expected date start');
                const dateQualifier = self.getNodeValue(finalFlight, 'flight timespan', 'flight date qualifier');
                const type = self.getNodeValue(finalFlight, 'flight type');
                const mannerOfLoss = self.getNodeValue(finalFlight, 'manner of loss');
                const tileid = self.getTileId(finalFlight);

                self.lastFlight([{
                    description,
                    crashSiteType,
                    crashSites,
                    crew,
                    departureName,
                    departureNameCurrency,
                    destinationName,
                    destinationNameCurrency,
                    cargo,
                    departureDate,
                    lossDate,
                    expectedArrivalDate,
                    dateQualifier,
                    type,
                    mannerOfLoss,
                    tileid
                }]);;
            }

        },
        template: historicAircraftReportTemplate
    });
});
