define([
    'knockout',
    'views/components/workflows/final-step',
    'geojson-extent',
    'views/components/map',
    'views/components/cards/select-feature-layers',
    'viewmodels/alert'
], function(ko, FinalStep, geojsonExtent, MapComponentViewModel, selectFeatureLayersFactory, AlertViewModel) {

    function viewModel(params) {
        FinalStep.apply(this, [params]);
        this.resourceData = ko.observable();
        this.prepareMap = function(geojson){
            var mapParams = {};
            if (geojson.features.length > 0) {
                mapParams.bounds = geojsonExtent(geojson);
                mapParams.fitBoundsOptions = { padding: 20 };
            }
            mapParams.sources = Object.assign({
                "app-area-map-data": {
                    "type": "geojson",
                    "data": geojson
                }
            }, mapParams.sources);
            mapParams.layers = selectFeatureLayersFactory(
                '', //resourceid
                'app-area-map-data', //source
                undefined, //sourceLayer
                [], //selectedResourceIds
                true, //visible
                '#ff2222' //color
            );
            MapComponentViewModel.apply(this, [Object.assign({},  mapParams,
                {
                    "activeTab": ko.observable(false),
                    "zoom": null
                }
            )]);
        
            this.layers = mapParams.layers;
            this.sources = mapParams.sources;
        };

        this.resourceData.subscribe(function(val){
            this.reportVals = {
                buildingName: {'name': 'Building Name', 'value': val.resource['Addresses']['Building Name']['Building Name Value']['@value'] || 'none'},
                buildingNumber: {'name': 'Building Number', 'value': val.resource['Addresses']['Building Number']['Building Number Value']['@value'] || 'none'},
                buildingNumberSubStreet: {'name': 'Building Number Sub-street', 'value': val.resource['Addresses']['Building Number Sub-Street']['Building Number Sub-Street Value']['@value'] || 'none'},
                buildingNumber: {'name': 'Building Number', 'value': val.resource['Addresses']['Building Number']['Building Number Value']['@value'] || 'none'},
                street: {'name': 'Street', 'value': val.resource['Addresses']['Street']['Street Value']['@value'] || 'none'},
                subStreet: {'name': 'Substreet', 'value': val.resource['Addresses']['Sub-Street ']['Sub-Street Value']['@value'] || 'none'},
                locality: {'name': 'Locality', 'value': val.resource['Addresses']['Locality']['Locality Value']['@value'] || 'none'},
                townCity: {'name': 'Town/City', 'value': val.resource['Addresses']['Town or City']['Town or City Value']['@value'] || 'none'},
                county: {'name': 'County', 'value': val.resource['Addresses']['County']['County Value']['@value'] || 'none'},
                postcode: {'name': 'Postcode', 'value': val.resource['Addresses']['Postcode']['Postcode Value']['@value'] || 'none'},
                status: {'name': 'Status', 'value': val.resource['Addresses']['Address Status']['@value'] || 'none'},
                currency: {'name': 'Currency', 'value': val.resource['Addresses']['Address Currency']['@value'] || 'none'},
                applicationAreaName: {'name': 'Name', 'value': val.resource['Application Area Names']['Application Area Name']['@value'] || 'none'},
                applicationAreaDescription: {'name': '', 'value': val.resource['Descriptions']['Description']['@value'] || 'none'},
                designationType: {'name': 'Designation/Protection Type', 'value': val.resource['Designation and Protection Assignment']['Designation or Protection Type']['@value'] || 'none'},
                designationGrade: {'name': 'CanvasGradient', 'value': val.resource['Designation and Protection Assignment']['Grade']['@value'] || 'none'},
                designationReference: {'name': 'Reference', 'value': val.resource['Designation and Protection Assignment']['References']['Reference']['@value'] || 'none'},
            }
            var geojsonStr = val.resource['Geometry']['Geospatial Coordinates']['@value'].replaceAll("'", '"');
            var geojson = JSON.parse(geojsonStr);
            this.prepareMap(geojson);
            this.loading(false);
        }, this);

        window.fetch(this.urls.api_resources(this.resourceid) + '?format=json&compact=false')
        .then(response => response.json())
        .then(data => this.resourceData(data))
        
    }

    ko.components.register('app-area-final-step', {
        viewModel: viewModel,
        template: { require: 'text!templates/views/components/workflows/application-area/app-area-final-step.htm' }
    });
    return viewModel;
});
