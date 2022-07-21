define([
    'knockout',
    'viewmodels/card-component',
    'templates/views/components/cards/default.htm',
], function(ko, CardViewModel, defaultCardTemplate) {

    function viewmodel(params) {
        CardViewModel.apply(this, [params]);

        this.getTableData = function(widgets, tiles) {
            var tileObjArr = [[]];
            var tilesArr = ko.unwrap(tiles);
            var widgetsArr = ko.unwrap(widgets);
            var widget = null, tile = null;
            
            for(var i = 0, j = 0; i < tilesArr.length; j++) {
                if (!tileObjArr[i]) { tileObjArr[i] = []; }
                widget = widgetsArr[j], tile = tilesArr[i];
                if (tile) {
                    tileObjArr[i][j] = {
                        name: widget.widgetLookup[widget.widget_id()].name,
                        node: widget.node,
                        config: widget.config,
                        label: widget.label,
                        value: tile.data[widget.node_id()],
                        tile: tile
                    };
                    if(i == tilesArr.length - 1) { i++; }
                }
                if(j >= 1) { 
                    j = -1;
                    i++;
                }
            }
            return tileObjArr;
        };

        this.formatSize = function(size) {
            var bytes = size;
            if(bytes == 0) return '0 Byte';
            var k = 1024;
            var dm = 2;
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            var i = Math.floor(Math.log(bytes) / Math.log(k));
            return (parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i]);
        };
    
    }

    return ko.components.register('default-card', {
        viewModel: viewmodel,
        template: defaultCardTemplate
    });
});