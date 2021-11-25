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
    return ko.components.register('archive-source-report', {
        viewModel: function(params) {
            var self = this;
            params.configKeys = ['tabs', 'activeTabIndex'];
            Object.assign(self, reportUtils);
            self.sections = [
                {id: 'name', title: 'Names and Identifiers'},
                {id: 'description', title: 'Descriptions and Citations'},
                {id: 'images', title: 'Images'},
                {id: 'archive', title: 'Archive Holding'},
                {id: 'resources', title: 'Associated Resources'},
                {id: 'audit', title: 'Audit Data'},
                {id: 'json', title: 'JSON'},
            ];
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');

            self.nameDataConfig = {
                name: 'archive source',
            };
            self.descriptionDataConfig = {
                citation: 'bibliographic source citation', 
                subject: 'subjects'
            };

            self.imagesDataConfig = {
                copyright: 'copyright_details'
            };

            self.resourceDataConfig = {
                files: 'digital file(s)',
                activities: undefined,
                consultations: undefined,
                assets: undefined,
                period: 'periods'
            };
            
            self.archiveDataConfig = {

            }

            self.nameCards = {};
            self.imagesCards = {};
            self.archiveCards = {};
            self.resourcesCards = {};
            self.classificationCards = {};
            self.auditCards = {}
            self.descriptionCards = {};
            self.summary = params.summary;
            self.cards = {};

            if(params.report.cards){
                const cards = params.report.cards;
                
                self.cards = self.createCardDictionary(cards)

                self.nameCards = {
                    name: self.cards?.['archive source names'],
                    externalCrossReferences: self.cards?.['external cross references'],
                    systemReferenceNumbers: self.cards?.['system reference numbers'],
                };

                self.descriptionCards = {
                    descriptions: self.cards?.['descriptions'],
                    citation: self.cards?.['associated bibliographic sources'],
                    subject: self.cards?.['subjects']
                };

                self.imagesCards = {
                    copyright: self.cards?.['copyright details'],
                    images: self.cards?.['images']
                };

                self.auditCards = {
                    audit: self.cards?.['audit metadata'],
                    type: self.cards?.['resource model type']
                };
                
                self.resourcesCards = {
                    files: self.cards?.['associated digital files'],
                    period: self.cards?.['associated periods']
                }
            }

        },
        template: { require: 'text!templates/views/components/reports/archive-source.htm' }
    });
});
