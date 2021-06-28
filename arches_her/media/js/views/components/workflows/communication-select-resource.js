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
        var relatedConditionNode = '5d89cd18-51a5-11eb-a920-f875a44e0e11';
        if (!params.resourceid()) {
            params.resourceid(ko.unwrap(params.workflow.resourceId));
        }
        if (params.workflow.steps[params._index]) {
            params.tileid(ko.unwrap(params.workflow.steps[params._index].tileid));
        }
        this.disableResourceSelection = ko.observable(false);
        if (ko.unwrap(params.workflow.resourceId)) {
            this.resValue(ko.unwrap(params.workflow.resourceId));
            this.disableResourceSelection(true);
        }
        this.loading(true);
        this.graphid = params.graphid();
        this.nameheading = params.nameheading;
        this.namelabel = params.namelabel;
        this.resValue.subscribe(function(val){
            if (ko.unwrap(self.tile)) {
                self.tile().resourceinstance_id = ko.unwrap(val);
                self.resourceId(null); // force the card component to rerender
                self.resourceId(val);
                self.tile().data[relatedConditionNode]('');
            }
            params.resourceid(ko.unwrap(val));
        }, this);

        this.card.subscribe(function(val){ if(ko.unwrap(val) != undefined) { this.loading(false); } }, this);
        this.tile.subscribe(function(val){ if(ko.unwrap(val) != undefined) { this.loading(false); } }, this);
        params.tile = self.tile;

        this.setStateProperties = function(){
            params.workflow.steps[params._index] = params.defineStateProperties();
            this.disableResourceSelection(true);
        };

        this.workflowStepClass = ko.unwrap(params.class());

        params.defineStateProperties = function(){
            var wastebin = !!(ko.unwrap(params.wastebin)) ? koMapping.toJS(params.wastebin) : undefined;
            var tileid = !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile().tileid): undefined;
            var tile = !!(ko.unwrap(params.tile)) ? koMapping.toJS(params.tile().data) : undefined;
            var completeTile = !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile).getData() : undefined;
            if (wastebin && ko.unwrap(wastebin.hasOwnProperty('tile'))) {
                wastebin.tile = completeTile;
            }
            ko.mapping.fromJS(wastebin, {}, params.wastebin);
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: tile,
                tileid: tileid,
                wastebin: wastebin
            };
        };
    }

    ko.components.register('communication-select-resource', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/communication-select-resource.htm'
        }
    });

    return viewModel;
});
