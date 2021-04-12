define([
    'knockout',
    'views/components/workflows/summary-step',
    'geojson-extent',
    'views/components/map',
    'views/components/cards/select-feature-layers',
    'viewmodels/alert'
], function(ko, SummaryStep, geojsonExtent, MapComponentViewModel, selectFeatureLayersFactory, AlertViewModel) {

    function viewModel(params) {
        SummaryStep.apply(this, [params]);

        this.resourceData.subscribe(function(val){
            this.reportVals = {
                // buildingName: {'name': 'Building Name', 'value': val.resource['Addresses']['Building Name']['Building Name Value']['@value'] || 'none'},
            };
            // var geojsonStr = val.resource['Geometry']['Geospatial Coordinates']['@value'].replaceAll("'", '"');
            // var geojson = JSON.parse(geojsonStr);
            // this.prepareMap(geojson, 'app-area-map-data');
            this.loading(false);
        }, this);
    }

    ko.components.register('consultations-final-step', {
        viewModel: viewModel,
        template: { require: 'text!templates/views/components/workflows/consultations-final-step.htm' }
    });
    return viewModel;
});
