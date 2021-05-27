define([
    'underscore',
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'uuid',
    'views/components/workflows/new-tile-step'
], function(_, $, arches, ko, koMapping, uuid, NewTileStep) {
    function viewModel(params) {
        var self = this;

        /*var buildingNameNodeId = 'c7ec960d-28c8-11eb-aee4-f875a44e0e11';
        var buildingNumberNodeId = 'c7ec960f-28c8-11eb-86f0-f875a44e0e11';
        var buildingNumberSubNodeId = 'c7ec9605-28c8-11eb-bfd4-f875a44e0e11';
        var subStreetNodeId = 'c7ec960b-28c8-11eb-b8ad-f875a44e0e11';
        var streetNodeId = 'c7ec9611-28c8-11eb-b865-f875a44e0e11';
        var localityNodeId = 'c7ec9613-28c8-11eb-966c-f875a44e0e11';
        var townCityNodeId = 'c7ec9607-28c8-11eb-acf0-f875a44e0e11';
        var countyNodeId = 'c7ec9615-28c8-11eb-a5c5-f875a44e0e11';
        var postcodeNodeId = 'c7ec9609-28c8-11eb-a6a3-f875a44e0e11';
        var fullAddressNodeId = 'c7ec6f07-28c8-11eb-8fb9-f875a44e0e11';*/
        var addressNodegroupId = 'c7ec6efa-28c8-11eb-9ed1-f875a44e0e11';
        var nameNodegroupId = '9c9f9dbb-83bf-11ea-bca7-f875a44e0e11'

        var getValue = function(key) {
            return ko.unwrap(params.value) ? params.value()[key] : null; 
        }

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

        this.showName = ko.observable(false);

        this.fullAddress = ko.pureComputed(function(){
            var building = [self.buildingName(), self.buildingNumber(), self.buildingNumberSub()].filter(Boolean).join(" ");
            var fullStreet = [self.subStreet(), self.street()].filter(Boolean).join(" ");
            return [building, fullStreet, self.locality(), self.townCity(), self.county(), self.postcode()].filter(Boolean).join(", ")
        });

        var nameTileDataObj = ko.pureComputed(function(){
            return {
                "279329b0-94fc-11ea-8279-f875a44e0e11": "a0e096e2-f5ae-4579-950d-3040714713b4",
                "45cef0b8-94fc-11ea-85ca-f875a44e0e11": "04a4c4d5-5a5e-4018-93aa-65abaa53fb53",
                "9c9f9dbe-83bf-11ea-aa43-f875a44e0e11": "2df285fa-9cf2-45e7-bc05-a67b7d7ddc2f",
                "9c9f9dbf-83bf-11ea-b1a9-f875a44e0e11": "e987fb72-6fa6-43ab-8812-867c4813a2a2",
                "9c9f9dc0-83bf-11ea-8d22-f875a44e0e11": self.fullAddress()    
            }
        })

        var addressTileDataObj = ko.pureComputed(function(){
            return {
                "c7ec6efd-28c8-11eb-8c56-f875a44e0e11": "8a37a140-0be2-44bc-aa64-74c1f3f3b372",
                "c7ec6efe-28c8-11eb-908a-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                "c7ec6eff-28c8-11eb-abfb-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                "c7ec6f00-28c8-11eb-95f7-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                "c7ec6f01-28c8-11eb-b4f8-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                "c7ec6f02-28c8-11eb-9fff-f875a44e0e11": "98355a3e-6f84-45ae-9281-8aa7e20d47f5",
                "c7ec6f03-28c8-11eb-8fc7-f875a44e0e11": "78b7f967-9831-42ea-b744-1737c5cb2ebc",
                "c7ec6f04-28c8-11eb-b6a8-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                "c7ec6f05-28c8-11eb-9e65-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                "c7ec6f06-28c8-11eb-ae2e-f875a44e0e11": "6b77c7ee-1b64-4a0d-a870-e554e59f2eb6",
                "c7ec6f08-28c8-11eb-9357-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                "c7ec6f09-28c8-11eb-8194-f875a44e0e11": "5a88136a-bf3a-4b48-a830-a7f42000dd24",
                "c7ec6f0a-28c8-11eb-98b1-f875a44e0e11": "67b76fd1-4906-4055-b493-711c93fc0996",
                "c7ec6f0b-28c8-11eb-b026-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                "c7ec6f0c-28c8-11eb-bdbb-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                "c7ec6f0e-28c8-11eb-afcc-f875a44e0e11": "3ccd7de2-49c9-44d1-99cd-47cc83fa583e",
                "c7ec6f11-28c8-11eb-8d48-f875a44e0e11": "326b5f21-b744-41a1-a009-e60adb9de95c",
                "c7ec6f12-28c8-11eb-82b0-f875a44e0e11": "6bdffb5e-9f5b-44f7-a3a6-11cf81219fd8",
                "c7ec6f13-28c8-11eb-b817-f875a44e0e11": "2103d23d-2b68-4bfb-ad23-2689f060e357",
                "c7ec9602-28c8-11eb-b19b-f875a44e0e11": "34260e17-20ef-4cc4-b512-1ebcc6a55f1e",
                "c7ec9603-28c8-11eb-aa4d-f875a44e0e11": "f27c88b2-d8e3-46f7-b730-ceae86161447",
                "c7ec9604-28c8-11eb-a6a3-f875a44e0e11": "2d5e7f32-ee8d-4ae5-b660-3b7eeb9604eb",
                "c7ec6f0f-28c8-11eb-9b24-f875a44e0e11": self.addressStatus(),
                "c7ec6f10-28c8-11eb-ba5c-f875a44e0e11": self.addressCurrency(),
                'c7ec960d-28c8-11eb-aee4-f875a44e0e11': self.buildingName(),
                'c7ec960f-28c8-11eb-86f0-f875a44e0e11': self.buildingNumber(),
                'c7ec9605-28c8-11eb-bfd4-f875a44e0e11': self.buildingNumberSub(),
                'c7ec960b-28c8-11eb-b8ad-f875a44e0e11': self.subStreet(),
                'c7ec9611-28c8-11eb-b865-f875a44e0e11': self.street(),
                'c7ec9613-28c8-11eb-966c-f875a44e0e11': self.locality(),
                'c7ec9607-28c8-11eb-acf0-f875a44e0e11': self.townCity(),
                'c7ec9615-28c8-11eb-a5c5-f875a44e0e11': self.county(),
                'c7ec9609-28c8-11eb-a6a3-f875a44e0e11': self.postcode(),
                'c7ec6f07-28c8-11eb-8fb9-f875a44e0e11': self.fullAddress(),
            }
        })

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
            self.saveTile(nameTileDataObj(), nameNodegroupId, null, self.nameTileid())
                .then(function(data) {
                    self.nameTileid(data.tileid);
                    return self.saveTile(addressTileDataObj(), addressNodegroupId, data.resourceinstance_id, self.addressTileid());
                })
                .then(function(data) {
                    self.addressTileid(data.tileid);
                    params.form.complete(true);
                    params.form.savedData(params.form.addedData());
                });
        };
    }

    return ko.components.register('app-area-address-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/application-area/app-area-address-step.htm'
        }
    });
});
