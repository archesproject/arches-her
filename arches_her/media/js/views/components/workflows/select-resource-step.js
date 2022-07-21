define([
    'underscore',
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'templates/views/components/workflows/select-resource-step.htm',
], function(_, $, arches, ko, koMapping, selectResourceStepTemplate) {
    function viewModel(params) {
        _.extend(this, params.form);

        var self = this;
        this.graphids = params.graphids;
        this.resourceValue = ko.observable();
        this.resourceValue.subscribe(val => {
            if (val){
                self.tile().resourceinstance_id = val;
            }
        })
        this.tile().transactionId = this.workflowId;
        this.tile().dirty.subscribe(function(dirty) {
            self.dirty(dirty)
        });

        this.initilize = function(){
            if (ko.unwrap(self.savedData)) {
                self.resourceValue(ko.unwrap(self.savedData).resourceInstanceId);
            }
        }

        params.form.save = function() {
            self.tile().save().then(
                function(){
                    params.form.savedData({
                        tileData: koMapping.toJSON(self.tile().data),
                        resourceInstanceId: self.tile().resourceinstance_id,
                        tileId: self.tile().tileid,
                        nodegroupId: self.tile().nodegroup_id,
                    });
                    self.locked(true);
                    params.form.complete(true);
                    params.form.saving(false);
                }
            )
        };
        this.initilize();
    }

    ko.components.register('select-resource-step', {
        viewModel: viewModel,
        template: selectResourceStepTemplate
    });

    return viewModel;
});
