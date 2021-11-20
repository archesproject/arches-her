define([
    'underscore',
    'arches',
    'knockout',
    'uuid',
], function(_, arches, ko, uuid) {
    function viewModel(params) {
        var self = this;

        var addressNodegroupId = '7ee432f9-eeb5-11eb-a673-a87eeabdefba';
        var nameNodegroupId = '9c9f9dbb-83bf-11ea-bca7-f875a44e0e11';

        var getValue = function(key) {
            return ko.unwrap(params.value) ? params.value()[key] : null; 
        };

        this.buildingName = ko.observable(getValue('buildingName'));
        this.buildingNumber = ko.observable(getValue('buildingNumber'));
        this.buildingNumberSub = ko.observable(getValue('buildingNumberSub'));
        this.subStreet = ko.observable(getValue('subStreet'));
        this.street = ko.observable(getValue('street'));
        this.locality = ko.observable(getValue('locality'));
        this.townCity = ko.observable(getValue('townCity'));
        this.county = ko.observable(getValue('county'));
        this.postcode = ko.observable(getValue('postcode'));
        this.addressStatus = ko.observable(getValue('addressStatus'));
        this.addressCurrency = ko.observable(getValue('addressCurrency'));
        this.addressTileid = ko.observable(getValue('addressTileid'));
        this.nameTileid = ko.observable(getValue('nameTileid'));
        this.resourceInstanceId = ko.observable(getValue('resourceInstanceId'));
        this.applicationAreaName = ko.observable(getValue('applicationAreaName'));

        this.showName = ko.observable(false);

        this.fullAddress = ko.pureComputed(function(){
            var building = [self.buildingName(), self.buildingNumber(), self.buildingNumberSub()].filter(Boolean).join(" ");
            var fullStreet = [self.subStreet(), self.street()].filter(Boolean).join(" ");
            return [building, fullStreet, self.locality(), self.townCity(), self.county(), self.postcode()].filter(Boolean).join(", ");
        });

        this.fullAddress.subscribe(function(val){
            self.applicationAreaName(val);
        });

        var nameTileDataObj = ko.pureComputed(function(){
            return {
                "279329b0-94fc-11ea-8279-f875a44e0e11": "a0e096e2-f5ae-4579-950d-3040714713b4",
                "45cef0b8-94fc-11ea-85ca-f875a44e0e11": "04a4c4d5-5a5e-4018-93aa-65abaa53fb53",
                "9c9f9dbe-83bf-11ea-aa43-f875a44e0e11": "2df285fa-9cf2-45e7-bc05-a67b7d7ddc2f",
                "9c9f9dbf-83bf-11ea-b1a9-f875a44e0e11": "e987fb72-6fa6-43ab-8812-867c4813a2a2",
                "9c9f9dc0-83bf-11ea-8d22-f875a44e0e11": self.applicationAreaName()
            }
        });

        var addressTileDataObj = ko.pureComputed(function(){
            return {
                // "c7ec6efd-28c8-11eb-8c56-f875a44e0e11": "8a37a140-0be2-44bc-aa64-74c1f3f3b372",
                // "c7ec6efe-28c8-11eb-908a-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                // "c7ec6eff-28c8-11eb-abfb-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                // "c7ec6f00-28c8-11eb-95f7-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                // "c7ec6f01-28c8-11eb-b4f8-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                // "c7ec6f02-28c8-11eb-9fff-f875a44e0e11": "98355a3e-6f84-45ae-9281-8aa7e20d47f5",
                // "c7ec6f03-28c8-11eb-8fc7-f875a44e0e11": "78b7f967-9831-42ea-b744-1737c5cb2ebc",
                // "c7ec6f04-28c8-11eb-b6a8-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                // "c7ec6f05-28c8-11eb-9e65-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                // "c7ec6f06-28c8-11eb-ae2e-f875a44e0e11": "6b77c7ee-1b64-4a0d-a870-e554e59f2eb6",
                // "c7ec6f08-28c8-11eb-9357-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                // "c7ec6f09-28c8-11eb-8194-f875a44e0e11": "5a88136a-bf3a-4b48-a830-a7f42000dd24",
                // "c7ec6f0a-28c8-11eb-98b1-f875a44e0e11": "67b76fd1-4906-4055-b493-711c93fc0996",
                // "c7ec6f0b-28c8-11eb-b026-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                // "c7ec6f0c-28c8-11eb-bdbb-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                // "c7ec6f0e-28c8-11eb-afcc-f875a44e0e11": "3ccd7de2-49c9-44d1-99cd-47cc83fa583e",
                // "c7ec6f11-28c8-11eb-8d48-f875a44e0e11": "326b5f21-b744-41a1-a009-e60adb9de95c",
                // "c7ec6f12-28c8-11eb-82b0-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                // "c7ec6f13-28c8-11eb-b817-f875a44e0e11": "2103d23d-2b68-4bfb-ad23-2689f060e357",
                // "c7ec9602-28c8-11eb-b19b-f875a44e0e11": "34260e17-20ef-4cc4-b512-1ebcc6a55f1e",
                // "c7ec9603-28c8-11eb-aa4d-f875a44e0e11": "f27c88b2-d8e3-46f7-b730-ceae86161447",
                // "c7ec9604-28c8-11eb-a6a3-f875a44e0e11": "2d5e7f32-ee8d-4ae5-b660-3b7eeb9604eb",
                "7ee45be2-eeb5-11eb-9b39-a87eeabdefba": self.addressStatus(),
                "7ee45be3-eeb5-11eb-ab4a-a87eeabdefba": self.addressCurrency(),
                "7ee4330a-eeb5-11eb-bf81-a87eeabdefba": self.buildingName(),
                "7ee4330c-eeb5-11eb-b7a2-a87eeabdefba": self.buildingNumber(),
                "7ee45be9-eeb5-11eb-b69e-a87eeabdefba": self.buildingNumberSub(),
                "7ee43308-eeb5-11eb-9d03-a87eeabdefba": self.subStreet(),
                "7ee4330e-eeb5-11eb-b68a-a87eeabdefba": self.street(),
                "7ee45be7-eeb5-11eb-8022-a87eeabdefba": self.locality(),
                "7ee43304-eeb5-11eb-a788-a87eeabdefba": self.townCity(),
                "7ee459ee-eeb5-11eb-8963-a87eeabdefba": self.county(),
                "7ee43306-eeb5-11eb-95d5-a87eeabdefba": self.postcode(),
                "7ee432ff-eeb5-11eb-8299-a87eeabdefba": self.fullAddress()
            }
        });


        // // "7ee45be3-eeb5-11eb-ab4a-a87eeabdefba"	"Address Currency"
        // "7ee432fd-eeb5-11eb-82b0-a87eeabdefba"	"Address Currency Metatype"
        // // "7ee45be2-eeb5-11eb-9b39-a87eeabdefba"	"Address Status"
        // "7ee432fe-eeb5-11eb-b609-a87eeabdefba"	"Address Status Metatype"
        // "7ee432f9-eeb5-11eb-a673-a87eeabdefba"	"Addresses"
        // // "7ee4330a-eeb5-11eb-bf81-a87eeabdefba"	"Building Name"
        // "7ee43316-eeb5-11eb-8a94-a87eeabdefba"	"Building Name Metatype"
        // "7ee43317-eeb5-11eb-b721-a87eeabdefba"	"Building Name Type"
        // "7ee4330b-eeb5-11eb-a398-a87eeabdefba"	"Building Name Value"
        // // "7ee4330c-eeb5-11eb-b7a2-a87eeabdefba"	"Building Number"
        // "7ee43318-eeb5-11eb-97cf-a87eeabdefba"	"Building Number Metatype"
        // // "7ee45be9-eeb5-11eb-b69e-a87eeabdefba"	"Building Number Sub-Street"
        // "7ee43311-eeb5-11eb-9361-a87eeabdefba"	"Building Number Sub-Street Metatype"
        // "7ee43302-eeb5-11eb-945f-a87eeabdefba"	"Building Number Sub-Street Type"
        // "7ee43303-eeb5-11eb-ba5a-a87eeabdefba"	"Building Number Sub-Street Value"
        // "7ee43301-eeb5-11eb-9b7a-a87eeabdefba"	"Building Number Type"
        // "7ee4330d-eeb5-11eb-9766-a87eeabdefba"	"Building Number Value"
        // // "7ee459ee-eeb5-11eb-8963-a87eeabdefba"	"County"
        // "7ee43315-eeb5-11eb-a592-a87eeabdefba"	"County Metatype"
        // "7ee43313-eeb5-11eb-950d-a87eeabdefba"	"County Type"
        // "7ee45beb-eeb5-11eb-8679-a87eeabdefba"	"County Value"
        // // "7ee432ff-eeb5-11eb-8299-a87eeabdefba"	"Full Address"
        // "7ee45bea-eeb5-11eb-83d2-a87eeabdefba"	"Full Address Metatype"
        // "7ee459ef-eeb5-11eb-bb3b-a87eeabdefba"	"Full Address Type"
        // // "7ee45be7-eeb5-11eb-8022-a87eeabdefba"	"Locality"
        // "7ee43310-eeb5-11eb-a25b-a87eeabdefba"	"Locality Metatype"
        // "7ee43300-eeb5-11eb-863d-a87eeabdefba"	"Locality Type"
        // "7ee45be8-eeb5-11eb-a9b4-a87eeabdefba"	"Locality Value"
        // // "7ee43306-eeb5-11eb-95d5-a87eeabdefba"	"Postcode"
        // "7ee432fc-eeb5-11eb-a423-a87eeabdefba"	"Postcode Metatype"
        // "7ee45be6-eeb5-11eb-b8a9-a87eeabdefba"	"Postcode Type"
        // "7ee43307-eeb5-11eb-99c7-a87eeabdefba"	"Postcode Value"
        // // "7ee4330e-eeb5-11eb-b68a-a87eeabdefba"	"Street"
        // "7ee45bec-eeb5-11eb-9c10-a87eeabdefba"	"Street Metatype"
        // "7ee45be5-eeb5-11eb-8e1b-a87eeabdefba"	"Street Type"
        // "7ee4330f-eeb5-11eb-aa82-a87eeabdefba"	"Street Value"
        // // "7ee43308-eeb5-11eb-9d03-a87eeabdefba"	"Sub-Street "
        // "7ee43319-eeb5-11eb-a279-a87eeabdefba"	"Sub-Street Metatype"
        // "7ee43314-eeb5-11eb-84b8-a87eeabdefba"	"Sub-Street Type"
        // "7ee43309-eeb5-11eb-b0ce-a87eeabdefba"	"Sub-Street Value"
        // // "7ee43304-eeb5-11eb-a788-a87eeabdefba"	"Town or City"
        // "7ee43312-eeb5-11eb-8eb3-a87eeabdefba"	"Town or City Metatype"
        // "7ee45be4-eeb5-11eb-b1c4-a87eeabdefba"	"Town or City Type"
        // "7ee43305-eeb5-11eb-8af3-a87eeabdefba"	"Town or City Value"

        this.updatedValue = ko.pureComputed(function(){
            return {
                fullAddress: self.fullAddress(),
                buildingName: self.buildingName(),
                buildingNumber: self.buildingNumber(),
                buildingNumberSub: self.buildingNumberSub(),
                subStreet: self.subStreet(),
                street: self.street(),
                locality: self.locality(),
                townCity: self.townCity(),
                county: self.county(),
                postcode: self.postcode(),
                addressStatus: self.addressStatus(),
                addressCurrency: self.addressCurrency(),
                addressTileid: self.addressTileid(),
                nameTileid: self.nameTileid(),
                resourceInstanceId: self.resourceInstanceId(),
                applicationAreaName: self.applicationAreaName()
            };
        });

        this.updatedValue.subscribe(function(val){
            params.value(val);
        });

        this.buildTile = function(tileDataObj, nodeGroupId, resourceid, tileid) {
            var res = {
                "tileid": tileid || "",
                "nodegroup_id": nodeGroupId,
                "parenttile_id": null,
                "resourceinstance_id": resourceid,
                "sortorder": 0,
                "tiles": {},
                "data": {}
            };
            for (const key in tileDataObj){
                res.data[key] = tileDataObj[key];
            }
            return res;
        };

        this.saveTile = function(tileDataObj, nodeGroupId, resourceid, tileid) {
            var tile = self.buildTile(tileDataObj, nodeGroupId, resourceid, tileid);
            if (!tileid) {tileid = uuid.generate();}
            return window.fetch(arches.urls.api_tiles(tileid), {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(tile),
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(function(response) {
                if (response.ok) {
                    return response.json();
                }
            });
        };

        params.form.save = function() {
            self.saveTile(nameTileDataObj(), nameNodegroupId, self.resourceInstanceId(), self.nameTileid())
                .then(function(data) {
                    self.resourceInstanceId(data.resourceinstance_id);
                    self.nameTileid(data.tileid);
                    return self.saveTile(addressTileDataObj(), addressNodegroupId, data.resourceinstance_id, self.addressTileid());
                })
                .then(function(data) {
                    self.addressTileid(data.tileid);
                    params.form.complete(true);
                    params.form.savedData({
                        resourceid: self.resourceInstanceId()
                    });
                });
        };
    };

    return ko.components.register('app-area-address-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/application-area/app-area-address-step.htm'
        }
    });
});
