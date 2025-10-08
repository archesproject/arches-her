import _ from "underscore";
import $ from "jquery";
import arches from "arches";
import ko from "knockout";
import koMapping from "knockout-mapping";
import NewTileStep from "views/components/workflows/new-tile-step";
import PhotoGalleryStepTemplate from "templates/views/components/workflows/photo-gallery-step.htm";

function viewModel(params) {
    _.extend(this, params.form);

    var self = this;
    this.card.subscribe(function (val) {
        if (val.tiles() && val.tiles().length === 0) {
            self.complete(false);
            val.tiles.subscribe(function (tiles) {
                if (tiles.length) {
                    self.complete(true);
                }
            });
        } else {
            self.complete(true);
        }
    });
}

export default ko.components.register("photo-gallery-step", {
    viewModel: viewModel,
    template: PhotoGalleryStepTemplate,
});
