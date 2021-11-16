define(['underscore', 'knockout', 'arches', 'utils/report','bindings/datatable', 'views/components/reports/scenes/map'], function(_, ko, arches, reportUtils) {
    return ko.components.register('views/components/reports/scenes/protection', {
        viewModel: function(params) {
            const self = this;
            Object.assign(self, reportUtils);

            self.dataConfig = {
                location: 'location data',
            }

            self.cards = {};
            self.selectedGeometry = params.selectedGeometry || ko.observable();
            self.edit = params.editTile || self.editTile;
            self.delete = params.deleteTile || self.deleteTile;
            self.add = params.addTile || self.addNewTile;
            self.visible = {
                geometryMetadata: ko.observable(true),
                locality: ko.observable(true),
                coordinates: ko.observable(true),
                addresses: ko.observable(true),
                descriptions: ko.observable(true),
                administrativeAreas: ko.observable(true),
                nationalGrid: ko.observable(true),
                areaAssignment: ko.observable(true),
                landUse: ko.observable(true),
            }
            Object.assign(self.dataConfig, params.dataConfig || {});

            self.locationTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(6).fill(null)
            };

            self.addressTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(14).fill(null)
            };

            self.locDescriptionsTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(3).fill(null)
            };

            self.adminAreasTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(4).fill(null)
            };

            self.gridReferencesTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(2).fill(null)
            };

            self.areaAssignmentsTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(8).fill(null)
            };

            self.landUseTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(7).fill(null)
            };

            self.coordinateData = ko.observable();
            self.geometryMetadata = {
                compilerName: ko.observable(),
                compileDate: ko.observable(),
                updateDate: ko.observable(),
                updaterName: ko.observable(),
                authorizerName: ko.observable(),
                authorizationDate: ko.observable(),
                typeOfAuthorization: ko.observable()
            };
            self.geometryScale = {
                captureScale: ko.observable(),
                coordinateSystem: ko.observable(),
                basemap: ko.observable(),
                accuracy: ko.observable()
            };
            self.geometryShape = ko.observable();
            self.geometryNotes = ko.observable();
            self.recordEditExists = ko.observable(false);
            self.geometryScaleExists = ko.observable(false);
            self.areaAssignment = ko.observableArray();
            self.landUseClassification = ko.observableArray();


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

            // if params.compiled is set and true, the user has compiled their own data.  Use as is.
            if(params?.compiled){
            } else {
                const locationNode = self.getRawNodeValue(params.data(), self.dataConfig.location);


                const areaAssignmentsNode = self.getRawNodeValue(locationNode, 'area', 'area assignments');
                if(areaAssignmentsNode){
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

                const landUseClassificationNode = self.getRawNodeValue(locationNode, 'land use classification assignment');
                if(landUseClassificationNode) {
                    const classification = self.getNodeValue(landUseClassificationNode, 'land use classification');
                    const endDate = self.getNodeValue(landUseClassificationNode, 'land use assessment timespan', 'land use assessment end date');
                    const geology = self.getNodeValue(landUseClassificationNode, 'geology');
                    const reference = self.getNodeValue(landUseClassificationNode, 'land use notes', 'land use notes value');
                    const startDate = self.getNodeValue(landUseClassificationNode, 'land use assessment timespan', 'land use assessment start date');
                    const subSoil = self.getNodeValue(landUseClassificationNode, 'sub-soil');
                    const tileid = self.getTileId(landUseClassificationNode);
                    if(self.observableValueSet(classification, endDate, geology, reference, startDate, subSoil)){
                        self.landUseClassification([{classification, endDate, geology, reference, startDate, subSoil, tileid}]);
                    }
                }



            }
        },
        template: { require: 'text!templates/views/components/reports/scenes/protection.htm' }
    });
});