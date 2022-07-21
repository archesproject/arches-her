define([
    'jquery',
    'underscore',
    'knockout',
    'arches',
    'utils/resource',
    'utils/report',
    'templates/views/components/reports/person.htm',
    'views/components/reports/scenes/name'
], function($, _, ko, arches, resourceUtils, reportUtils, personReportTemplate) {
    return ko.components.register('person-report', {
        viewModel: function(params) {
            var self = this;
            params.configKeys = ['tabs', 'activeTabIndex'];
            this.configForm = params.configForm || false;
            this.configType = params.configType || 'header';

            Object.assign(self, reportUtils);
            self.sections = [
                {id: 'name', title: 'Names and Classifications'},
                {id: 'person-name', title: 'Person Name and Identifiers'},
                {id: 'description', title: 'Descriptions and Citations'},
                {id: 'location', title: 'Location Data'},
                {id: 'images', title: 'Images'},
                {id: 'people', title: 'Associated People and Organizations'},
                {id: 'contact', title: 'Biography and Contact Details'},
                {id: 'resources', title: 'Associated Resources'},
                {id: 'json', title: 'JSON'},
            ];
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');
            self.names = ko.observableArray();

            self.contactPointsTable = {
                ...self.defaultTableConfig,
                columns: Array(3).fill(null)
            };

            self.nameTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(8).fill(null)
            };

            self.visible = {
                contactPoints: ko.observable(true),
                names: ko.observable(true)
            }
            self.sourceData = ko.observable({
                sections:
                    [
                        {
                            title: 'References',
                            data: [{
                                key: 'source reference work',
                                value: self.getRawNodeValue(self.resource(), 'source'),
                                type: 'resource'
                            }]
                        }
                    ]
            });

            self.nameDataConfig = {
                name: undefined,
            };
            self.documentationDataConfig = {
                subjectOf: undefined
            };

            self.locationDataConfig = {
                nationalGrid: undefined,
                locationDescription: undefined,
                administrativeAreas: undefined,
                geometry: undefined
            };

            self.descriptionDataConfig = {
                citation: 'bibliographic source citation'
            };

            self.resourceDataConfig = {
                files: 'digital file(s)',
                archive: undefined,
                actors: undefined
            };
            self.nameCards = {};
            self.descriptionCards = {};
            self.locationCards = {};
            self.documentationCards = {};
            self.existenceCards = {};
            self.resourcesCards = {};
            self.communicationCards = {};
            self.eventCards = {};
            self.contactCards = {};
            self.imagesCards = {};
            self.peopleCards = {};
            self.summary = params.summary;
            self.cards = {};

            if(params.report.cards){
                const cards = params.report.cards;

                self.cards = self.createCardDictionary(cards);

                self.nameCards = {
                    name: self.cards?.['name of person'],
                    externalCrossReferences: self.cards?.['external cross references'],
                    systemReferenceNumbers: self.cards?.['system reference numbers'],
                };

                self.descriptionCards = {
                    descriptions: self.cards?.['descriptions'],
                    citation: self.cards?.['bibliographic source citation']
                };

                self.documentationCards = {
                    digitalReference: self.cards?.['digital reference for person'],
                };

                self.communicationCards = {
                    contactPoints: self.cards?.['contact information for person'],
                };

                self.imagesCards = {
                    images: self.cards?.['images']
                }

                self.peopleCards = {
                    people: self.cards?.['associated people and organizations']
                };

                self.locationCards = {
                    cards: self.cards,
                    location: {
                        card: null,
                        subCards: {
                            addresses: 'addresses'
                        }
                    }
                };

                self.contactCards = {
                    contact: self.cards?.['contact details']
                };

                self.resourcesCards = {
                    activities: self.cards?.['associated activities'],
                    consultations: self.cards?.['associated consultations'],
                    files: self.cards?.['associated digital file(s)'],
                    assets: self.cards?.['associated heritage assets, areas and artefacts']
                };
            }

            const nameNode = self.getRawNodeValue(self.resource(), 'name');
            if(Array.isArray(nameNode)){
                self.names(nameNode.map(node => {
                    const name = self.getNodeValue(node, 'full name');
                    const nameUseType = self.getNodeValue(node, 'name use type');
                    const initials = self.getNodeValue(node, 'initials', 'initial(s)');
                    const forename = self.getNodeValue(node, 'forenames', 'forename');
                    const title = self.getNodeValue(node, 'titles', 'title');
                    const surname = self.getNodeValue(node, 'surnames', 'surname');
                    const epithet = self.getNodeValue(node, 'epithets', 'epithet');
                    const tileid = self.getTileId(node);
                    return { name, nameUseType, initials, forename, title, epithet, surname, tileid };
                }))
            }

            self.lifeData = ko.observable({
                sections:
                    [
                        {
                            title: 'Birth',
                            data: [{
                                key: 'Date',
                                value: self.getNodeValue(self.resource(), 'birth', 'birth time span', 'date of birth'),
                                type: 'kv',
                                card: self.cards?.birth
                            },{
                                key: 'Mother',
                                value: self.getRawNodeValue(self.resource(), 'birth', 'mother'),
                                type: 'resource',
                                card: self.cards?.birth
                            },{
                                key: 'Father',
                                value: self.getRawNodeValue(self.resource(), 'birth', 'father'),
                                type: 'resource',
                                card: self.cards?.birth
                            },{
                                key: 'Place',
                                value: self.getNodeValue(self.resource(), 'birth', 'place of birth', 'birthplace', 'birth place'),
                                type: 'kv',
                                card: self.cards?.birth
                            }]
                        },
                        {
                            title: 'Death',
                            data: [{
                                key: 'Date',
                                value: self.getNodeValue(self.resource(), 'death', 'death time span', 'date of death'),
                                type: 'kv',
                                card: self.cards?.birth
                            },{
                                key: 'Place',
                                value: self.getNodeValue(self.resource(), 'death', 'place of death', 'deathplace', 'death place'),
                                type: 'kv',
                                card: self.cards?.birth
                            }]
                        }
                    ]
            });

        },
        template: personReportTemplate
    });
});
