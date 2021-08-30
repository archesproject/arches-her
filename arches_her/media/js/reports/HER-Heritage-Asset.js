define([
    'knockout',
    'viewmodels/report',
    'arches',
    'views/components/map',
    'geojson-extent',
    'views/components/cards/select-feature-layers',
    'bindings/datatable',
    'bindings/codemirror'
    ], 
    (ko, ReportViewModel, arches, MapComponentViewModel, geojsonExtent, selectFeatureLayersFactory) => {
        return ko.components.register('HER-Heritage-Asset', {
            viewModel: function (params) {
                params.configKeys = [];
                this.currentDesignation = ko.observable();
                this.defaultTableConfig = {
                    responsive: {
                        breakpoints: [
                            {name: 'bigdesktop', width: Infinity},
                            {name: 'meddesktop', width: 1480},
                            {name: 'smalldesktop', width: 1280},
                            {name: 'medium', width: 1188},
                            {name: 'tabletl', width: 1024},
                            {name: 'btwtabllandp', width: 848},
                            {name: 'tabletp', width: 768},
                            {name: 'mobilel', width: 480},
                            {name: 'mobilep', width: 320}
                        ]
                    },
                    paging: false,
                    searching: false,
                    scrollCollapse: true,
                    info: false,
                    columnDefs: [{
                        orderable: false,
                        targets: -1
                    }]
                }

                //Set-up nav sections
                this.sections = [
                    {'id': 'name', 'title': 'Names/Indentifiers'},
                    {'id': 'description', 'title': 'Descriptions'},
                    {'id': 'location', 'title': 'Locations'},
                    {'id': 'designation', 'title': 'Designation/Protection'},
                    {'id': 'phase', 'title': 'Phases/Components'},
                    {'id': 'biblio', 'title': 'Bibliography'},
                    {'id': 'photos', 'title': 'Photos'},
                    {'id': 'sci', 'title': 'Scientific Dates'},
                    {'id': 'related', 'title': 'Associated Resources'},
                    {'id': 'json', 'title': 'JSON'}
                ];


                ReportViewModel.apply(this, [params]);

                const self = this;
                
                // Get cards for interactivity
                this.assetNameCard = this.report.cards.find(x => x.nodegroupid == "676d47f9-9c1c-11ea-9aa0-f875a44e0e11");
                this.assetDescriptionCard = this.report.cards.find(x => x.nodegroupid == "ba342e69-b554-11ea-a027-f875a44e0e11");
                this.externalCrossReferencesCard = this.report.cards.find(x => x.nodegroupid == "7b247f82-9c2b-11ea-84bf-f875a44e0e11");
                this.systemReferenceNumbersCard = this.report.cards.find(x => x.nodegroupid == "85336e1b-9c2d-11ea-a287-f875a44e0e11");
                this.constructionPhasesCard = this.report.cards.find(x => x.nodegroupid == '4a24d890-7bd5-11e9-9de9-80000b44d1d9')
                this.constructionComponentsCard = this.report.cards.find(x => x.nodegroupid == '55d6a53e-049c-11eb-8618-f875a44e0e11');
                this.usePhaseCard = this.report.cards.find(x => x.nodegroupid == 'c01aa119-8a25-11ea-8dd6-f875a44e0e11');
                this.bibliographyCard = this.report.cards.find(x => x.nodegroupid == 'c4230739-28ce-11eb-8b35-f875a44e0e11');
                this.designationsCard = this.report.cards.find(x => x.nodegroupid == '8fc1a099-b61f-11ea-8121-f875a44e0e11')
                this.photosCard = this.report.cards.find(x => x.nodegroupid == '46f25cd9-b6c7-11ea-8651-f875a44e0e11');
                this.scientificDateCard = this.report.cards.find(x => x.nodegroupid == "c0d8a80a-04ba-11eb-b44b-f875a44e0e11");
                this.associatedActivitiesCard = this.report.cards.find(x => x.nodegroupid == "6300b212-9801-11e9-b99f-00224800b26d");
                this.associatedActorsCard = this.report.cards.find(x => x.nodegroupid == "9682621d-0262-11eb-ab33-f875a44e0e11");
                this.associatedConsultationsCard = this.report.cards.find(x => x.nodegroupid == "e0991c1b-51b4-11eb-b7ef-f875a44e0e11");
                this.associatedFilesCard = this.report.cards.find(x => x.nodegroupid == "fc6b6b0b-5118-11eb-b342-f875a44e0e11");
                this.associatedArtifactsCard = this.report.cards.find(x => x.nodegroupid == "055b3e3f-04c7-11eb-8d64-f875a44e0e11");
                this.locationDataCard = this.report.cards.find(x => x.nodegroupid == "ca05bc7e-28cf-11eb-95f4-f875a44e0e11");
                const locationDataCardBase = this.locationDataCard.tiles()?.[0]?.cards ? this.locationDataCard.tiles()[0].cards : this.locationDataCard.cards()

                this.locationDescriptionsCard = locationDataCardBase.find(x => x.nodegroupid == "ca05bc6f-28cf-11eb-b549-f875a44e0e11");
                this.administrativeAreasCard = locationDataCardBase.find(x => x.nodegroupid == "ca05bc7b-28cf-11eb-87fa-f875a44e0e11");
                this.addressesCard = locationDataCardBase.find(x => x.nodegroupid == "ca05e365-28cf-11eb-8f65-f875a44e0e11");
                this.nationalGridReferencesCard = locationDataCardBase.find(x => x.nodegroupid == "ca05bc75-28cf-11eb-9c74-f875a44e0e11");
                this.areaAssignmentCard = locationDataCardBase.find(x => x.nodegroupid == "ca05bc78-28cf-11eb-92c7-f875a44e0e11");
                this.locationGeometryCard = locationDataCardBase.find(x => x.nodegroupid == "ca05bc72-28cf-11eb-9105-f875a44e0e11");
                this.landUseCard = locationDataCardBase.find(x => x.nodegroupid == "ca05e362-28cf-11eb-a619-f875a44e0e11");
                
                this.displayname = ko.observable(this.report.attributes.displayname);

                const createUnselectedLayers = (source) => {
                    const color = '#A020F0';
                    const visible = true;
                    const strokecolor = '#fff'

                    const layers = [{
                        "id": "unselected-feature-polygon-fill",
                        "type": "fill",
                        "minzoom": 11,
                        "filter": ['all',[
                            "==", "$type", "Polygon"
                        ]],
                        "paint": {
                            "fill-color": color,
                            "fill-outline-color": color,
                            "fill-opacity": 0.2
                        },
                        "layout": {
                            "visibility": visible ? "visible": "none"
                        }
                    },  {
                        "id": "unselected-feature-polygon-under-stroke",
                        "type": "line",
                        "minzoom": 15,
                        "filter": ['all',[
                            "==", "$type", "Polygon"
                        ]],
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round",
                            "visibility": visible ? "visible": "none"
                        },
                        "paint": {
                            "line-color": strokecolor,
                            "line-width": 4
                        }
                    }, {
                        "id": "unselected-feature-polygon-stroke",
                        "type": "line",
                        "minzoom": 11,
                        "filter": ['all',[
                            "==", "$type", "Polygon"
                        ]], 
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round",
                            "visibility": visible ? "visible": "none"
                        },
                        "paint": {
                            "line-color": color,
                            "line-width": 2
                        }
                    }, {
                        "id": "unselected-feature-line",
                        "type": "line",
                        "minzoom": 15,
                        "filter": ['all',[
                            "==", "$type", "LineString"
                        ]],
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round",
                            "visibility": visible ? "visible": "none"
                        },
                        "paint": {
                            "line-color": color,
                            "line-width": 2
                        }
                    }, {
                        "id": "unselected-feature-point-point-stroke",
                        "type": "circle",
                        "minzoom": 15,
                        "filter": ['all',[
                            "==", "$type", "Point"
                        ]],
                        "paint": {
                            "circle-radius": 6,
                            "circle-opacity": 1,
                            "circle-color": "#fff"
                        },
                        "layout": {
                            "visibility": visible ? "visible": "none"
                        }
                    }, {
                        "id": "unselected-feature-point",
                        "type": "circle",
                        "minzoom": 15,
                        "filter": ['all',[
                            "==", "$type", "Point"
                        ]],
                        "paint": {
                            "circle-radius": 4,
                            "circle-color": color
                        },
                        "layout": {
                            "visibility": visible ? "visible": "none"
                        }
                    }];

                    layers.forEach((layer) => {
                        layer["source"] = source;
                    });

                    return layers;
                }

                this.prepareMap = (sourceId, geojson) => {
                    var mapParams = {};
                    if (geojson.features.length > 0) {
                        mapParams.bounds = geojsonExtent(geojson);
                        mapParams.fitBoundsOptions = { padding: 20 };
                    }
                    
                    var sourceConfig = {};
                    sourceConfig[sourceId] = {
                            "type": "geojson",
                            "data": geojson
                        };
                    mapParams.sources = Object.assign(sourceConfig, mapParams.sources);
                    mapParams.layers = [...selectFeatureLayersFactory(
                        '', //resourceid
                        sourceId, //source
                        undefined, //sourceLayer
                        [], //selectedResourceIds
                        true, //visible
                        '#ff2222' //color
                    ), ...createUnselectedLayers(sourceId)];
                    MapComponentViewModel.apply(this, [Object.assign({},  mapParams,
                        {
                            "activeTab": ko.observable(false),
                            "zoom": null
                        }
                    )]);
                    
                    this.layers = mapParams.layers; 
                    this.sources = mapParams.sources;
                    this.map = ko.observable();
                };

                const changeSelectedSource = (layers, source) => {
                    layers.forEach(x => {
                        if(x.id.startsWith('select-')){ x.source = source; }
                    })
                };

                this.jumpToDesignationGeometry = (row) => {
                    self.map().
                        fitBounds(geojsonExtent(row.geometry));
                    const source = self.map().getSource('selected-designation')
                    if(source) {
                        data = row.geometry;
                    } else {
                        self.map().addSource('selected-designation', {
                            type: 'geojson', 
                            data: row.geometry
                        });
                    }
                    changeSelectedSource(self.layers, 'selected-designation');
                };

                // Used to add a new tile object to a given card.  If nested card, saves the parent tile for the
                // card and uses the same card underneath the parent tile.
                this.addNewTile = async (card) => {
                    let currentCard = card;
                    if(card.parentCard && !card.parent?.tileid){
                        await card.parentCard.saveParentTile();
                        currentCard = card.parentCard.tiles()?.[0].cards.find(x => x.nodegroupid == card.nodegroupid)
                    }
                    currentCard.canAdd() ? currentCard.selected(true) : currentCard.tiles()[0].selected(true);
                    if(currentCard.cardinality == "n" || (currentCard.cardinality == "1" && !currentCard.tiles().length)) {
                        const currentSubscription = currentCard.selected.subscribe(function(){
                            currentCard.showForm(true);
                            currentSubscription.dispose();
                        });
                    }
                }

                this.editTile = function(tileid, card){
                    const tile = card.tiles().find(y => tileid == y.tileid)
                    if(tile){
                        tile.selected(true);
                    }
                }

                this.deleteTile = (tileid, card) => {
                    const tile = card.tiles().find(y => tileid == y.tileid)
                    if(tile){
                        tile.deleteTile((err) => { 
                            console.log(err); 
                        }, () => {});
                    }
                }

                this.getNameTileNodeValue = (resource, ...args) => {
                    let node = ko.unwrap(resource);
                    for(let i = 0; i < args.length; ++i){
                        const arg = args[i];
                        node = node?.[arg];
                    }
                    const nodeValue = node?.["@display_value"]
                    const geojson = node?.geojson;
                    if(geojson){
                        return geojson;
                    }
                    if(nodeValue !== undefined){
                        if(nodeValue === "" || nodeValue === null){
                            return "--"
                        }
                        return $(`<span>${nodeValue}</span>`).text();
                    }
                    return "--";
                };

                const getResourceId = (resource) => {
                    return resource?.resourceId || resource?.instance_details?.[0]?.resourceId;
                }

                // utitility function - checks whether at least one observable
                // has a set value (used to determine whether a section is visible)
                const observableValueSet = (...observables) => {
                    for(observable of observables) {
                        observableValue = ko.unwrap(observable);
                        if (observableValue && observableValue != "--"){
                            return true;
                        }
                    }
                    return false;
                }

                this.hasGeometryMetadata = (geometry) => {
                    if(!self.locationDataCard.tiles().length) {
                        return false;
                    }
                    return observableValueSet(geometry.reviewer, geometry.compiler, geometry.lastUpdateName, geometry.accuracy, geometry.basemap, geometry.captureScale, geometry.coordinateSystem, geometry.description);
                }

                this.hasGeometryAuthorization = (geometry) => {
                    if(!self.locationDataCard.tiles().length) {
                        return false;
                    }
                    return observableValueSet(geometry.reviewer, geometry.compiler, geometry.lastUpdateName);
                }

                this.hasGeometrySourcesScale = (geometry) => {
                    if(!self.locationDataCard.tiles().length) {
                        return false;
                    }
                    return observableValueSet(geometry.accuracy, geometry.basemap, geometry.captureScale, geometry.coordinateSystem);
                }

                this.resource = ko.observable(params.report?.report_json);

                this.descriptions = ko.observableArray();
                this.bibliography = ko.observableArray();

                // set up observables for data in view
                this.names = {
                    assetNames: ko.observableArray(),
                    externalCrossReferences: ko.observableArray(),
                    systemReferenceNumbers: {
                        resourceId: ko.observable(),
                        legacyId: ko.observable(),
                        primaryReferenceNumber: ko.observable(),
                        tileid: ko.observable()
                    }
                }

                this.location = {
                    administrativeAreas: ko.observableArray(),
                    addresses: ko.observableArray(),
                    areaAssignment: ko.observableArray(),
                    geometry: {
                        accuracy: ko.observable(),
                        basemap: ko.observable(),
                        captureScale: ko.observable(),
                        compiler: ko.observable(),
                        compileDate: ko.observable(),
                        coordinateSystem: ko.observable(),
                        description: ko.observable(),
                        lastUpdate: ko.observable(),
                        lastUpdateName: ko.observable(),
                        reviewDate: ko.observable(),
                        reviewer: ko.observable(),
                        reviewType: ko.observable()
                    },
                    landUseClassification: ko.observableArray(),
                    descriptions: ko.observableArray(),
                    nationalGridReferences: ko.observableArray(),
                };

                this.designations = ko.observableArray();
                this.designationFiles = ko.observableArray();
                this.phase = {
                    constructionPhases: ko.observableArray(),
                    constructionComponents: ko.observableArray(),
                    usePhase: ko.observableArray()
                }

                this.photos = ko.observableArray();

                this.scientificDate = ko.observableArray();

                this.associatedResources = {
                    activities: ko.observableArray(),
                    actors: ko.observableArray(),
                    consultations: ko.observableArray(),
                    files: ko.observableArray(),
                    artifacts: ko.observableArray()
                }

                this.loadData = (resource) => {
                    const names = self.names;
                    const location = self.location;
                    const descriptions = self.descriptions;

                    names.assetNames(resource?.["Heritage Asset Names"]?.map(x => {
                        const currency = self.getNameTileNodeValue(x, 'Asset Name Currency');
                        const name = self.getNameTileNodeValue(x, 'Asset Name');
                        const tileid = x?.['@tile_id'];
                        const type = self.getNameTileNodeValue(x, 'Asset Name Use Type');
                        return { currency, name, tileid, type };
                    }) || []);

                    names.externalCrossReferences(resource?.["External Cross References"]?.map(x => {
                        const description = self.getNameTileNodeValue(x, 'External Cross Reference Notes', 'External Cross Reference Description');
                        const number = self.getNameTileNodeValue(x, 'External Cross Reference Number');
                        const source = self.getNameTileNodeValue(x, 'External Cross Reference Source');
                        const tileid = x?.['@tile_id'];
                        return { description, number, source, tileid };
                    }) || []);

                    const systemReferenceNumbers = resource?.["System Reference Numbers"];
                    if(systemReferenceNumbers) {
                        names.systemReferenceNumbers.legacyId(self.getNameTileNodeValue(systemReferenceNumbers, 'LegacyID', 'Legacy ID'));
                        names.systemReferenceNumbers.primaryReferenceNumber(self.getNameTileNodeValue(systemReferenceNumbers, 'PrimaryReferenceNumber', 'Primary Reference Number'));
                        names.systemReferenceNumbers.resourceId(self.getNameTileNodeValue(systemReferenceNumbers, 'UUID', 'ResourceID'));
                        names.systemReferenceNumbers.tileid(systemReferenceNumbers?.['@tile_id']);
                    }

                    descriptions(resource?.["Descriptions"]?.map(x => {
                        const type = self.getNameTileNodeValue(x, 'Description Type');
                        const description = self.getNameTileNodeValue(x, 'Description');
                        const tileid = x?.['@tile_id'];
                        return { description, tileid, type };
                    }) || []);

                    location.geometry.accuracy(
                        self.getNameTileNodeValue(resource, 'Location Data', 'Geometry', 'Spatial Accuracy Qualifier'));

                    const administrativeAreas = resource?.['Location Data']?.['Localities/Administrative Areas']
                    if(administrativeAreas?.length){
                        location.administrativeAreas(administrativeAreas.map(x => {
                            const currency = self.getNameTileNodeValue(x, 'Area Currency Type');
                            const name = self.getNameTileNodeValue(x, 'Area Names', 'Area Name');
                            const tileid = x?.['@tile_id'];
                            const type = self.getNameTileNodeValue(x, 'Area Type');
                            return { currency, name, tileid, type };
                        }));
                    }

                    const addresses = resource?.['Location Data']?.['Addresses'];
                    if(addresses?.length){
                        location.addresses(addresses.map(x => {
                            const buildingName = self.getNameTileNodeValue(x, 'Building Name', 'Building Name Value');
                            const buildingNumber = self.getNameTileNodeValue(x, 'Building Number', 'Building Number Value');
                            const buildingNumberSubStreet = self.getNameTileNodeValue(x, 'Building Number Sub-Street', 'Building Number Sub-Street Value');
                            const county = self.getNameTileNodeValue(x, 'County', 'County Value');
                            const currency = self.getNameTileNodeValue(x, 'Address Currency');
                            const fullAddress = self.getNameTileNodeValue(x, 'Full Address');
                            const locality = self.getNameTileNodeValue(x, 'Locality', 'Locality Value');
                            const postcode = self.getNameTileNodeValue(x, 'Postcode', 'Postcode Value');
                            const status = self.getNameTileNodeValue(x, 'Address Status');
                            const street = self.getNameTileNodeValue(x, 'Street', 'Street Value');
                            const subStreet = self.getNameTileNodeValue(x, 'Sub-Street ', 'Sub-Street Value');
                            const tileid = x?.['@tile_id'];
                            const town = self.getNameTileNodeValue(x, 'Town or City', 'Town or City Value');
                            return { buildingName, buildingNumber, buildingNumberSubStreet, county, currency, fullAddress, locality, postcode, status, street, subStreet, tileid, town };
                        }));
                    }

                    const areaAssignment = resource?.['Location Data']?.['Area']?.['Area Assignments'];
                    if(areaAssignment){
                        const endDate = self.getNameTileNodeValue(areaAssignment, 'Area Status Timespan', 'Area Status End Date');
                        const ownership = self.getNameTileNodeValue(areaAssignment, 'Ownership');
                        const reference = self.getNameTileNodeValue(areaAssignment, 'Area Reference', 'Area Reference Value');
                        const shineForm = self.getNameTileNodeValue(areaAssignment, 'SHINE - Form');
                        const shineSignificance = self.getNameTileNodeValue(areaAssignment, 'SHINE - Significance');
                        const startDate = self.getNameTileNodeValue(areaAssignment, 'Area Status Timespan', 'Area Status Start Date');
                        const status = self.getNameTileNodeValue(areaAssignment, 'Area Status');
                        const tileid = areaAssignment?.['@tile_id'];
                        location.areaAssignment([{endDate, ownership, reference, shineForm, shineSignificance, startDate, status, tileid}]);
                    }

                    const landUseClassification = resource?.['Location Data']?.['Land Use Classification Assignment'];
                    if(landUseClassification){
                        const classification = self.getNameTileNodeValue(landUseClassification, 'Land Use Classification');
                        const endDate = self.getNameTileNodeValue(landUseClassification, 'Land Use Assessment Timespan', 'Land Use Assessment End Date');
                        const geology = self.getNameTileNodeValue(landUseClassification, 'Geology');
                        const reference = self.getNameTileNodeValue(landUseClassification, 'Land Use Notes', 'Land Use Notes Value');
                        const startDate = self.getNameTileNodeValue(landUseClassification, 'Land Use Assessment Timespan', 'Land Use Assessment Start Date');
                        const subSoil = self.getNameTileNodeValue(landUseClassification, 'Sub-Soil');
                        const tileid = landUseClassification?.['@tile_id'];
                        location.landUseClassification([{classification, endDate, geology, reference, startDate, subSoil, tileid}]);
                    }

                    const locationDescriptions = resource?.['Location Data']?.['Location Descriptions'];
                    if(locationDescriptions?.length){
                        location.descriptions(locationDescriptions.map(x => {
                            const type = self.getNameTileNodeValue(x, 'Location Description Type');
                            const description = self.getNameTileNodeValue(x, 'Location Description');
                            const tileid = x?.['@tile_id'];
                            return {type, description, tileid};
                        }));
                    }

                    const nationalGridReferences = resource?.['Location Data']?.['National Grid References'];
                    if(nationalGridReferences?.length){
                        location.nationalGridReferences(nationalGridReferences.map(x => {
                            const reference = self.getNameTileNodeValue(x, 'National Grid Reference');
                            const tileid = x?.['@tile_id'];
                            return {reference, tileid};
                        }));
                    }

                    location.geometry.basemap(
                        self.getNameTileNodeValue(resource, 'Location Data', 'Geometry', 'Current Base Map', 'Current Base Map Names', 'Current Base Map Name')
                    );
                    location.geometry.compiler(
                        self.getNameTileNodeValue(resource, 'Location Data', 'Geometry', 'Spatial Record Compilation', 'Spatial Record Compiler', 'Compiler Names', 'Compiler Name')
                    );
                    location.geometry.compileDate(
                        self.getNameTileNodeValue(resource, 'Location Data', 'Geometry', 'Spatial Record Compilation', 'Spatial Record Compilation Timespan', 'Compilation Start Date')
                    );
                    location.geometry.coordinateSystem(
                        self.getNameTileNodeValue(resource, 'Location Data', 'Geometry', 'Coordinate System', 'Coordinate System Value')
                    );
                    location.geometry.description(
                        self.getNameTileNodeValue(resource, 'Location Data', 'Geometry', 'Spatial Metadata Descriptions', 'Spatial Metadata Notes')
                    );
                    location.geometry.lastUpdate(
                        self.getNameTileNodeValue(resource, 'Location Data', 'Geometry', 'Spatial Record Update', 'Spatial Record Update Timespan', 'Update Start Date')
                    );
                    location.geometry.lastUpdateName(
                        self.getNameTileNodeValue(resource, 'Location Data', 'Geometry', 'Spatial Record Update', 'Spatial Record Updater', 'Updater Names', 'Updater Name')
                    );
                    location.geometry.reviewDate(
                        self.getNameTileNodeValue(resource, 'Location Data', 'Geometry', 'Spatial Record Authorization', 'Authorization Timespan', 'Date of Authorization')
                    );
                    location.geometry.reviewer(
                        self.getNameTileNodeValue(resource, 'Location Data', 'Geometry', 'Spatial Record Authorization', 'Authorizer', 'Authorizer Names', 'Authorizer Name')
                    );
                    location.geometry.reviewType(
                        self.getNameTileNodeValue(resource, 'Location Data', 'Geometry', 'Spatial Record Authorization', 'Authorization Type')
                    );

                    const locationDataGeometry = self.getNameTileNodeValue(resource, 'Location Data', 'Geometry', 'Geospatial Coordinates');
                    if (locationDataGeometry) {
                        this.locationMapData = locationDataGeometry;
                    };   
                              
                    const designations = resource?.['Designation and Protection Assignment']; 
                    if (designations?.length) {
                        this.designations(designations.map(x => {
                            const name = self.getNameTileNodeValue(x, 'Designation Names', 'Designation Name');
                            const protectionType = self.getNameTileNodeValue(x, 'Designation or Protection Type');
                            const startDate = self.getNameTileNodeValue(x, 'Designation and Protection Timespan', 'Designation Start Date');
                            const endDate = self.getNameTileNodeValue(x, 'Designation and Protection Timespan', 'Designation End Date');
                            const grade = self.getNameTileNodeValue(x, 'Grade');
                            const risk = self.getNameTileNodeValue(x, 'Risk Status');
                            const amendmentDate = self.getNameTileNodeValue(x, 'Designation and Protection Timespan', 'Designation Amendment Date');
                            const displayDate = self.getNameTileNodeValue(x, 'Designation and Protection Timespan', 'Display Date');
                            const dateQualifier = self.getNameTileNodeValue(x, 'Designation and Protection Timespan', 'Date Qualifier');
                            const reference = self.getNameTileNodeValue(x, 'References', 'Reference');
                            const tileid = x?.['@tile_id'];
                            const geometry = 
                                self.getNameTileNodeValue(
                                    x, 
                                    'Designation Mapping', 
                                    'Designation Geometry'
                                );
                            return {
                                amendmentDate,
                                dateQualifier,
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

                        this.designationFiles(designations.map(x => {
                            const file = self.getNameTileNodeValue(x, 'Digital File(s)');
                            if (file == "") { return null; }
                            const designation = self.getNameTileNodeValue(x, 'Designation Names', 'Designation Name');
                            const tileid = x?.['@tile_id'];
                            return {
                                file, 
                                designation,
                                tileid
                            };
                        }).filter(x => x != null));

                        const geojson = this.designations().reduce((geojson, currentJson) => {
                            const tileId = currentJson.tileid;
                            const jsonWithTileId = currentJson.geometry.features.map(x => {
                                x.properties.tileId = tileId;
                                return x;
                            });
                            geojson.features = [...geojson.features, ...jsonWithTileId];
                            return geojson;
                        }, {features: [], type: 'FeatureCollection'})
                        
                        this.designationMapData = geojson;
                    };

                    const constructionPhases = resource?.['Construction Phases'];
                    if(constructionPhases?.length) {
                        this.phase.constructionPhases(constructionPhases.map(x => {
                            const constructionMaterial = self.getNameTileNodeValue(x, 'Main Construction Material');
                            const constructionTechnique = self.getNameTileNodeValue(x, 'Construction Technique');
                            const coveringMaterial = self.getNameTileNodeValue(x, 'Covering Material');
                            const dateConfidence = self.getNameTileNodeValue(x, 'Construction Phase Timespan', 'Confidence of Dating');
                            const dateQualifier = self.getNameTileNodeValue(x, 'Construction Phase Timespan', 'Construction Phase Date Qualifier');
                            const displayDate = self.getNameTileNodeValue(x, 'Construction Phase Timespan', 'Construction Phase Display Date');
                            const endDate = self.getNameTileNodeValue(x, 'Construction Phase Timespan', 'Construction Phase End Date');
                            const interpretationConfidence = self.getNameTileNodeValue(x, 'Phase Classification', 'Phase Certainty');
                            const method = self.getNameTileNodeValue(x, 'Construction Method');
                            const period = self.getNameTileNodeValue(x, 'Cultural Period');
                            const phase = self.getNameTileNodeValue(x, 'Construction Phase Type');
                            const phaseDescription = self.getNameTileNodeValue(x, 'Phase Classification', 'Phase Classification Description', 'Phase Description');
                            const phaseEvidence = self.getNameTileNodeValue(x, 'Phase Classification', 'Construction Phase Evidence Type');
                            const startDate = self.getNameTileNodeValue(x, 'Construction Phase Timespan', 'Construction Phase Start Date');
                            const tileid = x?.['@tile_id'];
                            const assetType = self.getNameTileNodeValue(x, 'Phase Classification', 'Asset Type');

                            return { 
                                assetType,
                                constructionMaterial, 
                                constructionTechnique, 
                                coveringMaterial, 
                                dateConfidence, 
                                dateQualifier, 
                                displayDate, 
                                endDate, 
                                interpretationConfidence,
                                method, 
                                period, 
                                phase, 
                                phaseDescription, 
                                phaseEvidence, 
                                startDate, 
                                tileid
                            };
                        }));
                    }

                    const constructionComponents = resource?.['Components'];
                    if(constructionComponents?.length) {
                        this.phase.constructionComponents(constructionComponents.map(x => {
                            const constructionPhase = self.getNameTileNodeValue(x, 'Associated Asset Construction Phase');
                            const component = self.getNameTileNodeValue(x, 'Component', 'Component Type');
                            const material = self.getNameTileNodeValue(x, 'Component', 'Component Material');
                            const technique = self.getNameTileNodeValue(x, 'Construction Technique');
                            const evidence = self.getNameTileNodeValue(x, 'Component Attribute Assignment', 'Component Evidence Type');
                            const tileid = x?.['@tile_id'];

                            return { 
                                constructionPhase,
                                component,
                                material,
                                technique,
                                evidence,
                                tileid
                            };
                        }));
                    }

                    const usePhase = resource?.['Use Phase'];
                    if(usePhase){
                        const type = self.getNameTileNodeValue(usePhase, 'Use Phase Classification', 'Functional Type');
                        const period = self.getNameTileNodeValue(usePhase, 'Use Phase Period');
                        const startDate = self.getNameTileNodeValue(usePhase, 'Use Phase Timespan', 'Use Phase End Date');
                        const endDate = self.getNameTileNodeValue(usePhase, 'Use Phase Timespan', 'Use Phase End Date');
                        const dateQualifier = self.getNameTileNodeValue(usePhase, 'Use Phase Timespan', 'Use Phase date Qualifier');
                        const displayDate = self.getNameTileNodeValue(usePhase, 'Use Phase Display Date');
                        const useEvidence = self.getNameTileNodeValue(usePhase, 'Use Phase Classification', 'Use Phase Evidence Type');
                        const descriptionType = self.getNameTileNodeValue(usePhase, 'Use Phase Classification', 'Use Phase Classification Description', 'Use Phase Description Type');
                        const description = self.getNameTileNodeValue(usePhase, 'Use Phase Classification', 'Use Phase Classification Description', 'Use Phase Description');
                        const tileid = usePhase?.['@tile_id'];
                        this.phase.usePhase([{
                            type,
                            period,
                            startDate,
                            endDate,
                            dateQualifier,
                            displayDate,
                            useEvidence,
                            descriptionType,
                            description,
                            tileid
                        }]);
                    }

                    const photos = resource?.['Images'];
                    if(photos?.length) {
                        this.photos(photos.map(x => {
                            const caption = self.getNameTileNodeValue(x, 'Captions', 'Caption');
                            const copyrightHolder = self.getNameTileNodeValue(x, 'Copyright', 'Copyright Holder');
                            const copyrightNote = self.getNameTileNodeValue(x, 'Copyright', 'Copyright Note', 'Copyright Note Text');
                            const copyrightType = self.getNameTileNodeValue(x, 'Copyright', 'Copyright Type');
                            const path = self.getNameTileNodeValue(x);
                            const tileid = x?.['@tile_id'];

                            return { 
                                caption,
                                copyrightHolder,
                                copyrightNote,
                                copyrightType,
                                path,
                                tileid
                            };
                        }));
                    }
                   
                    const bibliography = resource?.['Bibliographic Source Citation']; 
                    if(bibliography?.length) {
                        this.bibliography(bibliography.map(x => {
                            const citation = self.getNameTileNodeValue(x);
                            const comment = self.getNameTileNodeValue(x, 'Source Comment', 'Comment');
                            const figs = self.getNameTileNodeValue(x, 'Figures', 'Figs.');
                            const pages = self.getNameTileNodeValue(x, 'Pages', 'Page(s)');
                            const plates = self.getNameTileNodeValue(x, 'Plates', 'Plate(s)');
                            const sourceNumber = self.getNameTileNodeValue(x, 'Source Number', 'Source Number Value');
                            const tileid = x?.['@tile_id'];

                            return { 
                                citation,
                                comment,
                                figs,
                                pages,
                                plates,
                                sourceNumber,
                                tileid
                            };
                        }));
                    }

                    const scientificDate = resource?.['Scientific Date Assignment'];
                    if(scientificDate){
                        const constructionPhase = self.getNameTileNodeValue(scientificDate, 'Associated Construction Phase');
                        const dateDeterminationQualifier = self.getNameTileNodeValue(scientificDate, 'When Determined', 'When Determined Date Qualifier');
                        const dateQualifier = self.getNameTileNodeValue(scientificDate, 'Scientific Date Timespan', 'Scientific Date Qualifier');
                        const datingMethod = self.getNameTileNodeValue(scientificDate, 'Dating Method');
                        const earliestDate = self.getNameTileNodeValue(scientificDate, 'Scientific Date Timespan', 'Scientific Date Start Date');
                        const endDateOfDetermination = self.getNameTileNodeValue(scientificDate, 'When Determined', 'When Determined End Date');
                        const generalNote = self.getNameTileNodeValue(scientificDate, 'Notes', 'Note');
                        const laboratoryNote = self.getNameTileNodeValue(scientificDate, 'Laboratory References', 'Laboratory Reference');
                        const latestDate = self.getNameTileNodeValue(scientificDate, 'Scientific Date Timespan', 'Scientific Date End Date');
                        const standardDeviation = self.getNameTileNodeValue(scientificDate,  'Standard Deviation', 'Standard Deviation Type');
                        const standardDeviationComment = self.getNameTileNodeValue(scientificDate, 'Standard Deviation', 'Standard Deviation Notes', 'Standard Deviation Note');
                        const startDateOfDetermination = self.getNameTileNodeValue(scientificDate, 'When Determined', 'When Determined Start Date');
                        const tileid = scientificDate?.['@tile_id'];
                        this.scientificDate([{
                            constructionPhase,
                            dateDeterminationQualifier,
                            dateQualifier,
                            datingMethod,
                            earliestDate,
                            endDateOfDetermination,
                            generalNote,
                            laboratoryNote,
                            latestDate,
                            standardDeviation,
                            standardDeviationComment,
                            startDateOfDetermination,
                            tileid
                        }]);
                    }

                    const associatedActivities = resource?.['Associated_Activities'];
                    if(associatedActivities?.length){
                        this.associatedResources.activities(associatedActivities.map(x => {
                            const activity = self.getNameTileNodeValue(x);
                            const tileid = x?.['@tile_id'];
                            const resourceId = getResourceId(x);
                            const resourceUrl = resourceId ? `${arches.urls.resource}/${resourceId}` : undefined;
                            return {activity, resourceUrl, tileid};
                        }));
                    }

                    const associatedActors = resource?.['Associated Actors'];
                    if(associatedActors?.length){
                        this.associatedResources.actors(associatedActors.map(x => {
                            const actor = self.getNameTileNodeValue(x, 'Associated Actor', 'Actor');
                            const role = self.getNameTileNodeValue(x, 'Associated Actor', 'Role Type');
                            const startOfRole = self.getNameTileNodeValue(x, 'Associated Actor', 'Associated Actor Timespan', 'Associated Actor Start Date');
                            const endOfRole = self.getNameTileNodeValue(x, 'Associated Actor', 'Associated Actor Timespan', 'Associated Actor End Date');
                            const displayDate = self.getNameTileNodeValue(x, 'Associated Actor', 'Associated Actor Timespan', 'Associated Actor Display Date');
                            const dateQualifier = self.getNameTileNodeValue(x, 'Associated Actor', 'Associated Actor Timespan', 'Associated Actor Date Qualifier');
                            const roleType = self.getNameTileNodeValue(x, 'Role Type');
                            const tileid = x?.['@tile_id'];
                            return {
                                actor,
                                role,
                                startOfRole,
                                endOfRole,
                                displayDate,
                                dateQualifier,
                                roleType,
                                tileid
                            };
                        }));
                    }
                    const associatedConsultations = resource?.['Associated Consultations'];
                    if(associatedConsultations?.length){
                        this.associatedResources.consultations(associatedConsultations.map(x => {
                            const consultation = self.getNameTileNodeValue(x);
                            const tileid = x?.['@tile_id'];
                            const resourceId = getResourceId(x);
                            const resourceUrl = resourceId ? `${arches.urls.resource}/${resourceId}` : undefined;
                            return {consultation, resourceUrl, tileid};
                        }));
                    }

                    const associatedFiles = resource?.['Digital File(s)'];
                    if(associatedFiles?.length){
                        this.associatedResources.files(associatedFiles.map(x => {
                            const file = self.getNameTileNodeValue(x);
                            const tileid = x?.['@tile_id'];
                            const resourceId = getResourceId(x);
                            const resourceUrl = resourceId ? `${arches.urls.resource}/${resourceId}` : undefined;
                            return {file, resourceUrl, tileid};
                        }));
                    }       

                    const associatedArtifacts = resource?.['Associated Heritage Assets, Areas and Artefacts'];
                    if(associatedArtifacts?.length){
                        this.associatedResources.artifacts(associatedArtifacts.map(x => {
                            const resourceName = self.getNameTileNodeValue(x, 'Associated Heritage Asset, Area or Artefact');
                            const association = self.getNameTileNodeValue(x, 'Association Type'); 
                            const tileid = x?.['@tile_id'];
                            const resourceId = getResourceId(x?.['Associated Heritage Asset, Area or Artefact']);
                            const resourceUrl = resourceId ? `${arches.urls.resource}/${resourceId}` : undefined;
                            return {resourceName, resourceUrl, association, tileid};
                        }));
                    }

                }


                this.loadData(this.resource())

                //Set default Nav tab
                this.activeSection = ko.observable('name');
                this.activeSection.subscribe(() => {
                    if(this.activeSection() == 'location') {
                        self.prepareMap('app-area-map-data', self.locationMapData);
                    } else if (this.activeSection() == 'designation') {
                        self.prepareMap('app-area-map-data', self.designationMapData);
                    }
                });

                //toggle display of a div
                this.blockVisible = {
                    assetNames: ko.observable(true),
                    externalCrossReferences: ko.observable(true),
                    systemReferenceNumbers: ko.observable(true),
                    descriptions: ko.observable(true),
                    locations: {
                        geometryMetadata: ko.observable(true),
                        locality: ko.observable(true),
                        coordinates: ko.observable(true),
                        addresses: ko.observable(true),
                        descriptions: ko.observable(true),
                        administrativeAreas: ko.observable(true),
                        nationalGrid: ko.observable(true),
                        areaAssignment: ko.observable(true),
                        landUse: ko.observable(true),
                    },
                    designation: {
                        designation: ko.observable(true),
                        files: ko.observable(true),
                        extent: ko.observable(true)
                    },
                    phases: {
                        constructionPhases: ko.observable(true),
                        constructionComponents: ko.observable(true),
                        usePhase: ko.observable(true)
                    }, 
                    photos: ko.observable(true),
                    bibliography: ko.observable(true),
                    scientificDate: ko.observable(true),
                    associatedResources: {
                        activities: ko.observable(true),
                        actors: ko.observable(true),
                        consultations: ko.observable(true),
                        files: ko.observable(true),
                        artifacts: ko.observable(true),
                    },
                    json: ko.observable(true)
                    

                }
                this.toggleBlockVisibility = (block) => {
                    block(!block());
                }

                //Names table configuration
                this.nameTableConfig = {
                    ...this.defaultTableConfig,
                    "columns": Array(4).fill(null)
                };

                //Cross Reference table configuration
                this.crossReferenceTableConfig = {
                    ...this.defaultTableConfig,
                    "columns": Array(4).fill(null)
                };

                //Description table configuration
                this.descriptionTableConfig = {
                    ...this.defaultTableConfig,
                    "columns": Array(3).fill(null)
                };

                //Address table configuration
                this.addressTableConfig = {
                    ...this.defaultTableConfig,
                    "columns": Array(14).fill(null)
                };

                //Location descriptions table configuration
                this.locDescriptionsTableConfig = {
                    ...this.defaultTableConfig,
                    "columns": Array(3).fill(null)
                };

                //admin areas table configuration
                this.adminAreasTableConfig = {
                    ...this.defaultTableConfig,
                    "columns": Array(4).fill(null)
                };

                //grid references table configuration
                this.gridReferencesTableConfig = {
                    ...this.defaultTableConfig,
                    "columns": Array(2).fill(null)
                };

                //Statements Table
                this.statementsTableConfig = {
                    "responsive": true,
                    "paging": false,
                    "searching": false,
                    "scrollCollapse": true,
                    "info": false,
                    "columnDefs": [ {
                        "orderable": false,
                        "targets":   -1
                    } ],
                    "columns": Array(5).fill(null)
                };

                //area assignments table configuration
                this.areaAssignmentsTableConfig = {
                    ...this.defaultTableConfig,
                    "columns": Array(8).fill(null)
                };

                 //land use table configuration
                this.landUseTableConfig = {
                    ...this.defaultTableConfig,
                    "columns": Array(7).fill(null)
                };

                //Designation table configuration
                this.designationTableConfig = {
                    ...this.defaultTableConfig,
                    "columns": Array(11).fill(null)
                };

                //Files related to designations Table
                this.designationFilesTableConfig = {
                    "responsive": true,
                    "paging": false,
                    "searching": false,
                    "scrollCollapse": true,
                    "info": false,
                    "columnDefs": [ {
                        "orderable": false,
                        "targets":   -1
                    } ],
                    "columns": Array(3).fill(null)
                };

                //Construction Phases table configuration
                this.conPhasesTableConfig = {
                    ...this.defaultTableConfig,
                    "columns": Array(16).fill(null)
                };

                //Components Table
                this.componentsTableConfig = {
                    ...this.defaultTableConfig,
                    "columns": Array(6).fill(null)
                };

                //Use phased Table
                this.usePhasesTableConfig = {
                    ...this.defaultTableConfig,
                    "columns": Array(10).fill(null)
                };

                //Biblio Citation Table
                this.biblioTableConfig = {
                    "responsive": true,
                    "paging": false,
                    "searching": false,
                    "scrollCollapse": true,
                    "info": false,
                    "columnDefs": [ {
                        "orderable": false,
                        "targets":   -1
                    } ],
                    "columns": Array(7).fill(null)
                };

                //Scientific Dates table configuration
                this.scientificDatesTableConfig = {
                    ...this.defaultTableConfig,
                    "columns": Array(13).fill(null)
                };


                //Related Resource 2 column table configuration
                this.relatedResourceTwoColumnTableConfig = {
                    ...this.defaultTableConfig,
                    "paging": true,
                    "searching": true,
                    "scrollY": "250px",
                    "columns": Array(2).fill(null)
                };

                //Related Resource 3 column table configuration
                this.relatedResourceThreeColumnTableConfig = {
                    ...this.defaultTableConfig,
                    "paging": true,
                    "searching": true,
                    "scrollY": "250px",
                    "columns": Array(3).fill(null)
                };

                //Related Actors table configuration
                this.relatedActorsTableConfig = {
                    ...this.defaultTableConfig,
                    "paging": true,
                    "searching": true,
                    "scrollY": "250px",
                    "columns": Array(8).fill(null)
                };

               
                if (params.summary) {
                    // code specific to summary reports here
                } else {
                    // code specific to full reports here
                    nav = ['Names/Indentifiers', 'Descriptions', 'Locations', 'Designation/Protection', 'Phases/Components', 'Bibliography', 'Photos', 'Scientific Dates', 'Associated Resources', 'JSON'];
                }
            },
            template: { require: 'text!templates/views/components/reports/HER-Heritage-Asset.htm' }
        });
    }
);
