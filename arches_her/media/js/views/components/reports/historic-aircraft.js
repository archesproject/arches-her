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
                columns: Array(11).fill(null)
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
                files: 'digital file(s)'
            }

            self.nameCards = {};
            self.descriptionCards = {};
            self.classificationCards = {};
            self.scientificDateCards = {};
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
                    flights: self.cards?.['flights'],
                    lastFlight: self.cards?.['last known flight']
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
            
            const flightsNode = self.getRawNodeValue(self.resource(), 'flights'); 

            if(Array.isArray(flightsNode)){
                self.flights(flightsNode.map(node => {
                    const cargoType = self.getNodeValue(node, 'cargo', 'cargo type');

                    const crewNode = self.getRawNodeValue(node, 'crew');
                    let crew = [];
                    if(Array.isArray(crewNode))
                    {
                        crew = crewNode.map(crewNode => {
                            const name = self.getNodeValue(crewNode, 'crew member', 'crew member name');
                            const role = self.getNodeValue(crewNode, 'crew member', 'role');
                            return { name, role };
                        })
                    }

                    const flightDescription = self.getNodeValue(node, 'flight descriptions', 'flight description')
                    const flightDeparture = self.getNodeValue(node, 'flight departure', 'flight departure name');
                    const flightDestination = self.getNodeValue(node, 'flight destination', 'flight destination name');
                    const flightArrivalDate = self.getNodeValue(node, 'flight timespan', 'flight date of arrival');
                    const flightDepartureDate = self.getNodeValue(node, 'flight timespan', 'flight date of departure');
                    const flightDisplayDate = self.getNodeValue(node, 'flight timespan', 'flight display date');
                    const flightDateQualifier = self.getNodeValue(node, 'flight timespan', 'flight date qualifier');
                    const flightType = self.getNodeValue(node, 'flight timespan', 'flight date qualifier');
                    const tileid = self.getTileId(node);


                    return { 
                        cargoType, 
                        crew, 
                        flightDescription, 
                        flightDeparture, 
                        flightDestination, 
                        flightArrivalDate, 
                        flightDepartureDate, 
                        flightDisplayDate, 
                        flightDateQualifier, 
                        flightType, 
                        tileid
                    }
                }));
            }

            const crashNode = self.getRawNodeValue(self.resource(), 'crash_event'); 

            if(crashNode){
                const description = self.getNodeValue(crashNode, 'crash descriptions', 'last flight description');
                const crashSiteType = self.getNodeValue(crashNode, 'crash site', 'crash site type');
                const crashSite = self.getNodeValue(crashNode, 'crash site');
                const crashSiteLink = self.getResourceLink(self.getRawNodeValue(crashNode, 'crash site'));
    
                const crewNode = self.getRawNodeValue(crashNode, 'crew');
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

                const departureName = self.getNodeValue(crashNode, 'final place of departure', 'final departure placenames', 'final place of departure name');
                const departureNameCurrency = self.getNodeValue(crashNode, 'final place of departure', 'final departure placenames', 'final place of departure name currency');
                const destinationName = self.getNodeValue(crashNode, 'final place of destination', 'final destination placenames', 'final place of destination name');
                const destinationNameCurrency = self.getNodeValue(crashNode, 'final place of destination', 'final destination placenames', 'final place of destination name currency');
                const cargo = self.getNodeValue(crashNode, 'last cargo', 'last cargo type');
                const departureDate = self.getNodeValue(crashNode, 'last flight timespan', 'date of departure');
                const lossDate = self.getNodeValue(crashNode, 'last flight timespan', 'date of loss');
                const expectedArrivalDate = self.getNodeValue(crashNode, 'last flight timespan', 'expected date of arrival', 'expected date start');
                const dateQualifier = self.getNodeValue(crashNode, 'last flight timespan', 'last flight date qualifier');
                const type = self.getNodeValue(crashNode, 'last flight type');
                const mannerOfLoss = self.getNodeValue(crashNode, 'manner of loss');
                const tileid = self.getTileId(crashNode);

                self.lastFlight([{
                    description, 
                    crashSiteType,
                    crashSite,
                    crashSiteLink,
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
        template: { require: 'text!templates/views/components/reports/historic-aircraft.htm' }
    });
});
