define([
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/hide-card-step'
], function($, arches, ko, koMapping, HideCardStep) {
    function viewModel(params) {
        // console.log(HideCardStep);

        HideCardStep.apply(this, [params]);
        // self.loading(true);
        if (!params.resourceid() && params.requirements){
            params.resourceid(params.requirements.resourceid);
            params.tileid(params.requirements.tileid);
        }

        // HideCardStep.apply(this, [params]);
        var self = this;
        console.log(self.card());
        
        self.requirements = params.requirements;
        params.tile = self.tile;
        this.relatedAppAreaTile = ko.observable();

        params.stateProperties = function(){
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: !!(params.tile) ? koMapping.toJS(params.tile().data) : undefined,
                tileid: !!(params.tile) ? ko.unwrap(params.tile().tileid): undefined
            }
        };

        this.displayName = ko.observable();
        this.sourcenodeid = ko.unwrap(params.sourcenodeids)[0];
        this.consultationNameNodeId = '8d41e4ab-a250-11e9-87d1-00224800b26d';
        this.appAreaNodeId = "8d41e4de-a250-11e9-973b-00224800b26d";
        this.relatedAppAreaNodeId = '8d41e4ba-a250-11e9-9b20-00224800b26d';

        this.logDateNodeId = ko.observable();

        this.getResourceDisplayName = function(resourceid) {
            $.get(
                arches.urls.resource_descriptors + resourceid,
                function(descriptors) {
                    self.displayName(descriptors.displayname);
                }
            );
        };

        self.displayName.subscribe(function(val){
            if(val) {
                //get a new tile using cardid / nodegroupid?, save with resourceid
                self.tile().data[consultationNameNodeId]('Consultation for '+ val);
                if(self.loading()) { self.loading(false); }
            }
        });


        self.tile.subscribe(function(val) {
            var relatedAppAreaTile, resourceid;
            if(val) {
                relatedAppAreaTile = self.getTiles(self.relatedAppAreaNodeId)[0];

                console.log(relatedAppAreaTile);
                if(!ko.unwrap(self.displayName)) {
                    resourceid = ko.unwrap(relatedAppAreaTile.data[self.appAreaNodeId]);
                    console.log(resourceid);
                    self.getResourceDisplayName(resourceid);
                }
            }
        });

        self.onSaveSuccess = function(tiles) {
            var tile;
            var dateCard = self.card();
            console.log(dateCard);
            if (tiles.length > 0 || typeof tiles == 'object') {
                tile = tiles[0] || tiles;
                params.resourceid(tile.resourceinstance_id);
                params.tileid(tile.tileid);
                self.resourceId(tile.resourceinstance_id);
            }
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
