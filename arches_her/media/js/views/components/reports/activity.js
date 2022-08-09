define([
    'jquery',
    'underscore',
    'knockout',
    'arches',
    'utils/resource',
    'utils/report',
    'templates/views/components/reports/activity.htm',
    'views/components/reports/scenes/name',
    'views/components/reports/scenes/description',
    'views/components/reports/scenes/json',
    'views/components/reports/scenes/classifications',
    'views/components/reports/scenes/location',
    'views/components/reports/scenes/protection'
], function($, _, ko, arches, resourceUtils, reportUtils, activityTemplate) {
    return ko.components.register('activity-report', {
        viewModel: function(params) {
            const self = this;
            params.configKeys = ['tabs', 'activeTabIndex'];
            this.configForm = params.configForm || false;
            this.configType = params.configType || 'header';

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
                {id: 'json', title: 'JSON'},
            ];
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.activityArchive = ko.observableArray();
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');

            self.activityArchiveConfig = {
                ...self.defaultTableConfig,
                columns: Array(5).fill(null)
            }

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

            self.protectionDataConfig = {
                protection: undefined
            };

            self.resourceDataConfig = {
                archive: 'associated archive objects',
                files: 'digital files',
                assets: 'associated heritage assets and areas',
                actors: undefined
            }

            self.cards = {};
            self.nameCards = {};
            self.resourcesCards = {};
            self.classificationCards = {};
            self.locationCards = {};
            self.protectionCards = {};
            self.descriptionCards = {};
            self.peopleCards = {};
            self.summary = params.summary;
            self.visible = {
                activityArchive: ko.observable(true)
            }

            const activityArchiveNode = self.getRawNodeValue(self.resource(), 'activity archive material')
            if(Array.isArray(activityArchiveNode)){
                self.activityArchive(activityArchiveNode.map(node => {
                    const type = self.getNodeValue(node, 'archive material', 'archive source type');
                    const repositoryOwner = self.getNodeValue(node, 'archive material', 'repository storage location', 'repository owner');
                    const repositoryOwnerLink = self.getResourceLink(self.getRawNodeValue(node, 'archive material', 'repository storage location', 'repository owner'));
                    const storageAreaName = self.getNodeValue(node, 'archive material', 'repository storage location', 'storage area names', 'storage area name');
                    const storageBuilding = self.getNodeValue(node, 'archive material', 'repository storage location', 'storage building', 'storage building name');
                    const tileid = self.getTileId(node);
                    return {
                        type,
                        repositoryOwner,
                        repositoryOwnerLink,
                        storageAreaName,
                        storageBuilding,
                        tileid
                    };
                }));
            }

            if(params.report.cards){
                const cards = params.report.cards;

                self.cards = self.createCardDictionary(cards)

                Object.assign(self.cards, {
                    activityArchive: self.cards?.['activity archive material']
                });

                self.nameCards = {
                    name: self.cards?.['activity names'],
                    externalCrossReferences: self.cards?.['external cross references'],
                    systemReferenceNumbers: self.cards?.['system reference numbers'],
                    parent: self.cards?.['parent activities'],
                    recordStatus: self.cards?.['record status']
                };

                self.locationCards = {
                    location: {
                        card: self.cards?.['location data'],
                        subCards: {
                            addresses: 'addresses',
                            nationalGrid: 'national grid references',
                            administrativeAreas: 'localities/administrative areas',
                            locationDescriptions: 'location descriptions',
                            areaAssignment: 'area assignments',
                            landUse: 'land use classification assignment',
                            namedLocations: 'named locations'
                        }
                    }
                }

                Object.assign(self.protectionCards, self.locationCards);

                self.descriptionCards = {
                    descriptions: self.cards?.['activity descriptions'],
                    citation: self.cards?.['associated bibliographic sources'],
                };

                self.classificationCards = {
                    type: self.cards?.['activity type'],
                    activityTimespan: self.cards?.['activity timespan'],
                };

                self.peopleCards = {
                    people: self.cards?.['associated people and organizations']
                };

                self.resourcesCards = {
                    consultations: self.cards?.['associated consultations'],
                    activities: self.cards?.['associated activities'],
                    archive: self.cards?.['associated archive objects'],
                    assets: self.cards?.['associated heritage assets, areas and artefacts'],
                    files: self.cards?.['associated digital files'],
                }
            }

        },
        template: activityTemplate
    });
});
