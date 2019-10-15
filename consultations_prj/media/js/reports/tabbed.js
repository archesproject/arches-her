define([
    'knockout',
    'viewmodels/tabbed-report',
    'reports/map-header',
    'reports/consultations-status',
    'reports/consultations-site-visit-empty',
    'reports/consultations-conditions-mitigations',
    'reports/consultations-site-visits-summary',
    'reports/consultations-communications-summary',
    'reports/consultations-site-visit-main'
], function(ko, TabbedReportViewModel) {
    return ko.components.register('tabbed-report', {
        viewModel: TabbedReportViewModel,
        template: { require: 'text!report-templates/tabbed' }
    });
});
