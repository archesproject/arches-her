define([
    'underscore',
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/new-tile-step'
], function(_, $, arches, ko, koMapping, NewTileStep) {

    function viewModel(params) {

        if (!params.resourceid() && params.requirements){
            params.resourceid(params.requirements.resourceid);
            params.tileid(params.requirements.tileid);
        }

        NewTileStep.apply(this, [params]);
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
        console.log(self, params);

        self.saveTile = function(tile, callback) {
            self.loading(true);
            tile.save(function(response) {
                self.loading(false);
                self.alert(
                    new AlertViewModel(
                        'ep-alert-red',
                        response.responseJSON.message[0],
                        response.responseJSON.message[1],
                        null,
                        function(){ return; }
                    )
                );
            }, function(tile) {
                console.log("Were in save", tile, params);
                $.ajax({
                    type: "GET",
                    url: arches.urls.filetemplate,
                    data: {
                        "resourceinstance_id": tile["resourceinstance_id"],
                        "template_id": tile["data"][0]
                    },
                    // data: JSON.stringify({
                    //     tiles: koMapping.toJS(tiles)
                    // }),
                    // context: self,
                    success: function(response) {
                        console.log("success");
                        // console.log(response);
                    },
                    error: function(response, status, error) {
                        console.log(response);
                        if(response.statusText !== 'abort'){
                            this.viewModel.alert(new AlertViewModel('ep-alert-red', arches.requestFailed.title, response.responseText));
                        }
                    }
                });
                // params.resourceid(tile.resourceinstance_id);
                // params.tileid(tile.tileid);
                // self.resourceId(tile.resourceinstance_id);
                // self.complete(true);
                // if (typeof callback === 'function') {
                //     callback.apply(null, arguments);
                // }
                // self.tile(self.card().getNewTile());
                // self.tile().reset();
                // setTimeout(function() {
                //     self.tile().reset();
                // }, 1);
                self.loading(false);
            });
        };
    };

    return ko.components.register('test', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/new-tile-step.htm'
            // require: 'text!templates/views/components/workflows/test.htm'
        }
    });
    return viewModel;
});