define([
    'jquery',
    'underscore',
    'knockout',
    'knockout-mapping',
    'uuid',
    'arches',
    'views/components/workflows/new-tile-step',
    'bindings/select2-query',
], function($, _, ko, koMapping, uuid, arches, NewTileStep) {
    function viewModel(params) {
        var self = this;

        this.consultationResourceId = ko.observable(ko.unwrap(params.workflow.resourceId));
        this.consultationTileId = params.externalStepData.relatedconsultation.data.tileid;
        this.digitalObjectResourceInstanceName = ko.observable();

        params.resourceid(null);
        params.workflow.resourceId(null);

        NewTileStep.apply(this, [params]);

        if (params.value() && params.value().digitalObjectResourceInstanceName) {
            this.digitalObjectResourceInstanceName(params.value().digitalObjectResourceInstanceName);
        }

        this.onSaveSuccess = function(tile) {
            this.resourceId(tile.resourceinstance_id);
            params.tileid(tile.tileid);
            params.tile(tile);

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
            
            $.ajax({
                url: arches.urls.api_resources(ko.unwrap(this.consultationResourceId)),
                type: 'GET',
                dataType: 'json',
                data: {
                    'format': 'json'
                }
            }).done(function(data) {
                nameTemplate["resourceinstance_id"] =  self.resourceId();
                nameTemplate["nodegroup_id"] = 'c61ab163-9513-11ea-9bb6-f875a44e0e11'
                nameTemplate.data["c61ab16c-9513-11ea-89a4-f875a44e0e11"] = "Communication for " + data.displayname
                window.fetch(arches.urls.api_tiles(uuid.generate()), {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(nameTemplate),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then(function(response) {
                    if (response.ok) {
                        return response.json();
                    }
                }).then(function(json) {
                    self.digitalObjectResourceInstanceName(json.data["c61ab16c-9513-11ea-89a4-f875a44e0e11"]);
                    console.log("The digital object name is saved")
                })
                .catch(function(response){
                    console.log("Saving the digital object name failed: \n", response)
                });
            })
            .fail(function(response) {
                console.log("Getting the consultation name failed: \n", response)
            });

            // Add a Docu from the digital object to the "existing" communication tile
            var relateDocuNodeTemplate = [{
                'resourceId': self.resourceId(),
                'ontologyProperty': '',
                'inverseOntologyProperty':'',
                'resourceXresourceId':''
            }]

            $.ajax({
                url: arches.urls.api_node_value,
                type: 'POST',
                dataType: 'json',
                data: {
                    'resourceinstanceid': ko.unwrap(self.consultationResourceId),
                    'nodeid': '85af6942-9379-11ea-88ff-f875a44e0e11', // consultation Related Node
                    'data': JSON.stringify(relateDocuNodeTemplate),
                    'tileid': ko.unwrap(self.consultationTileId)
                }
            }).done(function(response) {
                console.log("Related resource instance added")
            })
            .fail(function(response) {
                console.log("Adding related resource instance failed: \n", response)
            });

            params.resourceid(ko.unwrap(this.consultationResourceId));
            params.workflow.resourceId(ko.unwrap(this.consultationResourceId));
    
            params.defineStateProperties = function(){
                var wastebin = !!(ko.unwrap(params.wastebin)) ? koMapping.toJS(params.wastebin) : undefined;
                if (wastebin && 'resourceid' in wastebin) {
                    wastebin.resourceid = ko.unwrap(self.resourceId);
                }
                ko.mapping.fromJS(wastebin, {}, params.wastebin);
                return {
                    consultationObjectResourceId: ko.unwrap(self.consultationResourceId),
                    consultationTileId: ko.unwrap(self.consultationTileId),
                    resourceid: ko.unwrap(self.resourceId),
                    digitalObjectResourceInstanceName: ko.unwrap(self.digitalObjectResourceInstanceName),
                    tile: !!(ko.unwrap(params.tile)) ? koMapping.toJS(params.tile().data) : undefined,
                    tileid: !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile().tileid): undefined,
                    wastebin: wastebin
                };
            };
    
            if (params.value) {
                params.value(params.defineStateProperties());
            }
            if (self.completeOnSave === true) { self.complete(true); }
        };
    };

    ko.components.register('upload-document-step', {
        viewModel: viewModel,
        template: { require: 'text!templates/views/components/workflows/new-tile-step.htm' }
    });
    return viewModel;
});
