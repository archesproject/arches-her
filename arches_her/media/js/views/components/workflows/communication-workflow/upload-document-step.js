define([
    'jquery',
    'underscore',
    'knockout',
    'knockout-mapping',
    'uuid',
    'arches',
    'templates/views/components/workflows/communication-workflow/upload-document-step.htm',
    'bindings/select2-query',
], function($, _, ko, koMapping, uuid, arches, uploadDocumentStepTemplate) {
    function viewModel(params) {
        var self = this;

        this.consultationResourceId = ko.observable(ko.unwrap(params.consultationResourceid));
        this.consultationTileId = params.consultationTileid;
        this.digitalResourceNameNodegroupId = 'c61ab163-9513-11ea-9bb6-f875a44e0e11';
        this.digitalResourceNameNodeId = 'c61ab16c-9513-11ea-89a4-f875a44e0e11';
        this.digitalResourceNameTileId = params.form.savedData()?.digitalResourceNameTileId;

        _.extend(this, params.form);

        self.tile().dirty.subscribe(function(val){
            self.dirty(val);
        });
        
        this.pageVm = params.pageVm;

        params.form.save = async() => {
            await self.tile().save();
            const digitalResourceNameTile = await saveDigitalResourceName();
            if (digitalResourceNameTile?.ok) {
                const consultationRelationship = await saveConsultationRelationship();
                if (consultationRelationship?.ok) {
                    params.form.savedData({
                        tileData: koMapping.toJSON(self.tile().data),
                        tileId: self.tile().tileid,
                        resourceInstanceId: self.tile().resourceinstance_id,
                        nodegroupId: self.tile().nodegroup_id,
                        digitalResourceNameTileId: self.digitalResourceNameTileId,
                    });
                    params.form.complete(true);
                    params.form.saving(false);
                }
            }
        };

        const saveDigitalResourceName = async() => {
            const nameTemplate = {
                "tileid": "",
                "data": {
                    "c61ab166-9513-11ea-a44c-f875a44e0e11": null,
                    "c61ab167-9513-11ea-9d50-f875a44e0e11": null,
                    "c61ab168-9513-11ea-9980-f875a44e0e11": "04a4c4d5-5a5e-4018-93aa-65abaa53fb53",
                    "c61ab169-9513-11ea-b7c1-f875a44e0e11": "8a96a261-cd79-48e2-9f12-74924c152b00",
                    "c61ab16a-9513-11ea-9afb-f875a44e0e11": "a0e096e2-f5ae-4579-950d-3040714713b4",
                    "c61ab16b-9513-11ea-ab9d-f875a44e0e11": "5a88136a-bf3a-4b48-a830-a7f42000dd24",
                    "c61ab16c-9513-11ea-89a4-f875a44e0e11": null
                },
                "nodegroup_id": self.digitalResourceNameNodegroupId,
                "parenttile_id": null,
                "resourceinstance_id": self.resourceId(),
                "sortorder": 0
            };
            
            const consultation = await window.fetch(arches.urls.api_resources(ko.unwrap(self.consultationResourceId)) + '?format=json');
            if (consultation?.ok) {
                const consultationResult = await consultation.json();
                nameTemplate.data[self.digitalResourceNameNodeId] = "Communication for " + consultationResult.displayname;
                if (!self.digitalResourceNameTileId) {
                    self.digitalResourceNameTileId = uuid.generate();
                } else {
                    nameTemplate.tileid = self.digitalResourceNameTileId;
                }
                const nameTile = await window.fetch(arches.urls.api_tiles(self.digitalResourceNameTileId), {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(nameTemplate),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                if (nameTile?.ok) {
                    const nameTileResult = await nameTile.json();
                    self.digitalResourceNameTileId = nameTileResult.tileid;
                    self.resourceId(nameTileResult.resourceinstance_id);
                    return nameTile;
                }
            }
        };

        const saveConsultationRelationship = async() =>  {
            // Add relationship from the digital object to the "existing" communication tile
            var relatedDigitalResourceRelationship = JSON.stringify([{
                resourceId: self.resourceId(),
                ontologyProperty: "",
                inverseOntologyProperty:"",
                resourceXresourceId:""
            }]);

            let formData = new window.FormData();
            formData.append('resourceinstanceid', ko.unwrap(self.consultationResourceId));
            formData.append('nodeid', '85af6942-9379-11ea-88ff-f875a44e0e11');
            formData.append('data', relatedDigitalResourceRelationship);
            formData.append('tileid', ko.unwrap(self.consultationTileId));

            return await window.fetch(arches.urls.api_node_value, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
        };
    }

    ko.components.register('upload-document-step', {
        viewModel: viewModel,
        template: uploadDocumentStepTemplate
    });
    return viewModel;
});
