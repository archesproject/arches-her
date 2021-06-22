define([
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/summary-step',
    'viewmodels/alert'
], function($, arches, ko, koMapping, SummaryStep, AlertViewModel) {
    function viewModel(params) {


        var self = this;
        params.form.resourceId = params.form.externalStepData.relatedconsultationstep.data.resourceid;
        SummaryStep.apply(this, [params]);
        this.documents = ko.observableArray();
        this.resourceLoading = ko.observable(true);
        this.dataURL = ko.observable(params.form.externalStepData.relatedconsultationstep.data.dataURL);

        this.resourceData.subscribe(function(val){
            var currentCorrespondence;
            if (Array.isArray(val.resource.Correspondence)){
                val.resource.Correspondence.forEach(function(comm) {
                    if (comm['@tile_id'] === currentTileId){
                        currentCorrespondence = comm;
                    }
                });
            } else {
                currentCorrespondence = val.resource.Correspondence;
            }
            
            this.displayName = val['displayname'] || 'Unnamed';
            this.reportVals = {
                consultationName: {'name': 'Related Consultation', 'value': this.getResourceValue(val, ['displayname'])},
                letterType: {'name': 'Letter Type', 'value': this.getResourceValue(currentCorrespondence, ['Letter Type', '@value'])},
                letter: {'name': 'Letter', 'value': this.getResourceValue(currentCorrespondence, ['Letter', '@value'])},
            }
            this.resourceLoading(false);
            this.loading(false);

        }, this); 

        var currentTileId = ko.unwrap(params.form.externalStepData.relatedconsultationstep.data.tileid)
        
        self.requirements = params.requirements;
        params.tile = self.tile;
    }

    return ko.components.register('correspondence-final-step', {
        viewModel: viewModel,
        template: { require: 'text!templates/views/components/workflows/correspondence-final-step.htm' }
    });
});
