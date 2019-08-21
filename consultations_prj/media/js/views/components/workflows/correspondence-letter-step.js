define([
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/new-tile-step'
], function($, arches, ko, koMapping, NewTileStep) {
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
        this.letterTypeNodeId = "8d41e4df-a250-11e9-af01-00224800b26d";

        params.stateProperties = function(){
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: !!(params.tile) ? koMapping.toJS(params.tile().data) : undefined,
                tileid: !!(params.tile) ? ko.unwrap(params.tile().tileid): undefined
            }
        };

        this.workflowStepClass = ko.unwrap(params.class());

        this.retrieveFile = function(tile) {
            var templateId = tile["data"][self.letterTypeNodeId]();
            $.ajax({
                type: "GET",
                url: arches.urls.root + 'filetemplate',
                data: {
                    "resourceinstance_id": tile.resourceinstance_id,
                    "template_id": templateId
                },
                context: self,
                success: function(responseText, status, response){
                    console.log(response.responseJSON);
                },
                error: function(response, status, error) {
                    console.log(response);
                    if(response.statusText !== 'abort'){
                        this.viewModel.alert(new AlertViewModel('ep-alert-red', arches.requestFailed.title, response.responseText));
                    }
                }
            });
            self.loading(false);
        }

        this.saveLetterFileTile = function(tile) {

            var tilevalue = {
                name: file.name,
                accepted: true,
                height: file.height,
                lastModified: file.lastModified,
                size: file.size,
                status: file.status,
                type: file.type,
                width: null,
                url: null,
                file_id: null,
                index: 0,
                content: URL.createObjectURL(file),
                error: file.error
            };
            tile.data[letterFileNodeId]([tilevalue]);

            var nameCard = self.topCards.find(function(topCard) {
                return topCard.nodegroupid == self.consultationNameNodeId;
            });
            var nameCardTile = nameCard.getNewTile();
            nameCardTile.data[self.consultationNameNodeId](self.concatName());
            nameCardTile.save();
        };

        self.tile.subscribe(function(val) {
            //
        });

        self.onSaveSuccess = function(tiles) {
            var tile;
            if (tiles.length > 0 || typeof tiles == 'object') {
                tile = tiles[0] || tiles;
                if (!tile.data[letterFileNodeId]()) { self.saveLetterFileTile(tile); }
                params.resourceid(tile.resourceinstance_id);
                params.tileid(tile.tileid);
                self.resourceId(tile.resourceinstance_id);
            }
            if (self.completeOnSave === true) { self.complete(true); }
        };
    };

    return ko.components.register('correspondence-letter-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/new-tile-step.htm'
        }
    });
});
