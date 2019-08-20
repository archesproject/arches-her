define([
    'underscore',
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/new-tile-step'
], function(_, $, arches, ko, koMapping, NewTileStep) {
    function viewModel(params) {
        var self = this;
        NewTileStep.apply(this, [params]);
        this.resValue = ko.observable();
        if (!params.resourceid()) {
            params.resourceid(params.workflow.state.resourceid);
        }
        if (params.workflow.state.steps[params._index]) {
            params.tileid(params.workflow.state.steps[params._index].tileid);
        }
        this.disableResourceSelection = ko.observable(false);
        if (params.workflow.state.resourceid) {
            this.resValue(params.workflow.state.resourceid);
            this.disableResourceSelection(true);
        }
        this.loading(true);
        this.graphid = params.graphid();
        this.nameheading = params.nameheading;
        this.namelabel = params.namelabel;
        this.resValue.subscribe(function(val){
            self.tile().resourceinstance_id = ko.unwrap(val);
            params.resourceid(ko.unwrap(val)); //redundant with setting params.requirements.resourceid?
        }, this);

        this.card.subscribe(function(val){ if(ko.unwrap(val) != undefined) { this.loading(false); } }, this);
        this.tile.subscribe(function(val){ if(ko.unwrap(val) != undefined) { this.loading(false); } }, this);
        params.tile = self.tile;

        this.setStateProperties = function(){
            params.workflow.state.steps[params._index] = params.getStateProperties();
            this.disableResourceSelection(true);
        };
    };

    ko.components.register('select-resource-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/select-resource-step.htm'
        }
    });

    return viewModel;
});
