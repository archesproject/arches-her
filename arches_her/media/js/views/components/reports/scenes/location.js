define(['underscore', 'knockout', 'arches', 'utils/report','bindings/datatable', 'views/components/reports/scenes/map'], function(_, ko, arches, reportUtils) {
    return ko.components.register('views/components/reports/scenes/location', {
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
            self.addresses = ko.observableArray();
            self.descriptions = ko.observableArray();
            self.administrativeAreas = ko.observableArray();
            self.nationalGridReferences = ko.observableArray();
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
                const locationNode = self.getRawNodeValue(params.data(), ...self.dataConfig.location);
                if(!locationNode) {
                    return;
                }
                
                const geometryNode = self.getRawNodeValue(locationNode, 'geometry')
                if(geometryNode) {
                    const locationDataCoordinates = self.getNodeValue(geometryNode, 'geospatial coordinates');
                    if (locationDataCoordinates && locationDataCoordinates != '--') {
                        self.coordinateData = locationDataCoordinates;
                    };
                    self.geometryShape(self.getNodeValue(geometryNode, 'feature shape'));
                    self.geometryNotes(self.getNodeValue(geometryNode, 'spatial metadata descriptions', 'spatial metadata notes'));
                    self.geometryMetadata.compilerName(self.getNodeValue(geometryNode, 'spatial record compilation', 'spatial record compiler', 'compiler names', 'compiler name'));
                    self.geometryMetadata.compileDate(self.getNodeValue(geometryNode, 'spatial record compilation', 'spatial record compilation timespan', 'compilation start date'));
                    self.geometryMetadata.updateDate(self.getNodeValue(geometryNode, 'spatial record update', 'spatial record update timespan', 'update start date'));
                    self.geometryMetadata.updaterName(self.getNodeValue(geometryNode, 'spatial record update', 'spatial record updater', 'updater names', 'updater name'));
                    self.geometryMetadata.authorizationDate(self.getNodeValue(geometryNode, 'spatial record authorization', 'authorization timespan', 'date of authorization'));
                    self.geometryMetadata.authorizerName(self.getNodeValue(geometryNode, 'spatial record authorization', 'authorizer', 'authorizer names', 'authorizer name'));
                    self.geometryMetadata.typeOfAuthorization(self.getNodeValue(geometryNode, 'spatial record authorization', 'authorization type'));
                    self.recordEditExists(self.observableValueSet(self.geometryMetadata));

                    self.geometryScale.accuracy(self.getNodeValue(geometryNode, 'spatial accuracy qualifier'));
                    self.geometryScale.basemap(self.getNodeValue(geometryNode, 'current base map', 'current base map names', 'current base map name'));
                    self.geometryScale.captureScale(self.getNodeValue(geometryNode, 'capture scale'));
                    self.geometryScale.coordinateSystem(self.getNodeValue(geometryNode, 'coordinate system', 'coordinate system value'));
                    self.geometryScaleExists(self.observableValueSet(self.geometryScale));

                }

                const addressesNode = self.getRawNodeValue(locationNode, 'addresses');
                if(addressesNode) {
                    if(addressesNode?.length){
                        self.addresses(addressesNode.map(x => {
                            const buildingName = self.getNodeValue(x, 'building name', 'building name value');
                            const buildingNumber = self.getNodeValue(x, 'building number', 'building number value');
                            const buildingNumberSubStreet = self.getNodeValue(x, 'building number sub-street', 'building number sub-street value');
                            const county = self.getNodeValue(x, 'county', 'county value');
                            const currency = self.getNodeValue(x, 'address currency');
                            const fullAddress = self.getNodeValue(x, 'full address');
                            const locality = self.getNodeValue(x, 'locality', 'locality value');
                            const postcode = self.getNodeValue(x, 'postcode', 'postcode value');
                            const status = self.getNodeValue(x, 'address status');
                            const street = self.getNodeValue(x, 'street', 'street value');
                            const subStreet = self.getNodeValue(x, 'sub-street ', 'sub-street value');
                            const tileid = self.getTileId(x);
                            const town = self.getNodeValue(x, 'town or city', 'town or city value');
                            return { buildingName, buildingNumber, buildingNumberSubStreet, county, currency, fullAddress, locality, postcode, status, street, subStreet, tileid, town };
                        }));
                    }
                }

                const administrativeAreasNode = self.getRawNodeValue(locationNode, 'localities/administrative areas');
                if(Array.isArray(administrativeAreasNode)) {
                    self.administrativeAreas(administrativeAreasNode.map(x => {
                        const currency = self.getNodeValue(x, 'area currency type');
                        const name = self.getNodeValue(x, 'area names', 'area name');
                        const tileid = self.getTileId(x); 
                        const type = self.getNodeValue(x, 'area type');
                        return { currency, name, tileid, type };
                    }));
                }

                const areaAssignmentsNode = self.getRawNodeValue(locationNode, 'area', 'area assignments');
                if(Array.isArray(areaAssignmentsNode)) {
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

                const locationDescriptionsNode = self.getRawNodeValue(locationNode, 'location descriptions');
                if(locationDescriptionsNode?.length){
                    self.descriptions(locationDescriptionsNode.map(x => {
                        const type = self.getNodeValue(x, 'location description type');
                        const description = self.getNodeValue(x, 'location description');
                        const tileid = self.getTileId(x);
                        return {type, description, tileid};
                    }));
                }

                const nationalGridReferencesNode = self.getRawNodeValue(locationNode, 'national grid references');
                if(nationalGridReferencesNode?.length){
                    self.nationalGridReferences(nationalGridReferencesNode.map(x => {
                        const reference = self.getNodeValue(x, 'national grid reference');
                        const tileid = self.getTileId(x);
                        return {reference, tileid};
                    }));
                }

            }
        },
        template: { require: 'text!templates/views/components/reports/scenes/location.htm' }
    });
});