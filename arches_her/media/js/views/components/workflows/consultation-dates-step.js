define([
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/new-tile-step'
], function($, arches, ko, koMapping, NewTileStep) {
    function viewModel(params) {

        NewTileStep.apply(this, [params]);
        var self = this;

        if (!params.resourceid()) { 
            if (ko.unwrap(params.workflow.resourceId)) {
                params.resourceid(ko.unwrap(params.workflow.resourceId));
            }
        }

        var url = arches.urls.api_card + (ko.unwrap(params.resourceid) || ko.unwrap(params.graphid));


        params.tile = self.tile;
        this.relatedAppAreaTile = ko.observable();

        params.defineStateProperties = function(){
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: !!(params.tile) ? koMapping.toJS(params.tile().data) : undefined,
                tileid: !!(params.tile) ? ko.unwrap(params.tile().tileid): undefined
            }
        };

        this.displayName = ko.observable();
        this.concatName = ko.observable('Consultation for [Application Area] on [Log Date]');
        this.consultationNameNodegroupId = '4ad66f55-951f-11ea-b2e2-f875a44e0e11';
        this.consultationNameNodeId = '4ad69684-951f-11ea-b5c3-f875a44e0e11';
        this.consultationAppAreaNodegroupId = '152aa058-936d-11ea-b517-f875a44e0e11';
        this.appAreaNodeId = "ba54228c-2f4e-11eb-abb5-acde48001122";
        this.consultationLocationNodegroupId = '152aa058-936d-11ea-b517-f875a44e0e11';
        this.logDateNodeId = "40eff4cd-893a-11ea-b0cc-f875a44e0e11";
        this.targetDateNodeId = "7224417b-893a-11ea-b383-f875a44e0e11";

        this.workflowStepClass = ko.unwrap(params.class());

        this.getResourceDisplayName = function(resourceids) {
            var retStr = '';
            resourceids.forEach(function(id) {
                $.get(
                    arches.urls.resource_descriptors + id,
                    function(descriptors) {
                        retStr == '' ? retStr = descriptors.displayname : retStr += (', '+descriptors.displayname);
                        self.displayName(retStr);
                    }
                );
            });
        };

        this.saveConsNameTile = function() {
            var nameCard = self.topCards.find(function(topCard) {
                return topCard.nodegroupid == self.consultationNameNodegroupId;
            });
            var nameCardTile = nameCard.getNewTile();
            nameCardTile.data[self.consultationNameNodeId] = self.concatName();
            nameCardTile.save();
        };

        this.formatDate = function(date) {
            var formatted = date.getFullYear()+'-'+ ('0' + (date.getMonth()+1)).slice(-2)+'-'+('0' + date.getDate()).slice(-2);
            return formatted;
        };

        this.addDays = function(date, days) {
            var copy = new Date(Number(date));
            copy.setDate(date.getDate() + days);
            return self.formatDate(copy);
        };

        self.tile.subscribe(function(val) {
            var resourceids = [];
            var logDateVal, targetDateVal;
            var DefaultTargetDateLeadTime = 22, relatedAppAreaTile = self.getTiles(self.consultationAppAreaNodegroupId)[0];
            if(!ko.unwrap(self.displayName) && !ko.unwrap(val.data[self.targetDateNodeId])) {
                ko.unwrap(relatedAppAreaTile.data[self.appAreaNodeId]).forEach(function(obj){
                    resourceids.push(ko.unwrap(obj["resourceId"]));
                });
                self.getResourceDisplayName(resourceids);
            }
            if(val) {
                self.tile().data[self.logDateNodeId].subscribe(function(val) {
                    logDateVal = new Date(val);
                    if (logDateVal != 'Invalid Date') {
                        self.concatName('Consultation for '+self.displayName()+' on '+logDateVal.toLocaleDateString());
                        targetDateVal = self.addDays(logDateVal, DefaultTargetDateLeadTime);
                        self.tile().data[self.targetDateNodeId](targetDateVal);
                    }
                });
            }
        });

        self.onSaveSuccess = function(tiles) {
            var tile;
            self.saveConsNameTile();
            if (tiles.length > 0 || typeof tiles == 'object') {
                tile = tiles[0] || tiles;
                params.resourceid(tile.resourceinstance_id);
                params.tileid(tile.tileid);
                self.resourceId(tile.resourceinstance_id);
            }
            params.value(params.defineStateProperties());
            if (self.completeOnSave === true) { self.complete(true); }
        };
    };

    return ko.components.register('consultation-dates-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/hide-card-step.htm'
        }
    });
});
