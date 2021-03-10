define([
    'underscore',
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/select-resource-step'
], function(_, $, arches, ko, koMapping, SelectResourceStep) {
    function viewModel(params) {
        var self = this;
        SelectResourceStep.apply(this, [params]);

        this.workflowStepClass = ko.unwrap(params.class());

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
                tile: tile,
                tileid: tileid,
                wastebin: wastebin
            };
        };

        this.retrieveFile = function(tile) {
            var letterTypeTiles = self.getTiles(self.correspondenceNodegroupId);
            //note that the statement below assumes the last index of this array is the tile associated with the 
            //preceding step in the workflow
            var templateId = letterTypeTiles[letterTypeTiles.length - 1].data[self.letterTypeNodeId]();
            $.ajax({
                type: "POST",
                url: arches.urls.root + 'filetemplate',
                data: {
                    "resourceinstance_id": null,
                    "template_id": templateId,
                    "parenttile_id": null,
                    "tile": tile
                },
                context: self,
                success: function(data){
                    console.log(data.tile)
                    self.downloadFile(data.tile);
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

        /*var createDocxTileOnLoad = self.tile.subscribe(function(val) {
            if(val) {
                self.retrieveFile(val);
                createDocxTileOnLoad.dispose();
            }
        });*/

        self.onSaveSuccess = function(tile) {
            self.retrieveFile(tile);

            //The following is from the new-tile-step
            var tile;
            
            if (tiles.length > 0 || typeof tiles == 'object') {
                tile = tiles[0] || tiles;
                params.resourceid(tile.resourceinstance_id);
                params.tileid(tile.tileid);

                self.resourceId(tile.resourceinstance_id);
            }

            if (params.value) {
                params.value(params.defineStateProperties());
            }
            
            if (self.completeOnSave === true) { self.complete(true); }
        };
    }

    ko.components.register('correspondence-select-resource', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/communication-select-resource.htm'
        }
    });

    return viewModel;
});
