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
            if (ko.unwrap(self.tile)) {
                self.tile().resourceinstance_id = ko.unwrap(val);
            }
            params.resourceid(ko.unwrap(val));
        }, this);

        this.card.subscribe(function(val){ if(ko.unwrap(val) != undefined) { this.loading(false); } }, this);
        this.tile.subscribe(function(val){ if(ko.unwrap(val) != undefined) { this.loading(false); } }, this);
        params.tile = self.tile;

        this.setStateProperties = function(){
            params.workflow.state.steps[params._index] = params.getStateProperties();
            this.disableResourceSelection(true);
        };

        params.getStateProperties = function(){
            var wastebin = !!(ko.unwrap(params.wastebin)) ? koMapping.toJS(params.wastebin) : undefined;
            var tileid = !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile().tileid): undefined;
            var tile = !!(ko.unwrap(params.tile)) ? koMapping.toJS(params.tile().data) : undefined;
            var completeTile = !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile).getData() : undefined;
            if (wastebin && ko.unwrap(wastebin.hasOwnProperty('tile'))) {
                wastebin.tile = completeTile;
            }
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: tile,
                tileid: tileid,
                wastebin: wastebin
            };
        };
    }

    ko.components.register('select-resource-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/select-resource-step.htm'
        }
    });

    return viewModel;
});
