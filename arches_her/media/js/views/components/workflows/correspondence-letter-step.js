define([
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/new-tile-step',
    'viewmodels/alert',
    'templates/views/components/workflows/correspondence-letter-step.htm',
], function($, arches, ko, koMapping, NewTileStep, AlertViewModel, correspondenceLetterStepTemplate) {
    function viewModel(params) {

        NewTileStep.apply(this, [params]);
        if (!params.resourceid() && params.requirements){
            params.resourceid(params.requirements.resourceid);
            params.tileid(params.requirements.tileid);
        }

        var self = this;
        
        self.requirements = params.requirements;
        params.tile = self.tile;
        this.letterFileNodeId = "8d41e4d1-a250-11e9-9a12-00224800b26d";
        this.letterTypeNodegroupId = "8d41e4b4-a250-11e9-993d-00224800b26d";
        this.letterTypeNodeId = "8d41e4df-a250-11e9-af01-00224800b26d";
        this.dataURL = ko.observable(false);

        params.defineStateProperties = function(){
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
            if (self.completeOnSave === true) { self.complete(true); }
        };
    }

    return ko.components.register('correspondence-letter-step', {
        viewModel: viewModel,
        template: correspondenceLetterStepTemplate
    });
});
