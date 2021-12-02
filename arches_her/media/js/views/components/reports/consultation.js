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
                {id: 'details', title: 'Consultation Details'},
                {id: 'location', title: 'Location Data'},
                {id: 'references', title: 'Planning References'},
                {id: 'contacts', title: 'Contacts'},
                {id: 'progression', title: 'Consultation Progression'},
                {id: 'correspondence', title: 'Correspondence'},
                {id: 'sitevisits', title: 'Site Visits'},
                {id: 'resources', title: 'Associated Resources'},
                {id: 'audit', title: 'Audit Data'},
                {id: 'json', title: 'JSON'},
            ];
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('details');

            self.nameDataConfig = {
                name: 'consultation',
                xref: undefined,
                type: undefined,
            };

            self.descriptionDataConfig = {
                descriptions: 'consultation descriptions',
            };

            self.photographsDataConfig = {
                images: 'photographs'
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
            self.photographsCards = {};

            self.auditCards = {}
            self.descriptionCards = {};
            self.summary = params.summary;
            self.cards = {};

            self.visible = {
                references: ko.observable(true),
                systemReferences: ko.observable(true),
                contacts: ko.observable(true),
                correspondence: ko.observable(true),
                communications: ko.observable(true),
                siteVisits: ko.observable(true),
                proposal: ko.observable(true),
                advice: ko.observable(true),
                action: ko.observable(true),
                outcomes: ko.observable(true),
                assessmentOfSignificance: ko.observable(true),
            }

            self.createTableConfig = function(col) {
                return {
                    ...self.defaultTableConfig,
                    columns: Array(col).fill(null)
                };
            }

            self.contacts = ko.observable();
            self.references = ko.observableArray();
            self.systemReferences = ko.observableArray();
            self.correspondence = ko.observableArray();
            self.communications = ko.observableArray();
            self.siteVisits = ko.observableArray();
            self.proposal = ko.observableArray();
            self.advice = ko.observableArray();
            self.action = ko.observableArray();
            self.outcomes = ko.observableArray();
            self.assessmentOfSignificance = ko.observableArray();


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

            const systemReferencesNode = self.getRawNodeValue(self.resource(), 'references');
            if(Array.isArray(systemReferencesNode)){
                self.systemReferences(systemReferencesNode.map(node => {
                    const reference = self.getNodeValue(node, 'agency identifier', 'reference');
                    const referenceType = self.getNodeValue(node, 'agency identifier', 'reference type');
                    const agency = self.getNodeValue(node, 'agency');
                    const tileid = self.getTileId(node);
                    return {reference, referenceType, agency, tileid};
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

            const proposalNode = self.getRawNodeValue(self.resource(), 'proposal');
            if(Array.isArray(proposalNode)){
                self.proposal(proposalNode.map(node => {
                    const proposal = self.getNodeValue(node, 'proposal text');
                    const file = self.getNodeValue(node, 'digital file(s)');
                    const fileLink = self.getResourceLink(self.getRawNodeValue(node, 'digital file(s)'));
                    const tileid = self.getTileId(node);
                    return {proposal, file, fileLink, tileid};
                }));
            };

            const adviceNode = self.getRawNodeValue(self.resource(), 'advice');
            if(Array.isArray(adviceNode)){
                self.advice(adviceNode.map(node => {
                    const advice = self.getNodeValue(node, 'advice text');
                    const adviceType = self.getNodeValue(node, 'advice type');
                    const tileid = self.getTileId(node);
                    return {advice, adviceType, tileid};
                }));
            };

            const actionNode = self.getRawNodeValue(self.resource(), 'action');
            if(Array.isArray(actionNode)){
                self.action(actionNode.map(node => {
                    const action = self.getNodeValue(node, 'action text');
                    const actionType = self.getNodeValue(node, 'action type');
                    const relatedAdvice = self.getNodeValue(node, 'related advice');
                    const tileid = self.getTileId(node);
                    return {action, actionType, relatedAdvice, tileid};
                }));
            };

            const outcomesNode = self.getRawNodeValue(self.resource(), 'outcomes');
            if(outcomesNode){
                const planningOutcome = self.getNodeValue(outcomesNode, 'planning outcome');
                const auditOutcome = self.getNodeValue(outcomesNode, 'audit outcome');
                const tileid = self.getTileId(outcomesNode);
                self.outcomes({planningOutcome, auditOutcome, tileid});
            };

            const assessmentOfSignificanceNode = self.getRawNodeValue(self.resource(), 'assessment of significance');
            if(Array.isArray(assessmentOfSignificanceNode)){
                self.assessmentOfSignificance(assessmentOfSignificanceNode.map(node => {
                    const notes = self.getNodeValue(node, 'notes');
                    const tileid = self.getTileId(node);
                    return {notes, tileid};
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

            const siteVisitsNode = self.getRawNodeValue(self.resource(), 'site visits');
            if(Array.isArray(siteVisitsNode)){
                self.siteVisits(siteVisitsNode.map(node => {
                    const dateOfVisit = self.getNodeValue(node, 'timespan of visit', 'date of visit');
                    const location = self.getNodeValue(node, 'location', 'location descriptions', 'location description');
                    const locationDescType = self.getNodeValue(node, 'location', 'location descriptions', 'location description type');
                    const attendees = self.getRawNodeValue(node, 'attendees').map(attendeeNode => {
                        const attendee = self.getNodeValue(attendeeNode, 'attendee');
                        const attendeeType = self.getNodeValue(attendeeNode, 'attendee type');
                        const tileid = self.getTileId(attendeeNode);
                        return {attendee, attendeeType, tileid};
                    });
                    const observations = self.getRawNodeValue(node, 'observations').map(observationNode => {
                        const observation = self.getNodeValue(observationNode, 'observation', 'observation notes');
                        const tileid = self.getTileId(observationNode);
                        return {observation, tileid};
                    });
                    const recommendations = self.getRawNodeValue(node, 'recommendations').map(recommendationNode => {
                        const recommendation = self.getNodeValue(recommendationNode, 'Recommendation', 'Recommendation value');
                        const tileid = self.getTileId(recommendationNode);
                        return {recommendation, tileid};
                    });
                    const photographs = self.getRawNodeValue(node, 'photographs').map(photographNode => {
                        const file = self.getNodeValue(photographNode, 'file_details', [0], 'name');
                        const fileUrl = self.getNodeValue(photographNode, 'file_details', [0], 'url');
                        const caption = self.getNodeValue(photographNode, 'caption notes', 'caption note');
                        const copyrightHolder = self.getNodeValue(photographNode, 'Copyright', 'copyright holder');
                        const copyrightNote = self.getNodeValue(photographNode, 'copyright', 'copyright note', 'copyright note text');
                        const copyrightType = self.getNodeValue(photographNode, 'copyright', 'copyright type');
                        const tileid = self.getTileId(photographNode);
                        return {file, fileUrl, caption, copyrightHolder, copyrightType, copyrightNote, tileid};
                    });
                    const tileid = self.getTileId(node);
                    return {dateOfVisit, location, attendees, observations, recommendations, photographs, tileid};
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
                            locationGeometry: 'consultation location',
                        }
                    }
                };
                self.resourcesCards = {
                    consultations: self.cards?.['associated consultations'],
                    activities: self.cards?.['associated activities'],
                    assets: self.cards?.['associated heritage assets and areas'],
                    files: self.cards?.['associated digital files'],
                };
                self.photographsCards = {

                };
                self.auditCards = {
                    audit: self.cards?.['audit metadata'],
                    type: self.cards?.['resource model type']
                };
            };
        },
        template: { require: 'text!templates/views/components/reports/consultation.htm' }
    });
});
