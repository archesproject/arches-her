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
        params.applyOutputToTarget = ko.observable(true);
        if (!params.resourceid() && params.requirements){
            params.resourceid(params.requirements.resourceid);
            params.tileid(params.requirements.tileid);
        }
        this.nameheading = params.nameheading;
        this.namelabel = params.namelabel;
        this.resValue = ko.observable();
        this.applyOutputToTarget = params.applyOutputToTarget;
        this.resValue.subscribe(function(val){
            params.requirements.resourceid = ko.unwrap(val);
            params.resourceid(ko.unwrap(val));
            console.log(params.resourceid());
        }, this);
        console.log(params);

        params.tile = self.tile;

        params.stateProperties = function(){
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: !!(ko.unwrap(params.tile)) ? koMapping.toJS(params.tile().data) : undefined,
                tileid: !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile().tileid): undefined,
            }
        };

        self.onSaveSuccess = function(tiles) {
            self.tiles = tiles;
            if (self.tiles.length > 0) {
                params.resourceid(tiles[0].resourceinstance_id);
                self.resourceId(tiles[0].resourceinstance_id);
            }
            if (self.completeOnSave === true) {
                self.complete(true);
            }
        }
    };

    ko.components.register('select-resource-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/select-resource-step.htm'
        }
    });

    return viewModel;
});
