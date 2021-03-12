define([
    'underscore',
    'jquery',
    'uuid',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/select-resource-step',
    'viewmodels/alert'
], function(_, $, uuid, arches, ko, koMapping, SelectResourceStep, AlertViewModel) {
    function viewModel(params) {
        var self = this;
        SelectResourceStep.apply(this, [params]);

        this.workflowStepClass = ko.unwrap(params.class());

        this.letterTypeNodeId = "8d41e4df-a250-11e9-af01-00224800b26d";
        this.digitalObjectFileNodeId = "96f8830a-8490-11ea-9aba-f875a44e0e11";
        this.dataURL = ko.observable(null);
        this.digitalObjectResourceId = ko.observable(null)

        var nameTemplate = {
            "tileid": null,
            "data": {
                "c61ab166-9513-11ea-a44c-f875a44e0e11": null,
                "c61ab167-9513-11ea-9d50-f875a44e0e11": null,
                "c61ab168-9513-11ea-9980-f875a44e0e11": "04a4c4d5-5a5e-4018-93aa-65abaa53fb53",
                "c61ab169-9513-11ea-b7c1-f875a44e0e11": "8a96a261-cd79-48e2-9f12-74924c152b00",
                "c61ab16a-9513-11ea-9afb-f875a44e0e11": "a0e096e2-f5ae-4579-950d-3040714713b4",
                "c61ab16b-9513-11ea-ab9d-f875a44e0e11": "5a88136a-bf3a-4b48-a830-a7f42000dd24",
                "c61ab16c-9513-11ea-89a4-f875a44e0e11": null
            },
            "nodegroup_id": null,
            "parenttile_id": null,
            "resourceinstance_id": "",
            "sortorder": 0
        };

        this.retrieveFile = function(tile) {
            var templateId = ko.mapping.toJS(tile.data)[self.letterTypeNodeId];
            $.ajax({
                type: "POST",
                url: arches.urls.root + 'filetemplate',
                data: {
                    "template_id": templateId,
                    "resourceinstance_id": tile.resourceinstance_id
                }
            })
            .done(function(data){
                self.dataURL(data.tile.data[self.digitalObjectFileNodeId][0].url);
                self.digitalObjectResourceId(data.tile.resourceinstance_id);

                nameTemplate["resourceinstance_id"] = data.tile.resourceinstance_id;
                nameTemplate["nodegroup_id"] = 'c61ab163-9513-11ea-9bb6-f875a44e0e11'

                $.ajax({
                    url: arches.urls.api_resources(ko.unwrap(params.resourceid)),
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        'format': 'json'
                    }
                }).done(function(data) {
                    let today = new Date().toLocaleDateString()
                    nameTemplate.data["c61ab16c-9513-11ea-89a4-f875a44e0e11"] = today + " Letter for " + data.displayname;
                    window.fetch(arches.urls.api_tiles(uuid.generate()), {
                        method: 'POST',
                        credentials: 'include',
                        body: JSON.stringify(nameTemplate),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    })
                    .then(function(response) {
                        console.log("Creating the name tile is done")
                    })
                    .catch(function(response){
                        console.log("Creating the name tile failed: \n", response)
                    });
                    self.loading(false);
                    if (self.completeOnSave === true) { self.complete(true); }
                })
                .fail(function(response) {
                    console.log("getting consultation name failed: \n", response)
                });
                var relateDocuNodeTemplate = [{
                    'resourceId': data.tile.resourceinstance_id,
                    'ontologyProperty': '',
                    'inverseOntologyProperty':'',
                    'resourceXresourceId':''
                }]

                $.ajax({
                    url: arches.urls.api_node_value,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'resourceinstanceid': ko.unwrap(params.resourceid),
                        'nodeid': '87e0b839-9391-11ea-8a85-f875a44e0e11', // Correspondence Related Node
                        'data': JSON.stringify(relateDocuNodeTemplate),
                        'tileid': ko.unwrap(params.tileid)
                    }
                }).done(function(response) {
                    console.log("Successfully Updated the Node Value")
                })
                .fail(function(response) {
                    console.log("Updating the node value failed: \n", response)
                });
            })
            .fail(function(response) {
                if(response.statusText !== 'abort'){
                    self.alert(new AlertViewModel('ep-alert-red', arches.requestFailed.title, response.responseText));
                }
            });
        };

        params.defineStateProperties = function(){
            var wastebin = !!(ko.unwrap(params.wastebin)) ? koMapping.toJS(params.wastebin) : undefined;
            if (wastebin && ko.unwrap(wastebin.hasOwnProperty('resourceid'))) {
                wastebin.resourceid = ko.unwrap(self.digitalObjectResourceId);                
            }
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: tile,
                tileid: tileid,
                dataURL: ko.unwrap(self.dataURL),
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

                self.retrieveFile(tile);
            }

            if (params.value) {
                params.value(params.defineStateProperties());
            }
            
            //if (self.completeOnSave === true) { self.complete(true); }
        };
    }

    ko.components.register('correspondence-select-resource', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/correspondence-select-resource.htm'
        }
    });

    return viewModel;
});
