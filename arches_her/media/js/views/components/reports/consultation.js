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
                {id: 'references', title: 'Planning References'},
                {id: 'contacts', title: 'Contacts'},
                {id: 'correspondence', title: 'Correspondence'},
                {id: 'resources', title: 'Associated Resources'},
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

            self.resourcesDataConfig = {
                assets: 'related heritage assets and areas',
                files: 'file(s)'
            };
            
            self.nameCards = {};
            self.locationCards = {};
            self.resourcesCards = {};

            self.auditCards = {}
            self.descriptionCards = {};
            self.summary = params.summary;
            self.cards = {};

            self.visible = {
                references: ko.observable(true),
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

            self.referencesTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(5).fill(null)
            }

            self.contacts = ko.observable();
            self.references = ko.observableArray();
            self.correspondence = ko.observableArray();
            self.communications = ko.observableArray();

            const referencesNode = self.getRawNodeValue(self.resource(), 'external cross references');
            if(Array.isArray(referencesNode)){
                self.references(referencesNode.map(node => {
                    const reference = self.getNodeValue(node, 'external cross reference');
                    const source = self.getNodeValue(node, 'external cross reference source');
                    const note = self.getNodeValue(node, 'external cross reference notes', 'external cross reference description');
                    const noteDescType = self.getNodeValue(node, 'external cross reference notes', 'external cross reference description type');
                    const url = JSON.parse(self.getNodeValue(node, 'url')).url;
                    const urlLabel = JSON.parse(self.getNodeValue(node, 'url')).url_label;
                    const tileid = self.getTileId(node);
                    return {reference, source, note, noteDescType, url, urlLabel, tileid};
                }));
            };

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

console.log(self.resource())
console.log(self.cards)

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
                self.resourcesCards = {
                    consultations: self.cards?.['associated consultations'],
                    activities: self.cards?.['associated activities'],
                    assets: self.cards?.['associated heritage assets and areas'],
                    files: self.cards?.['associated digital files'],
                };
            };
        },
        template: { require: 'text!templates/views/components/reports/consultation.htm' }
    });
});
