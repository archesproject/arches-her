define([
    'underscore',
    'jquery',
    'uuid',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/select-resource-step',
    'viewmodels/alert',
    'templates/views/components/workflows/correspondence-select-resource.htm',
], function(_, $, uuid, arches, ko, koMapping, SelectResourceStep, AlertViewModel, correspondenceSelectResourceStepTemplate) {
    function viewModel(params) {
        var self = this;
        SelectResourceStep.apply(this, [params]);

        this.letterTypeNodeId = "8d41e4df-a250-11e9-af01-00224800b26d";
        this.digitalObjectFileNodeId = "96f8830a-8490-11ea-9aba-f875a44e0e11";
        this.fileTileData = ko.observable();
        this.digitalObjectResourceId = ko.observable();
        this.digitalObjectTileId = ko.observable();
        this.tile().transactionid = self.worfklowId;

        var nameTemplate = {
            "tileid": '',
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

        this.saveValues = function(){ //save the savedData and finalize the step
            params.form.savedData({
                tileData: koMapping.toJSON(self.tile().data),
                resourceInstanceId: self.tile().resourceinstance_id,
                tileId: self.tile().tileid,
                nodegroupId: self.tile().nodegroup_id,
                fileTileData: ko.unwrap(self.fileTileData),
            });
            self.locked(true);
            params.form.complete(true);
            params.form.saving(false);
        };

        this.retrieveFile = function(tile) { //correspondence tile of consultation resource
            const templateId = ko.mapping.toJS(tile.data)[self.letterTypeNodeId];
            $.ajax({ //save the file and create digital resource
                type: "POST",
                url: arches.urls.root + 'filetemplate',
                data: {
                    "template_id": templateId,
                    "resourceinstance_id": tile.resourceinstance_id,
                    "transaction_id": self.workflowId,
                }
            })
            .done(function(data){ //getting digital object resource
                self.fileTileData(data.tile.data[self.digitalObjectFileNodeId][0]);
                self.digitalObjectResourceId(data.tile.resourceinstance_id);

                var relateDocuNodeTemplate = [{
                    'resourceId': data.tile.resourceinstance_id,
                    'ontologyProperty': '',
                    'inverseOntologyProperty':'',
                    'resourceXresourceId':''
                }];

                $.ajax({ //saving the realted resource (digital object) to the Letter node (consultation)
                    url: arches.urls.api_node_value,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'resourceinstanceid': ko.unwrap(self.tile().resourceinstance_id),
                        'nodeid': '87e0b839-9391-11ea-8a85-f875a44e0e11', // Correspondence Related Node
                        'data': JSON.stringify(relateDocuNodeTemplate),
                        'tileid': ko.unwrap(self.tile().tileid),
                        'transaction_id': self.workflowId,
                    },
                }).done(function(response) {
                    console.log("Digital related resource updated")
                })
                .fail(function(response) {
                    console.log("Updating digital related resource failed: \n", response)
                });

                nameTemplate["resourceinstance_id"] = data.tile.resourceinstance_id;
                nameTemplate["nodegroup_id"] = 'c61ab163-9513-11ea-9bb6-f875a44e0e11';
                $.ajax({ //get consultation name
                    url: arches.urls.api_resources(ko.unwrap(self.tile().resourceinstance_id)),
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        'format': 'json'
                    }
                }).done(function(data) {
                    let today = new Date().toLocaleDateString()
                    nameTemplate.data["c61ab16c-9513-11ea-89a4-f875a44e0e11"] = today + " Letter for " + data.displayname;

                    $.ajax({ //saving the digital resource name
                        url: arches.urls.api_tiles(uuid.generate()),
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            "data": JSON.stringify(nameTemplate),
                            'transaction_id': self.workflowId
                        },
                    }).done(function(response) {
                        self.saveValues();
                        if (self.completeOnSave === true) { self.complete(true); }    
                    })
                    .fail(function(response){
                        console.log("Adding the digital object name failed: \n", response);
                    });
                })
                .fail(function(response) {
                    console.log("Getting consultation name failed: \n", response);
                });
            })
            .fail(function(response) {
                if(response.statusText !== 'abort'){
                    params.form.error(new Error(response.responseText));
                    params.pageVm.alert(new AlertViewModel('ep-alert-red', arches.requestFailed.title, response.responseText));
                }
            });
        };

        params.form.save = function() {
            self.tile().save().then(function(tile) {
                self.retrieveFile(tile);
            });
        };
    };

    ko.components.register('correspondence-select-resource', {
        viewModel: viewModel,
        template: correspondenceSelectResourceStepTemplate
    });

    return viewModel;
});
