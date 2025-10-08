import ko from "knockout";
import arches from "arches";
import InitWorkflowTemplate from "templates/views/components/plugins/init-workflow.htm";
import { generateArchesURL } from "@/arches/utils/generate-arches-url.ts";

var InitWorkflow = function (params) {
    this.workflows = params.workflows.map(function (wf) {
        wf.url = generateArchesURL("plugins", { pluginid: wf.slug });
        return wf;
    }, this);
};

export default ko.components.register("init-workflow", {
    viewModel: InitWorkflow,
    template: InitWorkflowTemplate,
});
