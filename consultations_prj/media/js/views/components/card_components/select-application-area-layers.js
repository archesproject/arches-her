define([], function() {
    var areaSelectColor = "#f0c200";
    return function(resourceId) {
        return [{
            "id": "select-application-area-polygon-fill",
            "type": "fill",
            "filter": ['all',[
                "==", "$type", "Polygon"
            ], [
                "!=", "resourceinstanceid", resourceId
            ]],
            "paint": {
                "fill-color": areaSelectColor,
                "fill-outline-color": areaSelectColor,
                "fill-opacity": 0.1
            },
            "source": "select-application-area",
            "source-layer": "select-application-area",
            "layout": {
                "visibility": "none"
            }
        }, {
            "id": "select-application-area-polygon-stroke",
            "type": "line",
            "filter": ['all',[
                "==", "$type", "Polygon"
            ], [
                "!=", "resourceinstanceid", resourceId
            ]],
            "layout": {
                "line-cap": "round",
                "line-join": "round",
                "visibility": "none"
            },
            "paint": {
                "line-color": areaSelectColor,
                "line-width": 2
            },
            "source": "select-application-area",
            "source-layer": "select-application-area"
        }, {
            "id": "select-application-area-line",
            "type": "line",
            "filter": ['all',[
                "==", "$type", "LineString"
            ], [
                "!=", "resourceinstanceid", resourceId
            ]],
            "layout": {
                "line-cap": "round",
                "line-join": "round",
                "visibility": "none"
            },
            "paint": {
                "line-color": areaSelectColor,
                "line-width": 2
            },
            "source": "select-application-area",
            "source-layer": "select-application-area"
        }, {
            "id": "select-application-area-point-point-stroke",
            "type": "circle",
            "filter": ['all',[
                "==", "$type", "Point"
            ], [
                "!=", "resourceinstanceid", resourceId
            ]],
            "paint": {
                "circle-radius": 5,
                "circle-opacity": 1,
                "circle-color": "#fff"
            },
            "source": "select-application-area",
            "source-layer": "select-application-area",
            "layout": {
                "visibility": "none"
            }
        }, {
            "id": "select-application-area-point",
            "type": "circle",
            "filter": ['all',[
                "==", "$type", "Point"
            ], [
                "!=", "resourceinstanceid", resourceId
            ]],
            "paint": {
                "circle-radius": 3,
                "circle-color": areaSelectColor
            },
            "source": "select-application-area",
            "source-layer": "select-application-area",
            "layout": {
                "visibility": "none"
            }
        }];
    };
});
