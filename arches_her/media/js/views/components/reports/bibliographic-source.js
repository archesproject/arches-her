define([
    'jquery',
    'underscore',
    'knockout',
    'arches',
    'utils/resource',
    'utils/report',
    'views/components/reports/scenes/name',
    'views/components/reports/scenes/audit',
    'views/components/reports/scenes/default',
    'views/components/reports/scenes/json'
], function($, _, ko, arches, resourceUtils, reportUtils) {
    return ko.components.register('bibliographic-source-report', {
        viewModel: function(params) {
            var self = this;
            params.configKeys = ['tabs', 'activeTabIndex'];
            Object.assign(self, reportUtils);
            self.sections = [
                {id: 'bib-source', title: 'Bibliographic Source Details'},
                {id: 'description', title: 'Descriptions and Citations'},
                {id: 'audit', title: 'Audit Data'},
                {id: 'json', title: 'JSON'},
            ];
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');

            self.nameDataConfig = {
                name: 'bibliographic source',
                type: undefined,
            };

            self.nameCards = {};
            self.auditCards = {}
            self.descriptionCards = {};
            self.summary = params.summary;
            self.cards = {};

            if(params.report.cards){
                const cards = params.report.cards;
                
                self.cards = self.createCardDictionary(cards)

                self.nameCards = {
                    name: self.cards?.['bibliographic source names'],
                    externalCrossReferences: self.cards?.['external cross references'],
                    systemReferenceNumbers: self.cards?.['system reference numbers'],
                };
                self.auditCards = {
                    audit: self.cards?.['audit metadata']
                }
                self.descriptionCards = {
                    descriptions: self.cards?.['descriptions'],
                };
            }

        },
        template: { require: 'text!templates/views/components/reports/bibliographic-source.htm' }
    });
});
