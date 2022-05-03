define(['underscore', 'knockout', 'arches', 'utils/report', 'bindings/datatable'], function (_, ko, arches, reportUtils) {
    return ko.components.register('views/components/reports/scenes/resources', {
        viewModel: function (params) {
            const self = this;
            Object.assign(self, reportUtils);

            //Related Resource 2 column table configuration
            self.relatedResourceTwoColumnTableConfig = {
                ...self.defaultTableConfig,
                paging: true,
                searching: true,
                scrollY: "250px",
                columns: Array(2).fill(null)
            };


            //Related Resource 2 column table configuration
            self.archiveHolderTableConfig = {
                ...self.defaultTableConfig,
                paging: true,
                searching: true,
                scrollY: "250px",
                columns: Array(4).fill(null)
            };

            //Related Resource 3 column table configuration
            self.relatedResourceThreeColumnTableConfig = {
                ...self.defaultTableConfig,
                paging: true,
                searching: true,
                scrollY: "250px",
                columns: Array(3).fill(null)
            };

            self.dataConfig = {
                activities: 'associated activities',
                consultations: 'associated consultations',
                files: 'associated files',
                assets: 'associated heritage assets, areas and artefacts'
            }

            self.cards = Object.assign({}, params.cards);
            self.edit = params.editTile || self.editTile;
            self.delete = params.deleteTile || self.deleteTile;
            self.add = params.addTile || self.addNewTile;
            self.activities = ko.observableArray();
            self.consultations = ko.observableArray();
            self.files = ko.observableArray();
            self.archive = ko.observableArray();
            self.assets = ko.observableArray();
            self.assets_rob = ko.observableArray();
            self.translation = ko.observableArray();
            self.period = ko.observableArray();
            self.visible = {
                period: ko.observable(true),
                archive: ko.observable(true),
                activities: ko.observable(true),
                consultations: ko.observable(true),
                files: ko.observable(true),
                assets: ko.observable(true),
                translation: ko.observable(true)
            }
            Object.assign(self.dataConfig, params.dataConfig || {});

            // if params.compiled is set and true, the user has compiled their own data.  Use as is.
            if (params?.compiled) {
            } else {
                const associatedActivitiesNode = self.getRawNodeValue(params.data(), self.dataConfig.activities, 'instance_details');
                if(Array.isArray(associatedActivitiesNode)){
                    self.activities(associatedActivitiesNode.map(x => {
                        const activity = self.getNodeValue(x);
                        const tileid = self.getTileId(x);
                        const resourceUrl = self.getResourceLink(x);
                        return { activity, resourceUrl, tileid };
                    }));
                }

                const associatedConsultationsNode = self.getRawNodeValue(params.data(), self.dataConfig.consultations, 'instance_details');
                if(Array.isArray(associatedConsultationsNode)){
                    self.consultations(associatedConsultationsNode.map(x => {
                        const consultation = self.getNodeValue(x);
                        const tileid = self.getTileId(x);
                        const resourceUrl = self.getResourceLink(x);
                        return { consultation, resourceUrl, tileid };
                    }));
                }


                const associatedArchiveNode = self.getRawNodeValue(params.data(), self.dataConfig.archive);
                if(Array.isArray(associatedArchiveNode)){
                    self.archive(associatedArchiveNode.map(x => {
                        const holder = self.getNodeValue(x, 'archive holder');
                        const holderLink = self.getResourceLink(self.getRawNodeValue(x, 'archive holder'));
                        const reference = self.getNodeValue(x, 'archive object references', 'archive object reference');
                        const title = self.getNodeValue(x, 'archive object titles', 'archive object title');
                        const tileid = self.getTileId(x);
                        return { holder, holderLink, reference, title, tileid };
                    }));
                }

                const associatedFilesNode = self.getRawNodeValue(params.data(), self.dataConfig.files, 'instance_details');
                if(Array.isArray(associatedFilesNode)){
                    self.files(associatedFilesNode.map(x => {
                        const file = self.getNodeValue(x);
                        const resourceUrl = self.getResourceLink(x);
                        return { file, resourceUrl, tileid };
                    }));
                }

                const associatedArtifactsNode = self.getRawNodeValue(params.data(), self.dataConfig.assets, 'instance_details');
                if(Array.isArray(associatedArtifactsNode)){
                    self.assets(associatedArtifactsNode.map(x => {
                        var resource = [];
                        for (const element of x?.['Associated Heritage Asset, Area or Artefact']?.['instance_details']) {
                            if (element) {
                                resource.push({
                                    resourceName: self.getNodeValue(element),
                                    resourceUrl: self.getResourceLink(element)
                                });
                            }
                        }
                        const association = self.getNodeValue(x, 'association type');
                        const tileid = self.getTileId(x);
                        return { resource, association, tileid };
                    }));
                }

                const translationNode = self.getRawNodeValue(params.data(), self.dataConfig.translation);
                if (Array.isArray(translationNode)) {
                    self.translation(translationNode.map(x => {
                        const resource = self.getNodeValue(x);
                        const resourceLink = self.getResourceLink(self.getRawNodeValue(x));
                        const tileid = self.getTileId(x);
                        return { resource, resourceLink, tileid };
                    }));
                }

                if (self.dataConfig.period) {
                    const rawPeriodNode = self.getRawNodeValue(params.data(), self.dataConfig.period);
                    const periodNode = Array.isArray(rawPeriodNode) ? rawPeriodNode : [rawPeriodNode];

                    self.period(periodNode.map(x => {
                        const resource = self.getNodeValue(x);
                        const resourceLink = self.getResourceLink(self.getRawNodeValue(x));
                        const tileid = self.getTileId(x);
                        return { resource, resourceLink, tileid };
                    }));
                }
            }
        },
        template: { require: 'text!templates/views/components/reports/scenes/resources.htm' }
    });
});
