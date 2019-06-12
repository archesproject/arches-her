define([
    'underscore',
    'jquery',
    'arches',
    'knockout',
    'views/components/workflows/add-ref-number-step'
], function(_, $, arches, ko, AddRefStep) {

    function viewModel(params) {

        if (!params.resourceid() && params.requirements){
            params.resourceid(params.requirements.resourceid);
            params.tileid(params.requirements.tileid);
        }

        AddRefStep.apply(this, [params]);
        var self = this;
        self.requirements = params.requirements;
        params.tile = self.tile;

        params.stateProperties = function(){
                return {
                    resourceid: ko.unwrap(params.resourceid),
                    tile: !!(params.tile) ? koMapping.toJS(params.tile().data) : undefined,
                    tileid: !!(params.tile) ? ko.unwrap(params.tile().tileid): undefined
                }
            };

        self.tile.subscribe(function(val) {
            if(val) {
                if(self.requirements) {
                    if (self.requirements.applyOutputToTarget) {
                        val.data[self.requirements.targetnode](self.requirements.value);
                    }
                }
            }
        });
    };

    return ko.components.register('set-reference-numbers', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/add-ref-number-step.htm'
        }
    });
    return viewModel;
});
