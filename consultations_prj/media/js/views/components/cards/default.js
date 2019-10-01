define([
    'knockout',
    'viewmodels/card-component'
], function(ko, CardViewModel) {

    function viewmodel(params) {
        CardViewModel.apply(this, [params]);
        var self = this;

        this.getTableData = function(widgets, tiles) {
            var tileObjArr = [[]]
            var tilesArr = ko.unwrap(tiles);
            var widgets = ko.unwrap(widgets);
            var widget = null, tile = null;
            
            for(var i = 0, j = 0; i < tilesArr.length; j++) {
                if (!tileObjArr[i]) { tileObjArr[i] = []; }
                widget = widgets[j], tile = tilesArr[i];
                if (tile) {
                    tileObjArr[i][j] = {
                        name: widget.widgetLookup[widget.widget_id()].name,
                        node: widget.node,
                        config: widget.config,
                        label: widget.label,
                        value: tile.data[widget.node_id()],
                        tile: tile
                    };
                }
                if(j >= 1) { 
                    j = -1;
                    i++;
                }
            }
            return tileObjArr;
        };

    }

    return ko.components.register('default-card', {
        viewModel: viewmodel,
        template: {
            require: 'text!templates/views/components/cards/default.htm'
        }
    });
});