import _ from "underscore";
import $ from "jquery";
import arches from "arches";
import ko from "knockout";
import koMapping from "knockout-mapping";
import AlertViewModel from "viewmodels/alert";
import NewTileStep from "views/components/workflows/new-tile-step";
import NewTileStepTemplate from "templates/views/components/workflows/new-tile-step.htm";
import { generateArchesURL } from "@/arches/utils/generate-arches-url.ts";

function viewModel(params) {
    // get the template value from the tile from prev step, (done)
    // make request to do the docx work and retrieve the file (done)
    // -- file retrieval: name it with date (easy enough)
    // -- and create a link to download it via the download btn
    // -- upload new file to dropzone?
    // populate file-list widget with existing other tile data?

    if (!params.resourceid() && params.requirements) {
        params.resourceid(params.requirements.resourceid);
        params.tileid(params.requirements.tileid);
    }

    NewTileStep.apply(this, [params]);
    var self = this;
    self.requirements = params.requirements;
    params.tile = self.tile;

    params.defineStateProperties = function () {
        return {
            resourceid: ko.unwrap(params.resourceid),
            tile: !!params.tile
                ? koMapping.toJS(params.tile().data)
                : undefined,
            tileid: !!params.tile ? ko.unwrap(params.tile().tileid) : undefined,
        };
    };

    self.tile.subscribe(function (val) {
        if (val) {
            if (self.requirements) {
                if (self.requirements.applyOutputToTarget) {
                    val.data[self.requirements.targetnode](
                        self.requirements.value
                    );
                }
            }
        }
    });
    console.log(self, params);

    this.retrieveFile = function () {
        var tiles = params.requirements.tiles;
        var letterTypeNodeId = "8d41e4df-a250-11e9-af01-00224800b26d";
        var templateId = false;

        tiles.forEach(function (tile) {
            if (ko.unwrap(tile["data"][letterTypeNodeId])) {
                templateId = tile["data"][letterTypeNodeId]();
            }
        });
        if (templateId) {
            $.ajax({
                type: "GET",
                url: generateArchesURL("filetemplate"),
                data: {
                    resourceinstance_id: params.resourceid(),
                    template_id: templateId,
                },
                context: self,
                success: function (responseText, status, response) {
                    console.log(response.responseJSON);
                },
                error: function (response, status, error) {
                    console.log(response);
                    if (response.statusText !== "abort") {
                        this.viewModel.alert(
                            new AlertViewModel(
                                "ep-alert-red",
                                arches.requestFailed.title,
                                response.responseText
                            )
                        );
                    }
                },
            });
        }
        self.loading(false);
    };
}

export default ko.components.register("file-template", {
    viewModel: viewModel,
    template: NewTileStepTemplate,
});
