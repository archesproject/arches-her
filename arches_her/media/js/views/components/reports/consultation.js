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
                {id: 'description', title: 'Descriptions'},
                {id: 'location', title: 'Location Data'},
                {id: 'contacts', title: 'Contacts'},
                {id: 'correspondence', title: 'Correspondence'},
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
                contacts: ko.observable(true),
                correspondence: ko.observable(true),
                communications: ko.observable(true)
            }

            self.correspondenceTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(3).fill(null)
            }

            self.communicationsTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(9).fill(null)
            }

            self.contacts = ko.observable();
            self.correspondence = ko.observableArray();
            self.communications = ko.observableArray();

            const contactNode = self.getRawNodeValue(self.resource(), 'contacts');
            if(contactNode){
                const consultingContact = self.getNodeValue(contactNode, 'consulting contact');
                const planningOfficer = self.getNodeValue(contactNode, 'planning officers', 'planning officer');
                const caseworkOfficer = self.getNodeValue(contactNode, 'casework officers', 'casework officer');
                const agent = self.getNodeValue(contactNode, 'agents', 'agent');
                const owner = self.getNodeValue(contactNode, 'owners', 'owner');
                const applicant = self.getNodeValue(contactNode, 'applicants', 'applicant');
                const tileid = self.getTileId(contactNode);
                self.contacts(
                    {consultingContact, planningOfficer, caseworkOfficer, agent, owner, applicant, tileid}
                )
            };

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

            const communicationsNode = self.getRawNodeValue(self.resource(), 'communications');
            if(Array.isArray(communicationsNode)){
                self.communications(communicationsNode.map(node => {
                    const subject = self.getNodeValue(node, 'subjects', 'subject');
                    const subjectDescType = self.getNodeValue(node, 'subjects', 'subject description type');
                    const type = self.getNodeValue(node, 'communication type');
                    const date = self.getNodeValue(node, 'dates', 'date');
                    // const endDate = self.getNodeValue(node, 'dates', 'end date');
                    const attendees = self.getNodeValue(node, 'attendees');
                    const relatedCondition = self.getNodeValue(node, 'related condition');
                    const note = self.getNodeValue(node, 'communication notes', 'communication description');
                    // const noteDescType = self.getNodeValue(node, 'communication notes', 'communication description type');
                    const followOnAction = self.getNodeValue(node, 'follow on actions', 'follow-on actions');
                    // const followOnActionDescType = self.getNodeValue(node, 'follow on actions', 'follow-on actions description type');
                    const digitalFile = self.getNodeValue(node, 'digital file(s)');
                    const digitalFileLink = self.getResourceLink(self.getRawNodeValue(node, 'digital file(s)'));
                    const tileid = self.getTileId(node);
                    return {subject, subjectDescType, type, date, attendees, note, followOnAction, relatedCondition, digitalFile, digitalFileLink, tileid};
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
