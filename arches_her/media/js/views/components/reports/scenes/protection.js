define([
    'underscore',
    'knockout',
    'arches',
    'utils/report',
    'templates/views/components/reports/scenes/protection.htm',
    'bindings/datatable',
    'views/components/reports/scenes/map'
], function(_, ko, arches, reportUtils, protectionReportTemplate) {
    return ko.components.register('views/components/reports/scenes/protection', {
        viewModel: function(params) {
            const self = this;
            Object.assign(self, reportUtils);

            self.dataConfig = {
                location: ['location data'],
                protection: 'designation and protection assignment',
                landUse: 'land use classification assignment',
                areaAssignment: ['area', 'area assignments']
            }

            self.cards = params.cards || {};
            self.selectedGeometry = params.selectedGeometry || ko.observable();
            self.edit = params.editTile || self.editTile;
            self.delete = params.deleteTile || self.deleteTile;
            self.add = params.addTile || self.addNewTile;
            self.visible = {
                geospatial: ko.observable(true),
                designations: ko.observable(true),
                map: ko.observable(true),
                areaAssignment: ko.observable(true),
                landUse: ko.observable(true),
            }
            Object.assign(self.dataConfig, params.dataConfig || {});

            self.areaAssignmentsTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(8).fill(null)
            };

            self.landUseTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(7).fill(null)
            };

            self.designationTableConfig = {
                ...this.defaultTableConfig,
                columns: Array(10).fill(null)
            };

            self.currentDesignation = ko.observable();
            self.selectedGeometry = ko.observable();
            self.locationRoot = undefined;
            self.coordinateData = ko.observable();

            self.geojson = ko.observable();
            self.areaAssignment = ko.observableArray();
            self.landUseClassification = ko.observableArray();
            self.designations = ko.observableArray();

            // utitility function - checks whether at least one observable (or array object)
            // has a set value (used to determine whether a section is visible)
            self.observableValueSet = (...observables) => {
                for(observable of observables) {
                    if(ko.isObservable(observable)){
                        observableValue = ko.unwrap(observable);
                        if (observableValue && observableValue != "--"){
                            return true;
                        }
                    } else if (typeof observable === "object" && observable !== null){
                        for(key of Object.keys(observable)){
                            if(ko.isObservable(observable[key])){
                                observableValue = ko.unwrap(observable[key]);
                                if (observableValue && observableValue != "--"){
                                    return true;
                                }
                            }
                        }
                    }
                }
                return false;
            }

            self.jumpToDesignationGeometry = (row) => {
                self.selectedGeometry(row.geometry);
            };

            const setupCards = (tileid) => {
                if(self.cards.location){
                    const subCards = self.cards.location.subCards;
                    const rootCard = self.locationRoot;
                    const tileCards = self.createCardDictionary(rootCard.tiles().find(rootTile => rootTile.tileid == tileid)?.cards);
                    if(tileCards){
                        tileCards.landUse = tileCards?.[subCards.landUse];
                        tileCards.areaAssignment = tileCards?.[subCards.areaAssignment];
                        Object.assign(self.cards, tileCards);
                    }
                }
            }

            // if params.compiled is set and true, the user has compiled their own data.  Use as is.
            if(params?.compiled){
            } else {
                const protectionNode = self.getRawNodeValue(params.data(), self.dataConfig.protection); 
                if (protectionNode?.length) {
                    this.designations(protectionNode.map(x => {
                        const name = self.getNodeValue(x, 'designation names', 'designation name');
                        const protectionType = self.getNodeValue(x, 'designation or protection type');
                        const startDate = self.getNodeValue(x, 'designation and protection timespan', 'designation start date');
                        const endDate = self.getNodeValue(x, 'designation and protection timespan', 'designation end date');
                        const grade = self.getNodeValue(x, 'grade');
                        const risk = self.getNodeValue(x, 'risk status');
                        const amendmentDate = self.getNodeValue(x, 'designation and protection timespan', 'designation amendment date');
                        const displayDate = self.getNodeValue(x, 'designation and protection timespan', 'display date');
                        const reference = self.getNodeValue(x, 'reference url', 'url');
                        const tileid = self.getTileId(x);
                        const geometry = self.getNodeValue(x, 'designation mapping', 'designation geometry');
                        return {
                            amendmentDate,
                            displayDate,
                            endDate,
                            geometry,
                            grade, 
                            name,
                            protectionType,
                            reference,
                            risk,
                            startDate,
                            tileid
                        };
                    }));

                    self.geojson(self.designations().reduce((geojson, currentJson) => {
                        const tileId = currentJson.tileid;
                        if (currentJson.geometry.features) {
                            const jsonWithTileId = currentJson.geometry.features.map(x => {
                                x.properties.tileId = tileId;
                                return x;
                            });
                            geojson.features = [...geojson.features, ...jsonWithTileId];
                        }
                        return geojson;
                    }, {features: [], type: 'FeatureCollection'}));
                }
                const locationNode = self.getRawNodeValue(params.data(), ...self.dataConfig.location);

                if(self.cards?.location?.card){
                    self.locationRoot = self.cards?.location?.card;
                }

                if(locationNode){
                    setupCards(self.getTileId(locationNode))
                }

                if(self.dataConfig.areaAssignment){
                    const areaAssignmentsNode = self.getRawNodeValue(locationNode, ...self.dataConfig.areaAssignment);
                    if(Array.isArray(areaAssignmentsNode)){
                        self.areaAssignment(areaAssignmentsNode.map(x => {
                            const endDate = self.getNodeValue(x, 'area status timespan', 'area status end date');
                            const ownership = self.getNodeValue(x, 'ownership');
                            const reference = self.getNodeValue(x, 'area reference', 'area reference value');
                            const shineForm = self.getNodeValue(x, 'shine - form');
                            const shineSignificance = self.getNodeValue(x, 'shine - significance');
                            const startDate = self.getNodeValue(x, 'area status timespan', 'area status start date');
                            const status = self.getNodeValue(x, 'area status');
                            const tileid = self.getTileId(x);
                            return {endDate, ownership, reference, shineForm, shineSignificance, startDate, status, tileid};
                        }));
                    }
                }

                let landUseClassificationNode = self.getRawNodeValue(locationNode, self.dataConfig.landUse);
                if(landUseClassificationNode) {
                    if (!Array.isArray(landUseClassificationNode)){
                        landUseClassificationNode = [ landUseClassificationNode ];
                    }
                    self.landUseClassification(landUseClassificationNode.map(x => {
                        const classification = self.getNodeValue(x, 'land use classification');
                        const endDate = self.getNodeValue(x, 'land use assessment timespan', 'land use assessment end date');
                        const geology = self.getNodeValue(x, 'geology');
                        const reference = self.getNodeValue(x, 'land use notes', 'land use notes value');
                        const startDate = self.getNodeValue(x, 'land use assessment timespan', 'land use assessment start date');
                        const subSoil = self.getNodeValue(x, 'sub-soil');
                        const tileid = self.getTileId(x);
                        return {classification, endDate, geology, reference, startDate, subSoil, tileid};
                        })
                    )
                }
            }
        },
        template: protectionReportTemplate
    });
});