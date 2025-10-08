import ko from "knockout";
import TabbedReportViewModel from "viewmodels/tabbed-report";
import TabbedReportVievTemplate from "templates/views/report-templates/tabbed.htm";
import "reports/map-header";
import "reports/consultations-status";
import "reports/consultations-site-visit-empty";
import "reports/consultations-conditions-mitigations";
import "reports/consultations-site-visits-summary";
import "reports/consultations-communications-summary";
import "reports/consultations-site-visit-main";

export default ko.components.register("tabbed-report", {
    viewModel: TabbedReportViewModel,
    template: TabbedReportVievTemplate,
});
