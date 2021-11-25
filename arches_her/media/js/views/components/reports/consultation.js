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
    return ko.components.register('consultation-report', {
        viewModel: function(params) {
            var self = this;
            params.configKeys = ['tabs', 'activeTabIndex'];
            Object.assign(self, reportUtils);
            self.sections = [
                {id: 'name', title: 'Consultation Details'},
                {id: 'location', title: 'Location Data'},
                {id: 'correspondence', title: 'Correspondence'},
                {id: 'description', title: 'Descriptions and Citations'},
                {id: 'audit', title: 'Audit Data'},
                {id: 'json', title: 'JSON'},
            ];
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');

            self.nameDataConfig = {
                name: 'consultation',
                type: undefined,
            };

            self.descriptionDataConfig = {
                descriptions: 'consultation descriptions',
            };

            self.locationDataConfig = {
                location: ['Consultation Area'],
                addresses: undefined,
                locationDescription: undefined,
                administrativeAreas: undefined,
                nationalGrid: undefined,
            }

            self.nameCards = {};
            self.locationCards = {};
            self.auditCards = {}
            self.descriptionCards = {};
            self.summary = params.summary;
            self.cards = {};

            self.visible = {
                correspondence: ko.observable(true)
            }

            self.correspondenceTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(3).fill(null)
            }

            self.correspondence = ko.observableArray();

            const correspondenceNode = self.getRawNodeValue(self.resource(), 'correspondence');
            if(Array.isArray(correspondenceNode)){
                self.correspondence(correspondenceNode.map(node => {
                    const letter = self.getNodeValue(node, 'letter');
                    const letterLink = self.getResourceLink(self.getRawNodeValue(node, 'letter'));
                    const letterType = self.getNodeValue(node, 'letter type');
                    const tileid = self.getTileId(node);
                    return {letter, letterLink, letterType, tileid};
                }));
            };

            if(params.report.cards){
                const cards = params.report.cards;
                
                self.cards = self.createCardDictionary(cards)

                self.nameCards = {
                    name: self.cards?.['consultation names'],
                    externalCrossReferences: self.cards?.['external cross references'],
                    systemReferenceNumbers: self.cards?.['system reference numbers'],
                };

                self.descriptionCards = {
                    descriptions: self.cards?.['consultation descriptions'],
                };

                self.locationCards = {
                    cards: self.cards,
                    location: {
                        card: null,
                        subCards: {
                            addresses: 'addresses',
                            administrativeAreas: 'localities/administrative areas',
                            locationGeometry: 'mapped location',
                            locationDescriptions: 'location descriptions',
                        }
                    }
                };
            }
        },
        template: { require: 'text!templates/views/components/reports/consultation.htm' }
    });
});
