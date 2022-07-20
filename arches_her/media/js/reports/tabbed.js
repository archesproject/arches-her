define([
    'knockout',
    'viewmodels/tabbed-report',
    'templates/views/report-templates/tabbed.htm',
    'reports/map-header',
    'reports/consultations-status',
    'reports/consultations-site-visit-empty',
    'reports/consultations-conditions-mitigations',
    'reports/consultations-site-visits-summary',
    'reports/consultations-communications-summary',
    'reports/consultations-site-visit-main',
], function(ko, TabbedReportViewModel, tabbedReportTemplate) {
    return ko.components.register('tabbed-report', {
        viewModel: TabbedReportViewModel,
        template: tabbedReportTemplate
    });
});
