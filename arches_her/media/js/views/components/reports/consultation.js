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
            this.configForm = params.configForm || false;
            this.configType = params.configType || 'header';

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
                administrativeAreas: 'localities/administrative areas',
                nationalGrid: undefined,
                namedLocations: undefined
            }

            self.resourcesDataConfig = {
                assets: 'related monuments and areas',
                files: 'file(s)',
                relatedApplicationArea: 'consultation area',
                actors: undefined
            };

            self.nameCards = {};
            self.locationCards = {};
            self.resourcesCards = {};
            self.photographsCards = {};

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

            self.proposalTableConfig = {
                ...self.defaultTableConfig,
                "columns": [
                    { "width": "50%" },
                    { "width": "40%" },
                   null,
                ]
            };

            self.adviceTableConfig = {
                ...self.defaultTableConfig,
                "columns": [
                    { "width": "70%" },
                    { "width": "20%" },
                   null,
                ]
            };


            self.actionTableConfig = {
                ...self.defaultTableConfig,
                "columns": [
                    { "width": "50%" },
                    { "width": "20%" },
                    { "width": "20%" },
                   null,
                ]
            };

            self.attendeesTableConfig = {
                ...self.defaultTableConfig,
                "columns": [
                    { "width": "45%" },
                    { "width": "45%" },
                   null,
                ]
            };

            self.observationsTableConfig = {
                ...self.defaultTableConfig,
                "columns": [
                    { "width": "70%" },
                    { "width": "20%" },
                   null,
                ]
            };


            self.recommendationsTableConfig = {
                ...self.defaultTableConfig,
                "columns": [
                    { "width": "70%" },
                    { "width": "20%" },
                   null,
                ]
            };


            self.contacts = ko.observable();
            self.references = ko.observableArray();
            self.systemReferences = ko.observableArray();
            self.correspondence = ko.observableArray();
            self.communications = ko.observableArray();
            self.siteVisits = ko.observableArray();
            self.proposal = ko.observableArray();
            self.advice = ko.observableArray();
            self.action = ko.observableArray();
            self.outcomes = ko.observable();
            self.assessmentOfSignificance = ko.observableArray();


            const referencesNode = self.getRawNodeValue(self.resource(), 'external cross references');
            if(Array.isArray(referencesNode)){
                self.references(referencesNode.map(node => {
                    const reference = self.getNodeValue(node, 'external cross reference');
                    const source = self.getNodeValue(node, 'external cross reference source');
                    const note = self.getNodeValue(node, 'external cross reference notes', 'external cross reference description');
                    const noteDescType = self.getNodeValue(node, 'external cross reference notes', 'external cross reference description type');
                    const urlNodeValue = self.getRawNodeValue(node, 'url');
                    let url = undefined;
                    let urlLabel = undefined;
                    if(urlNodeValue){
                        url = urlNodeValue.url;
                        urlLabel = urlNodeValue.url_label ? urlNodeValue.url_label : urlNodeValue.url;
                    }
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
                    const agencyLink = self.getResourceLink(self.getRawNodeValue(node, 'agency'));
                    const tileid = self.getTileId(node);
                    return {reference, referenceType, agency, agencyLink, tileid};
                }));
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
                    const proposal = self.getRawNodeValue(node, 'proposal text', '@display_value');
                    const file = self.getNodeValue(node, 'digital file(s)');
                    const fileLink = self.getResourceLink(self.getRawNodeValue(node, 'digital file(s)'));
                    const tileid = self.getTileId(node);
                    return {proposal, file, fileLink, tileid};
                }));
            };

            const adviceNode = self.getRawNodeValue(self.resource(), 'advice');
            if(Array.isArray(adviceNode)){
                self.advice(adviceNode.map(node => {
                    const advice = self.getRawNodeValue(node, 'advice text', '@display_value');
                    const adviceType = self.getNodeValue(node, 'advice type');
                    const tileid = self.getTileId(node);
                    return {advice, adviceType, tileid};
                }));
            };

            const actionNode = self.getRawNodeValue(self.resource(), 'action');
            if(Array.isArray(actionNode)){
                self.action(actionNode.map(node => {
                    const action = self.getRawNodeValue(node, 'action text', '@display_value');
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
                    const type = self.getNodeValue(node, 'communication type');
                    const date = self.getNodeValue(node, 'dates', 'date');
                    const attendees = self.getNodeValue(node, 'attendees');
                    const relatedCondition = self.getNodeValue(node, 'related condition');
                    const note = self.getNodeValue(node, 'communication notes', 'communication description');
                    const followOnAction = self.getNodeValue(node, 'follow on actions', 'follow-on actions');
                    const digitalFile = self.getNodeValue(node, 'digital file(s)');
                    const digitalFileLink = self.getResourceLink(self.getRawNodeValue(node, 'digital file(s)'));
                    const tileid = self.getTileId(node);
                    return {subject, type, date, attendees, note, followOnAction, relatedCondition, digitalFile, digitalFileLink, tileid};
                }));
            };

            const siteVisitsNode = self.getRawNodeValue(self.resource(), 'site visits');
            if(Array.isArray(siteVisitsNode)){
                self.siteVisits(siteVisitsNode.map(node => {
                    const dateOfVisit = self.getNodeValue(node, 'timespan of visit', 'date of visit');
                    const location = self.getNodeValue(node, 'location', 'location descriptions', 'location description');

                    const attendeesNodes = self.getRawNodeValue(node, 'attendees');
                    const observationsNodes = self.getRawNodeValue(node, 'observations');
                    const recommendationsNodes = self.getRawNodeValue(node, 'recommendations');
                    const photographsNodes = self.getRawNodeValue(node, 'photographs');

                    const attendees = ko.observable(Array.isArray(attendeesNodes) ? (
                        attendeesNodes.map(attendeeNode => {
                            const attendee = self.getNodeValue(attendeeNode, 'attendee');
                            const attendeeType = self.getNodeValue(attendeeNode, 'attendee type');
                            const tileid = self.getTileId(attendeeNode);
                            return {attendee, attendeeType, tileid};
                        })) : []);
                    const observations = ko.observable(Array.isArray(observationsNodes) ? (
                        observationsNodes.map(observationNode => {
                            const observation = self.getNodeValue(observationNode, 'observation', 'observation notes');
                            const observedBy = self.getNodeValue(observationNode, 'observed by');
                            const tileid = self.getTileId(observationNode);
                            return {observation, observedBy, tileid};
                        })) : []);
                    const recommendations = ko.observable(Array.isArray(recommendationsNodes) ? (
                        recommendationsNodes.map(recommendationNode => {
                            const recommendation = self.getRawNodeValue(recommendationNode, 'recommendation', 'recommendation value', '@display_value');
                            const recommendedBy = self.getNodeValue(recommendationNode, 'recommended by');
                            const tileid = self.getTileId(recommendationNode);
                            return {recommendation, recommendedBy, tileid};
                        })) : []);
                    const photographs = Array.isArray(photographsNodes) ? (
                        photographsNodes.map(photographNode => {
                            const file = self.getNodeValue(photographNode, 'file_details', [0], 'name');
                            const fileUrl = self.getNodeValue(photographNode, 'file_details', [0], 'url');
                            const caption = self.getNodeValue(photographNode, 'caption notes', 'caption note');
                            const copyrightHolder = self.getNodeValue(photographNode, 'copyright', 'copyright holder');
                            const copyrightNote = self.getNodeValue(photographNode, 'copyright', 'copyright note', 'copyright note text');
                            const copyrightType = self.getNodeValue(photographNode, 'copyright', 'copyright type');
                            const tileid = self.getTileId(photographNode);
                            return {file, fileUrl, caption, copyrightHolder, copyrightType, copyrightNote, tileid};
                        })) : [];
                    const tileid = self.getTileId(node);
                    return {dateOfVisit, location, attendees, observations, recommendations, photographs, tileid};
                }));
            };

            const contactNode = self.getRawNodeValue(self.resource(), 'contacts');
            if(contactNode){
                const consultingContact = self.getNodeValue(contactNode, 'consulting contact');
                const planningOfficer = self.getNodeValue(contactNode, 'planning officers', 'planning officer');
                const planningOfficerLink = self.getNodeValue(contactNode, 'planning officers', 'planning officer', 'resourceid');
                const planningBody = self.getNodeValue(contactNode, 'planning officers', 'planning body');
                const planningBodyLink = self.getNodeValue(contactNode, 'planning officers', 'planning body', 'resourceid');
                const caseworkOfficer = self.getNodeValue(contactNode, 'casework officers', 'casework officer');
                const caseworkOfficerLink = self.getNodeValue(contactNode, 'casework officers', 'casework officer', 'resourceid');
                const agentsNodes = self.getRawNodeValue(contactNode, 'agents', 'agent', 'instance_details');
                const ownersNodes = self.getRawNodeValue(contactNode, 'owners', 'owner', 'instance_details');
                const applicantsNodes = self.getRawNodeValue(contactNode, 'applicants', 'applicant', 'instance_details');
                const agents = (Array.isArray(agentsNodes)) ? (
                    agentsNodes.map(agentsNode => {
                        const agent = self.getNodeValue(agentsNode);
                        const agentLink = self.getResourceLink(agentsNode);
                        const tileid = self.getTileId(agentsNode);
                        return {agent, agentLink, tileid};
                    })) : [];
                const owners = (Array.isArray(ownersNodes)) ? (
                    ownersNodes.map(ownersNode => {
                        const owner = self.getNodeValue(ownersNode);
                        const ownerLink = self.getResourceLink(ownersNode);
                        const tileid = self.getTileId(ownersNode);
                        return {owner, ownerLink, tileid};
                    })) : [];
                const applicants = (Array.isArray(applicantsNodes)) ? (
                    applicantsNodes.map(applicantsNode => {
                        const applicant = self.getNodeValue(applicantsNode);
                        const applicantLink = self.getResourceLink(applicantsNode);
                        const tileid = self.getTileId(applicantsNode);
                        return {applicant, applicantLink, tileid};
                    })) : [];
                const tileid = self.getTileId(contactNode);

                self.contacts(
                    { consultingContact, planningOfficer, planningOfficerLink, planningBody, planningBodyLink, caseworkOfficer, caseworkOfficerLink, agents, owners, applicants, tileid }
                )
            };

            if(params.report.cards){
                const cards = params.report.cards;

                self.cards = self.createCardDictionary(cards)

                self.siteVisitSubCards = self.createCardDictionary(self.cards['site visits'].cards());

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
                            administrativeAreas: 'localities/administrative areas'
                        }
                    }
                };
                self.resourcesCards = {
                    consultations: self.cards?.['associated consultations'],
                    activities: self.cards?.['associated activities'],
                    assets: self.cards?.['associated monuments and areas'],
                    files: self.cards?.['associated digital files'],
                    relatedApplicationArea: self.cards?.['consultation location']
                };
            };

            self.consultationLocationDescription = ko.observable({
                sections:
                    [
                        {
                            title: 'Consultation Location Description',
                            card: self.cards?.['consultation location'],
                            data: [{
                                key: 'Consultation Location Description',
                                value: self.getNodeValue(self.resource(), 'consultation area', 'geometry', 'Consultation Location Descriptions', 'Consultation Location Description'),
                                type: 'kv'
                            }]
                        }
                    ]
            });

            self.consultationDetails = ko.observable({
                sections:
                    [
                        {
                            title: 'Consultation Details',
                            card: self.cards?.['consultation type'],
                            data: [{
                                key: 'Consultation Type',
                                value: self.getNodeValue(self.resource(), 'consultation type'),
                                type: 'kv'
                            },{
                                key: 'Development Type',
                                value: self.getNodeValue(self.resource(), 'development type'),
                                type: 'kv'
                            },{
                                key: 'Application Type',
                                value: self.getNodeValue(self.resource(), 'application type'),
                                type: 'kv'
                            },{
                                key: 'Contested Heritage Assignment',
                                value: self.getNodeValue(self.resource(), 'contested heritage assignment', 'contested heritage'),
                                type: 'kv'
                            },{
                                key: 'Consultation Status',
                                value: self.getNodeValue(self.resource(), 'status'),
                                type: 'kv'
                            }]
                        }
                    ]
            });

            self.consultationDates = ko.observable({
                sections:
                    [
                        {
                            title: 'Consultation Dates',
                            card: self.cards?.['consultation dates'],
                            data: [{
                                key: 'Log Date',
                                value: self.getNodeValue(self.resource(), 'consultation dates', 'log date'),
                                type: 'kv'
                            },{
                                key: 'Target Date',
                                value: self.getNodeValue(self.resource(), 'consultation dates', 'target date', 'target date start'),
                                type: 'kv'
                            },{
                                key: 'Completion Date',
                                value: self.getNodeValue(self.resource(), 'consultation dates', 'completion date'),
                                type: 'kv'
                            }]
                        }
                    ]
            });
        },
        template: { require: 'text!templates/views/components/reports/consultation.htm' }
    });
});
