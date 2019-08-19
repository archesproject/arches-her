define([
    'underscore',
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/new-tile-step'
], function(_, $, arches, ko, koMapping, NewTileStep) {

    function viewModel(params) {

        self.loading(true);
        if (!params.resourceid() && params.requirements){
            params.resourceid(params.requirements.resourceid);
            params.tileid(params.requirements.tileid);
        }

        NewTileStep.apply(this, [params]);
        var self = this;
        
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
        var sourcenodeid = ko.unwrap(params.sourcenodeids)[0];

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
                self.tile().data[params.nodegroupid()]('Consultation for'+ val);
                if(self.loading()) { self.loading(false); }
            }
        });

        self.tile.subscribe(function(val) {
            var relatedAppAreaTile;
            if(val) {
                relatedAppAreaTile = self.getTiles(sourcenodeid)[0];
                if(!ko.unwrap(self.displayName)) {
                    self.getResourceDisplayName(relatedAppAreaTile.data[sourcenodeid]());
                }
            }
        });
    };

    return ko.components.register('consultation-name-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/new-tile-step.htm'
        }
    });
});
