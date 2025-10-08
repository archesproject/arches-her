import ko from "knockout";
import FinalStep from "views/components/workflows/final-step";
import geojsonExtent from "geojson-extent";
import MapComponentViewModel from "views/components/map";
import selectFeatureLayersFactory from "views/components/cards/select-feature-layers";
import AlertViewModel from "viewmodels/alert";
import { generateArchesURL } from "@/arches/utils/generate-arches-url.ts";

function viewModel(params) {
    FinalStep.apply(this, [params]);
    this.resourceData = ko.observable();
    this.relatedResources = ko.observableArray();

    this.getResourceData = function () {
        const resourceUrl = generateArchesURL("resources", {
            resourceid: this.resourceid,
        });
        fetch(`${resourceUrl}?format=json&compact=false`)
            .then((response) => response.json())
            .then((data) => this.resourceData(data));
    };

    this.getRelatedResources = function () {
        window
            .fetch(
                this.urls.related_resources +
                    this.resourceid +
                    "?paginate=false"
            )
            .then((response) => response.json())
            .then((data) => this.relatedResources(data));
    };

    this.init = function () {
        this.getResourceData();
        this.getRelatedResources();
    };

    this.getResourceValue = function (obj, attrs, missingValue = "none") {
        try {
            return (
                attrs.reduce(function index(obj, i) {
                    return obj[i];
                }, obj) || missingValue
            );
        } catch (e) {
            return missingValue;
        }
    };

    this.prepareMap = function (geojson, source) {
        var mapParams = {};
        if (geojson.features.length > 0) {
            mapParams.bounds = geojsonExtent(geojson);
            mapParams.fitBoundsOptions = { padding: 20 };
        }
        var sourceConfig = {};
        sourceConfig[source] = {
            type: "geojson",
            data: geojson,
        };
        mapParams.sources = Object.assign(sourceConfig, mapParams.sources);
        mapParams.layers = selectFeatureLayersFactory(
            "", //resourceid
            source, //source
            undefined, //sourceLayer
            [], //selectedResourceIds
            true, //visible
            "#ff2222" //color
        );
        MapComponentViewModel.apply(this, [
            Object.assign({}, mapParams, {
                activeTab: ko.observable(false),
                zoom: null,
            }),
        ]);

        this.layers = mapParams.layers;
        this.sources = mapParams.sources;
    };

    this.init();
}

export default viewModel;
