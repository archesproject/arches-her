define([
    'jquery',
    'underscore',
    'knockout',
    'arches',
    'utils/resource',
    'utils/report',
    'views/components/reports/scenes/name',
    'views/components/reports/scenes/description',
    'views/components/reports/scenes/json',
    'views/components/reports/scenes/classifications',
    'views/components/reports/scenes/location',
    'views/components/reports/scenes/protection'
], function($, _, ko, arches, resourceUtils, reportUtils) {
    return ko.components.register('activity-report', {
        viewModel: function(params) {
            const self = this;
            params.configKeys = ['tabs', 'activeTabIndex'];
            Object.assign(self, reportUtils);
            self.sections = [
                {id: 'name', title: 'Names and Identifiers'},
                {id: 'description', title: 'Descriptions and Citations'},
                {id: 'classifications', title: 'Classifications and Dating'},
                {id: 'location', title: 'Location Data'},
                {id: 'protection', title: 'Designation and Protection Status'},
                {id: 'archive', title: 'Archive Holding'},
                {id: 'people', title: 'Associated People and Organizations'},
                {id: 'resources', title: 'Associated Resources'},
                {id: 'audit', title: 'Audit Data'},
                {id: 'json', title: 'JSON'},
            ];
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');

            self.descriptionDataConfig = {
                descriptions: 'activity descriptions',
                citation: 'bibliographic source citation'
            }

            self.nameDataConfig = {
                name: 'activity',
                parent: 'parent_activity',
                recordStatus: 'record_status_assignment'
            };

            self.classificationDataConfig = {
                type: 'activity type',
                activityTimespan: 'activity timespan'
            };

            self.nameCards = {};
            self.auditCards = {};
            self.classificationCards = {}
            self.descriptionCards = {};
            self.summary = params.summary;
            self.cards = {};

            if(params.report.cards){
                const cards = params.report.cards;
                
                self.cards = self.createCardDictionary(cards)

                self.nameCards = {
                    name: self.cards?.['activity names'],
                    externalCrossReferences: self.cards?.['external cross references'],
                    systemReferenceNumbers: self.cards?.['system reference numbers'],
                };

                self.descriptionCards = {
                    descriptions: self.cards?.['activity descriptions'],
                };
            }

        },
        template: { require: 'text!templates/views/components/reports/activity.htm' }
    });
});
