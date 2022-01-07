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
    return ko.components.register('historic-landscape-characterization-report', {
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
                {id: 'hlc-attributes', title: 'HLC Attributes'},
                {id: 'location', title: 'Location Data'},
                {id: 'resources', title: 'Associated Resources'},
                {id: 'json', title: 'JSON'},
            ];
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');
            self.historicLandscapeClassificationPhase = ko.observableArray();

            self.visible = {
                historicLandscapeClassificationPhase: ko.observable(true)
            };

            self.hlcPhaseTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(12).fill(null)
            }

            self.nameDataConfig = {
                name: 'names',
                type: undefined,
            };

            self.locationDataConfig = {
                location: [],
                addresses: undefined,
                locationDescription: undefined,
                namedLocations: undefined
            };

            self.descriptionDataConfig = {
                citation: 'bibliographic source citation'
            };
            self.resourceDataConfig = {
                activities: undefined,
                files: undefined,
                consultations: undefined
            }

            self.nameCards = {};
            self.classificationCards = {};
            self.descriptionCards = {};
            self.resourcesCards = {};
            self.locationCards = {};
            self.historicLandscapeClassificationPhaseCards = {}
            self.summary = params.summary;
            self.cards = {};

            const hlcPhaseNode = self.getRawNodeValue(self.resource(), 'hlc phase');
            if(Array.isArray(hlcPhaseNode)){
                self.historicLandscapeClassificationPhase(hlcPhaseNode.map(x => {
                    const broadType = self.getNodeValue(x, 'hlc phase classification', 'broad type');
                    const hlcType = self.getNodeValue(x, 'hlc phase classification', 'broad type', 'hlc type');
                    const interpretationConfidence = self.getNodeValue(x, 'hlc phase classification', 'confidence of interpretation');
                    const description = self.getNodeValue(x, 'hlc phase classification', 'hlc phase description');
                    const historicMap = self.getNodeValue(x, 'hlc phase classification', 'historic map');
                    const historicMapLink = self.getResourceLink(x, 'hlc phase classification', 'historic map');
                    const displayDate = self.getNodeValue(x, 'hlc phase display date');
                    const dateConfidence = self.getNodeValue(x, 'hlc phase timespan', 'confidence of dating');
                    const dateQualifier = self.getNodeValue(x, 'hlc phase timespan', 'hlc phase date qualifier');
                    const endDate = self.getNodeValue(x, 'hlc phase timespan', 'hlc phase end date');
                    const startDate = self.getNodeValue(x, 'hlc phase timespan', 'hlc phase start date');
                    const period = self.getNodeValue(x, 'period');
                    const periodLink = self.getResourceLink(x, 'period');
                    const tileid = self.getTileId(x);
                    return {
                        broadType,
                        interpretationConfidence,
                        description,
                        historicMap,
                        hlcType,
                        historicMapLink,
                        displayDate,
                        dateConfidence,
                        dateQualifier,
                        endDate,
                        startDate,
                        period,
                        periodLink,
                        tileid
                    };
                }));
            }

            if(params.report.cards){
                const cards = params.report.cards;
                
                self.cards = self.createCardDictionary(cards)

                Object.assign(self.cards, {
                    historicLandscapeClassificationPhase: self.cards?.['hlc phase']
                })

                self.nameCards = {
                    name: self.cards?.['names'],
                    externalCrossReferences: self.cards?.['external cross references'],
                    systemReferenceNumbers: self.cards?.['system reference numbers'],
                };

                self.descriptionCards = {
                    descriptions: self.cards?.['descriptions'],
                    citation: self.cards?.['bibliographic source citation']
                };

                self.resourcesCards = {
                    assets: self.cards?.['associated heritage assets, areas and artefacts']
                }

                self.locationCards = {
                    cards: self.cards,
                    location: {
                        card: null,
                        subCards: {
                            administrativeAreas: 'localities/administrative areas',
                            nationalGrid: 'national grid references',
                            locationGeometry: 'location'
                        }
                    }
                };
            }


            self.hlcAttributes = ko.observable({
                sections:
                    [
                        {
                            title: 'Historic Land Use Character Attributes',
                            data: [{
                                key: 'Street Pattern',
                                value: self.getNodeValue(self.resource(), 'historic land use character attributes', 'street pattern'),
                                type: 'kv',
                                card: self.cards?.['historic land use character attributes']
                            },{
                                key: 'Street Frontage',
                                value: self.getNodeValue(self.resource(), 'historic land use character attributes', 'street frontage'),
                                type: 'kv',
                                card: self.cards?.['historic land use character attributes']
                            },{
                                key: 'Average Height',
                                value: self.getNodeValue(self.resource(), 'historic land use character attributes', 'average height'),
                                type: 'kv',
                                card: self.cards?.['historic land use character attributes']
                            },{
                                key: 'Rear Gardens',
                                value: self.getNodeValue(self.resource(), 'historic land use character attributes', 'rear gardens'),
                                type: 'kv',
                                card: self.cards?.['historic land use character attributes']
                            }]
                        }
                    ]
            });
        },
        template: { require: 'text!templates/views/components/reports/historic-landscape-characterization.htm' }
    });
});
