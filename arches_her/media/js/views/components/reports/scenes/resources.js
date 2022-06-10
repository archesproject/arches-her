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

            self.applicationAreaTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(2).fill(null)
            };

            self.dataConfig = {
                activities: 'associated activities',
                consultations: 'associated consultations',
                files: 'associated files',
                assets: 'associated monuments, areas and artefacts',
                archive: 'associated archives',
                actors: 'associated actors'
            }

            self.cards = Object.assign({}, params.cards);
            self.edit = params.editTile || self.editTile;
            self.delete = params.deleteTile || self.deleteTile;
            self.add = params.addTile || self.addNewTile;
            self.activities = ko.observableArray();
            self.consultations = ko.observableArray();
            self.files = ko.observableArray();
            self.archive = ko.observableArray();
            self.actors = ko.observableArray();
            self.assets = ko.observableArray();
            self.assets_rob = ko.observableArray();
            self.translation = ko.observableArray();
            self.applicationArea = ko.observableArray();
            self.period = ko.observableArray();
            self.visible = {
                period: ko.observable(true),
                archive: ko.observable(true),
                activities: ko.observable(true),
                consultations: ko.observable(true),
                files: ko.observable(true),
                actors: ko.observable(true),
                assets: ko.observable(true),
                applicationArea: ko.observable(true),
                translation: ko.observable(true)
            }
            Object.assign(self.dataConfig, params.dataConfig || {});

            // if params.compiled is set and true, the user has compiled their own data.  Use as is.
            if (params?.compiled) {
            } else {
                const associatedActivitiesNode = self.getRawNodeValue(params.data(), self.dataConfig.activities, 'instance_details');
                if(Array.isArray(associatedActivitiesNode)){
                    const tileid = self.getTileId(self.getRawNodeValue(params.data(), self.dataConfig.activities));
                    self.activities(associatedActivitiesNode.map(x => {
                        const activity = self.getNodeValue(x);
                        const resourceUrl = self.getResourceLink(x);
                        return { activity, resourceUrl, tileid };
                    }));
                }

                const associatedConsultationsNode = self.getRawNodeValue(params.data(), self.dataConfig.consultations, 'instance_details');
                if(Array.isArray(associatedConsultationsNode)){
                    const tileid = self.getTileId(self.getRawNodeValue(params.data(), self.dataConfig.consultations));
                    self.consultations(associatedConsultationsNode.map(x => {
                        const consultation = self.getNodeValue(x);
                        const resourceUrl = self.getResourceLink(x);
                        return { consultation, resourceUrl, tileid };
                    }));
                }


                const associatedArchiveNode = self.getRawNodeValue(params.data(), self.dataConfig.archive);
                if(Array.isArray(associatedArchiveNode)){
                    let key = 'Associated Archive Objects';
                    if (!(key in associatedArchiveNode[0])) {
                        key = undefined;
                    }
                    self.archive(associatedArchiveNode.map(x => {
                        const archiveHolders = [];
                        var reference;
                        var title;
                        var tileid;
                        var holders;
                        if (key) {
                            reference = self.getNodeValue(x, key, 'archive object references', 'archive object reference');
                            title = self.getNodeValue(x, key, 'archive object titles', 'archive object title');
                            tileid = self.getTileId(x);
                            holders = self.getRawNodeValue(x, key, 'archive holder', 'instance_details');
                        } else {
                            reference = self.getNodeValue(x, 'archive object references', 'archive object reference');
                            title = self.getNodeValue(x, 'archive object titles', 'archive object title');
                            tileid = self.getTileId(x);
                            holders = self.getRawNodeValue(x, 'archive holder', 'instance_details');
                        }
                        holders?.forEach(element => {
                            archiveHolders.push({
                                holder: self.getNodeValue(element),
                                holderLink: self.getResourceLink(element)
                            });
                        });
                        return { archiveHolders, reference, title, tileid };
                    }));
                }

                const associatedFilesNode = self.getRawNodeValue(params.data(), self.dataConfig.files, 'instance_details');
                if(Array.isArray(associatedFilesNode)){
                    const tileid = self.getTileId(self.getRawNodeValue(params.data(), self.dataConfig.files));
                    self.files(associatedFilesNode.map(x => {
                        const file = self.getNodeValue(x);
                        const resourceUrl = self.getResourceLink(x);
                        return { file, resourceUrl, tileid };
                    }));
                }

                const associatedArtifactsNode = self.getRawNodeValue(params.data(), self.dataConfig.assets);
                if (associatedArtifactsNode) {
                    if(Array.isArray(associatedArtifactsNode)){
                        let key = 'Monument, Area or Artefact';
                        if (!(key in associatedArtifactsNode[0])) {
                            key = 'Associated Monument, Area or Artefact';
                        }
                        self.assets(associatedArtifactsNode.map(x => {
                            var resource = [];
                                for (const element of x[key]['instance_details']) {
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
                    } else {
                        const instanceDetails = self.getRawNodeValue(associatedArtifactsNode, 'instance_details');
                        if (Array.isArray(instanceDetails)) {
                            const tileid = self.getTileId(associatedArtifactsNode);
                            self.assets(instanceDetails.map(x => {
                                const resourceName = self.getNodeValue(x);
                                const resourceUrl = self.getResourceLink(x);
                                return { resource: [{ resourceName, resourceUrl }], association: '--', tileid };
                            }));
                        }
                    }
                }

                const associatedActorsNode = self.getRawNodeValue(params.data(), self.dataConfig.actors);
                if (associatedActorsNode){
                    if(Array.isArray(associatedActorsNode)){
                        self.actors(associatedActorsNode.map(x => {
                            const associatedActors = []
                            const actorInstances = self.getRawNodeValue(x, {
                                testPaths:[
                                    ['associated actor', 'actor', 'instance_details']
                                ]
                            })
                            actorInstances?.forEach(element => {
                                associatedActors.push({
                                    actor: self.getNodeValue(element),
                                    actorLink: self.getResourceLink(element)
                                });
                            });
                            const tileid = self.getTileId(x);
                            return {associatedActors, tileid};
                        }))
                    }
                }

                const relatedApplicationArea = self.getRawNodeValue(params.data(), self.dataConfig.relatedApplicationArea, 'geometry', 'related application area', 'instance_details');
                if(Array.isArray(relatedApplicationArea)){
                    const tileid = self.getTileId(self.getRawNodeValue(params.data(), self.dataConfig.relatedApplicationArea, 'geometry', 'related application area'))
                    self.applicationArea(relatedApplicationArea.map(x => {
                        const resource = self.getNodeValue(x);
                        const resourceLink = self.getResourceLink(x);
                        return {resource, resourceLink, tileid};
                    }));
                }

                const translationNode = self.getRawNodeValue(params.data(), self.dataConfig.translation, 'instance_details');
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
                    if(rawPeriodNode){
                        const periodNode = Array.isArray(rawPeriodNode) ? rawPeriodNode : [rawPeriodNode];
                        self.period(periodNode.map(x => {
                            var resource = [];
                                for (const element of x['instance_details']) {
                                if (element) {
                                    resource.push({
                                        resourceName: self.getNodeValue(element),
                                        resourceUrl: self.getResourceLink(element)
                                    });
                                }
                            }
                            const tileid = self.getTileId(x);
                            return { resource, tileid };
                        }));
                    }
                }

            }
        },
        template: { require: 'text!templates/views/components/reports/scenes/resources.htm' }
    });
});
