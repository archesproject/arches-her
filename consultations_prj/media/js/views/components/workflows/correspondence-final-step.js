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
        // FinalStep.apply(this, [params]);
        var self = this;
        self.loading(true);
        params.tile = self.tile;
        this.urls = arches.urls;
        this.resourceid = params.resourceid();
        this.report = ko.observable();

        this.nodegroupids = params.workflow.steps
            .filter(function(step){return ko.unwrap(step.nodegroupid);})
            .map(function(x){return ko.unwrap(x.nodegroupid);});

        this.workflowJSON = ko.observable();
        this.workflows = ko.observableArray();
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
                    wf.url = '/consultations'+arches.urls.plugin(wf.slug);
                    return wf;
                }, this));
            }
        });
        
        self.requirements = params.requirements;
        params.tile = self.tile;
        this.letterFileNodeId = "8d41e4d1-a250-11e9-9a12-00224800b26d";
        this.letterTypeNodegroupId = "8d41e4b4-a250-11e9-993d-00224800b26d";
        this.letterTypeNodeId = "8d41e4df-a250-11e9-af01-00224800b26d";
        this.dataURL = ko.observable(false);

        params.stateProperties = function(){
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: !!(params.tile) ? koMapping.toJS(params.tile().data) : undefined,
                tileid: !!(params.tile) ? ko.unwrap(params.tile().tileid): undefined
            };
        };

        this.retrieveFile = function(tile) {
            var letterTypeTiles = self.getTiles(self.letterTypeNodegroupId);
            //note that the statement below assumes the last index of this array is the tile associated with the 
            //preceding step in the workflow
            var templateId = letterTypeTiles[letterTypeTiles.length - 1].data[self.letterTypeNodeId]();
            $.ajax({
                type: "POST",
                url: arches.urls.root + 'filetemplate',
                data: {
                    "resourceinstance_id": tile.resourceinstance_id,
                    "template_id": templateId,
                    "parenttile_id":tile.parenttile_id
                },
                context: self,
                success: function(){
                    self.downloadFile(tile);
                },
                error: function(response) {
                    if(response.statusText !== 'abort'){
                        self.alert(new AlertViewModel('ep-alert-red', arches.requestFailed.title, response.responseText));
                    }
                }
            });
            self.loading(false);
        };

        this.downloadFile = function(tile) {
            $.ajax({
                type: "GET",
                url: arches.urls.root + 'filetemplate',
                data: {
                    "resourceinstance_id": tile.resourceinstance_id,
                    "parenttile_id": tile.parenttile_id
                },
                context: self,
                success: function(responseText, status, response){
                    self.dataURL(response.responseJSON['download']);
                    self.loading(false);
                },
                error: function(response) {
                    if(response.statusText !== 'abort'){
                        self.alert(new AlertViewModel('ep-alert-red', arches.requestFailed.title, response.responseText));
                    }
                }
            });
        };

        var createDocxTileOnLoad = self.tile.subscribe(function(val) {
            if(val) {
                self.retrieveFile(val);
                createDocxTileOnLoad.dispose();
            }
        });

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
