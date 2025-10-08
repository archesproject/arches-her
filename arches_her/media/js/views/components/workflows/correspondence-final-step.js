import $ from "jquery";
import arches from "arches";
import ko from "knockout";
import koMapping from "knockout-mapping";
import SummaryStep from "views/components/workflows/summary-step";
import AlertViewModel from "viewmodels/alert";
import CorrespondenceFinalStepTemplate from "templates/views/components/workflows/correspondence-final-step.htm";

function viewModel(params) {
    var self = this;
    SummaryStep.apply(this, [params]);
    this.documents = ko.observableArray();
    this.resourceLoading = ko.observable(true);
    this.dataURL = params.dataURL;
    this.fileName = params.fileName;

    this.resourceData.subscribe(function (val) {
        var currentCorrespondence;
        if (Array.isArray(val.resource.Correspondence)) {
            val.resource.Correspondence.forEach(function (comm) {
                if (comm["@tile_id"] === ko.unwrap(params.tileid)) {
                    currentCorrespondence = comm;
                }
            });
        } else {
            currentCorrespondence = val.resource.Correspondence;
        }

        this.displayName = val["displayname"] || "Unnamed";
        this.reportVals = {
            consultationName: {
                name: "Related Consultation",
                value: this.getResourceValue(val, ["displayname"]),
            },
            letterType: {
                name: "Letter Type",
                value: this.getResourceValue(currentCorrespondence, [
                    "Letter Type",
                    "@value",
                ]),
            },
            letter: { name: "Letter", value: self.fileName },
        };
        this.resourceLoading(false);
        this.loading(false);
    }, this);
}

export default ko.components.register("correspondence-final-step", {
    viewModel: viewModel,
    template: CorrespondenceFinalStepTemplate,
});
