define([
    'jquery',
    'underscore',
    'knockout',
    'arches',
    'utils/resource',
    'utils/report',
    'views/components/reports/scenes/name'
], function($, _, ko, arches, resourceUtils, reportUtils) {
    return ko.components.register('person-report', {
        viewModel: function(params) {
            var self = this;
            params.configKeys = ['tabs', 'activeTabIndex'];
            Object.assign(self, reportUtils);
            self.sections = [
                {id: 'name', title: 'Names and Classifications'},
                {id: 'person-name', title: 'Person Name and Identifiers'},
                {id: 'description', title: 'Descriptions and Citations'},
                {id: 'location', title: 'Location Data'},
                {id: 'images', title: 'Images'},
                {id: 'people', title: 'Associated People and Organizations'},
                {id: 'resources', title: 'Associated Resources'},
                {id: 'audit', title: 'Audit Data'},
                {id: 'json', title: 'JSON'},
            ];
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');
            self.contactPointsTable = {
                ...self.defaultTableConfig,
                columns: Array(3).fill(null)
            };
            self.visible = {
                contactPoints: ko.observable(true)
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
                files: 'digital file(s)'
            };
            self.nameCards = {};
            self.auditCards = {}
            self.descriptionCards = {};
            self.locationCards = {};
            self.documentationCards = {};
            self.existenceCards = {};
            self.resourcesCards = {};
            self.communicationCards = {};
            self.eventCards = {};
            self.imagesCards = {};
            self.peopleCards = {};
            self.summary = params.summary;
            self.cards = {};

            if(params.report.cards){
                const cards = params.report.cards;
                
                self.cards = self.createCardDictionary(cards)

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

                self.auditCards = {
                    audit: self.cards?.['audit metadata'],
                    type: self.cards?.['resource model type']
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

                self.resourcesCards = {
                    activities: self.cards?.['associated activities'],
                    consultations: self.cards?.['associated consultations'],
                    files: self.cards?.['associated digital file(s)'],
                    assets: self.cards?.['associated heritage assets, areas and artefacts']
                };

            }

        },
        template: { require: 'text!templates/views/components/reports/person.htm' }
    });
});
