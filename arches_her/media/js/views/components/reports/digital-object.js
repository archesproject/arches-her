define([
    'jquery',
    'underscore',
    'knockout',
    'arches',
    'utils/resource',
    'utils/report',
    'views/components/reports/scenes/name',
    'views/components/reports/scenes/copyright',
    'views/components/reports/scenes/json'
], function($, _, ko, arches, resourceUtils, reportUtils) {
    return ko.components.register('digital-object-report', {
        viewModel: function(params) {
            var self = this;
            params.configKeys = ['tabs', 'activeTabIndex'];
            this.configForm = params.configForm || false;
            this.configType = params.configType || 'header';

            Object.assign(self, reportUtils);
            self.sections = [
                {id: 'name', title: 'Names and Identifiers'},
                {id: 'publication', title: 'Publication Details'},
                {id: 'file', title: 'File Details'},
                {id: 'json', title: 'JSON'},
            ];
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');

            self.nameDataConfig = {};

            self.nameCards = {};
            self.descriptionCards = {};
            self.summary = params.summary;
            self.cards = {};
            self.copyrightCards = {};

            self.visible = {
                files: ko.observable(true),
            }

            self.createTableConfig = function(col) {
                return {
                    ...self.defaultTableConfig,
                    columns: Array(col).fill(null)
                };
            }

            if(params.report.cards){
                const cards = params.report.cards;
                
                self.cards = self.createCardDictionary(cards)

                self.nameCards = {
                    name: self.cards?.['names'],
                    externalCrossReferences: self.cards?.['external cross references'],
                    systemReferenceNumbers: self.cards?.['system reference numbers'],
                };

                self.descriptionCards = {
                    descriptions: self.cards?.['descriptions'],
                };

                self.copyrightCards = {
                    copyright: self.cards?.['copyright']
                }
            }

            self.files = ko.observableArray();
            
            const fileDetailsNode = self.getRawNodeValue(self.resource(), 'file content', 'file', 'file_details');
            const fileNode = self.getRawNodeValue(self.resource(), 'file content', 'file');
            if(Array.isArray(fileDetailsNode)){
                const tileid = self.getTileId(fileNode);
                self.files(fileDetailsNode.map(node => {
                    const name = self.getNodeValue(node, 'name');
                    const link = self.getNodeValue(node, 'url');
                    return {name, link, tileid};
                }));
            };

            self.fileData = ko.observable({
                sections:
                    [
                        {
                            title: 'Details',
                            data: [{
                                key: 'Format',
                                value: self.getNodeValue(self.resource(), 'file format type'),
                                type: 'kv',
                                card: self.cards?.['file format']
                            },{
                                key: 'Creator',
                                value: self.getRawNodeValue(self.resource(), 'creation', 'creator'),
                                type: 'resource',
                                card: self.cards?.creation
                            },{
                                key: 'Created Date',
                                value: self.getNodeValue(self.resource(), 'creation', 'creation timespan', 'start date'),
                                type: 'kv',
                                card: self.cards?.creation
                            }]
                        }
                    ]
            });
        },
        template: { require: 'text!templates/views/components/reports/digital-object.htm' }
    });
});
