define([
    'knockout',
    'mapbox-gl',
    'uuid',
    'views/components/cards/map',
    'views/components/card_components/select-application-area-layers',
    'text!templates/views/components/card_components/application-area-map-popup.htm'
], function(ko, mapboxgl, uuid, MapCardViewModel, selectApplicationAreaLayers, popupTemplate) {
    return ko.components.register('application-area-card', {
        viewModel: function(params) {
            var self = this;
            var resourceId = params.tile ? params.tile.resourceinstance_id : '';
            var applicationAreaLayers = selectApplicationAreaLayers(resourceId);
            params.layers = applicationAreaLayers;
            
            params.map = ko.observable();
            params.map.subscribe(function(map) {
                map.on('draw.modechange', function() {
                    self.setSelectAreaLayersVisibility(false);
                });
                
                map.on('draw.selectionchange', function() {
                    self.setSelectAreaLayersVisibility(false);
                });
            });
            
            this.setSelectAreaLayersVisibility = function(visibility) {
                var map = self.map();
                if (map) {
                    applicationAreaLayers.forEach(function(layer) {
                        map.setLayoutProperty(
                            layer.id,
                            'visibility',
                            visibility ? 'visible' : 'none'
                        );
                    });
                }
            };
            
            params.additionalDrawOptions = [{
                value: "select_area",
                text: "Select application area"
            }];
            
            MapCardViewModel.apply(this, [params]);
            
            this.isFeatureClickable = function(feature) {
                var tool = self.selectedTool();
                if (tool && tool !== 'select_area') return false;
                return feature.properties.resourceinstanceid;
            };
            
            this.geoJSONString.subscribe(function() {
                self.setSelectAreaLayersVisibility(false);
            });
            
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
                var selectLayerIds = applicationAreaLayers.map(function(layer) {
                    return layer.id;
                });
                return selectLayerIds.indexOf(feature.layer.id) >= 0;
            };
            
            self.selectApplicationArea = function(feature) {
                var newFeature = {
                    "id": uuid.generate(),
                    "type": "Feature",
                    "properties": {
                        "nodeId": self.newNodeId
                    },
                    "geometry": JSON.parse(feature.properties.geojson)
                };
                self.draw.add(newFeature);
                self.updateTiles();
                self.popup.remove();
                self.editFeature(newFeature);
            };
        },
        template: {
            require: 'text!templates/views/components/cards/map.htm'
        }
    });
});
