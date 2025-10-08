import _ from "underscore";
import $ from "jquery";
import arches from "arches";
import ko from "knockout";
import koMapping from "knockout-mapping";
import NewTileStep from "views/components/workflows/new-tile-step";
import HideCardStepTemplate from "templates/views/components/workflows/hide-card-step.htm";

function viewModel(params) {
    NewTileStep.apply(this, [params]);
    if (!params.resourceid()) {
        params.resourceid(ko.unwrap(params.workflow.resourceId));
    }
    if (params.workflow.steps[params._index]) {
        params.tileid(ko.unwrap(params.workflow.steps[params._index].tileid));
    }

    this.workflowStepClass = ko.unwrap(params.class());
    params.defineStateProperties = function () {
        return {
            resourceid: ko.unwrap(params.resourceid),
            tile: !!ko.unwrap(params.tile)
                ? koMapping.toJS(params.tile().data)
                : undefined,
            tileid: !!ko.unwrap(params.tile)
                ? ko.unwrap(params.tile().tileid)
                : undefined,
        };
    };
}

export default ko.components.register("hide-card-step", {
    viewModel: viewModel,
    template: HideCardStepTemplate,
});
