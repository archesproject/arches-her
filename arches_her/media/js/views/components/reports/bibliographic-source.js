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
                {id: 'name', title: 'Bibliographic Source Details'},
                {id: 'description', title: 'Descriptions and Citations'},
                {id: 'classifications', title: 'Classifications and Dating'},
                {id: 'archive', title: 'Archive Holding'},
                {id: 'bib-source', title: 'Bibliographic Source Details'},
                {id: 'resources', title: 'Associated Resources'},
                {id: 'audit', title: 'Audit Data'},
                {id: 'json', title: 'JSON'},
            ];
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');

            self.nameDataConfig = {
                name: undefined,
            };

            self.classificationDataConfig = {
                type: 'bibliographic source type'
            };

            self.resourceDataConfig = {
                activities: undefined,
                consultations: undefined,
                assets: undefined,
                files: 'digital file(s)'
            };
            
            
            self.archiveDataConfig = {
                sourceCreation: 'bibliographic source creation'
            };

            self.nameCards = {};
            self.auditCards = {};
            self.archiveCards = {};
            self.classificationCards = {};
            self.resourceCards = {};
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
                
                self.classificationCards = {
                    type: self.cards?.['bibliographic source types']
                };

                self.auditCards = {
                    audit: self.cards?.['audit metadata']
                };

                self.descriptionCards = {
                    descriptions: self.cards?.['descriptions'],
                    citation: self.cards?.['bibliographic source citation']
                };

                self.resourceCards = {
                    files: self.cards?.['associated digital files']
                };

                self.archiveCards = {
                    sourceCreation: self.cards?.['bibliographic source creation']
                }
            }

        },
        template: { require: 'text!templates/views/components/reports/bibliographic-source.htm' }
    });
});
