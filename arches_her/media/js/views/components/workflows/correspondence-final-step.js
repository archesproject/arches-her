define([
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/new-tile-step',
    'views/components/workflows/final-step',
    'viewmodels/alert'
], function($, arches, ko, koMapping, NewTileStep, FinalStep, AlertViewModel) {
    function viewModel(params) {

        NewTileStep.apply(this, [params]);
        //FinalStep.apply(this, [params]);
        var self = this;
        self.loading(true);
        params.tile = self.tile;
        this.urls = arches.urls;
        this.report = ko.observable();

        if (!params.resourceid()) { 
            if (ko.unwrap(params.workflow.resourceId)) {
                params.resourceid(ko.unwrap(params.workflow.resourceId));
            }
        }
        this.resourceid = params.resourceid();

        this.nodegroupids = params.workflow.steps
            .filter(function(step){return ko.unwrap(step.nodegroupid);})
            .map(function(x){return ko.unwrap(x.nodegroupid);});

        this.workflowJSON = ko.observable();
        this.workflows = ko.observableArray();
        this.dataURL = ko.observable(params.workflow.getStepData("select-related-consultation").dataURL);

        this.getJSON = function() {
            $.ajax({
                type: "GET",
                url: arches.urls.plugin('init-workflow'),
                data: {
                    "json":true
                },
                context: self,
                success: function(data){
                    // console.log(data);
                    self.workflowJSON(data);
                },
                error: function(response) {
                    if(response.statusText !== 'abort'){
                        this.viewModel.alert(new AlertViewModel('ep-alert-red', arches.requestFailed.title, response.responseText));
                    }
                }
            });
            self.loading(false);
        };
        this.getJSON();

        this.workflowJSON.subscribe(function(val){
            if(val) {
                self.workflows(val['config']['workflows'].map(function(wf){
                    wf.url = '/arches-her'+arches.urls.plugin(wf.slug);
                    return wf;
                }, this));
            }
        });
        
        self.requirements = params.requirements;
        params.tile = self.tile;

        params.defineStateProperties = function(){
            var wastebin = !!(ko.unwrap(params.wastebin)) ? koMapping.toJS(params.wastebin) : undefined;
            var tileid = !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile().tileid): undefined;
            var tile = !!(ko.unwrap(params.tile)) ? koMapping.toJS(params.tile().data) : undefined;
            var completeTile = !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile).getData() : undefined;
            if (wastebin && ko.unwrap(wastebin.hasOwnProperty('tile'))) {
                wastebin.tile = completeTile;
            }

            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: !!(params.tile) ? koMapping.toJS(params.tile().data) : undefined,
                tileid: !!(params.tile) ? ko.unwrap(params.tile().tileid): undefined,
                wastebin: wastebin
            };
        };

        self.onSaveSuccess = function(tiles) {
            var tile;
            if (tiles.length > 0 || typeof tiles == 'object') {
                tile = tiles[0] || tiles;
                params.resourceid(tile.resourceinstance_id);
                params.tileid(tile.tileid);
                self.resourceId(tile.resourceinstance_id);
            }
            // if (self.completeOnSave === true) { self.complete(true); }
        };
    }

    return ko.components.register('correspondence-final-step', {
        viewModel: viewModel,
        template: { require: 'text!templates/views/components/workflows/correspondence-final-step.htm' }
    });
});
