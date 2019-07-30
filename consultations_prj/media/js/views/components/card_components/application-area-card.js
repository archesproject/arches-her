define([
    'knockout',
    'mapbox-gl',
    'views/components/cards/map',
    'views/components/card_components/select-application-area-layers',
    'text!templates/views/components/card_components/application-area-map-popup.htm'
], function(ko, mapboxgl, MapCardViewModel, selectApplicationAreaLayers, popupTemplate) {
    return ko.components.register('application-area-card', {
        viewModel: function(params) {
            var self = this;
            
            if (params.tile) {
                params.layers = selectApplicationAreaLayers(params.tile.resourceinstance_id);
                
                params.map = ko.observable();
                params.map.subscribe(function(map) {
                    map.on('draw.modechange', function() {
                        self.setSelectAreaLayersVisibility(false);
                    });
                    
                    map.on('draw.selectionchange', function() {
                        self.setSelectAreaLayersVisibility(false);
                    });
                });
            }
            
            this.setSelectAreaLayersVisibility = function(visibility) {
                var map = self.map();
                if (map) {
                    params.layers.forEach(function(layer) {
                        map.setLayoutProperty(
                            layer.id,
                            'visibility',
                            visibility ? 'visible' : 'none'
                        );
                    });
                }
            };
            
            MapCardViewModel.apply(this, [params]);
            
            this.popupTemplate = popupTemplate;
            
            this.setDrawTool = function(tool) {
                var showAreaSelectLayers = (tool === 'select_area');
                self.setSelectAreaLayersVisibility(showAreaSelectLayers);
                if (showAreaSelectLayers) {
                    self.draw.changeMode('simple_select');
                    self.selectedFeatureIds([]);
                } else if (tool) self.draw.changeMode(tool);
            };
            
            self.isApplicationArea = function(feature) {
                var selectLayerIds = params.layers.map(function(layer) {
                    return layer.id;
                });
                return selectLayerIds.indexOf(feature.layer.id) >= 0;
            };
            
            self.selectApplicationArea = function(feature) {
                console.log(feature);
            };
        },
        template: {
            require: 'text!templates/views/components/card_components/application-area-card.htm'
        }
    });
});
