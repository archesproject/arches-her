define([
    'knockout',
    'viewmodels/tabbed-report',
    'reports/map-header',
    'reports/consultations-status',
    'reports/consultations-site-visit-empty'
], function(ko, TabbedReportViewModel) {
    return ko.components.register('tabbed-report', {
        viewModel: TabbedReportViewModel,
        template: { require: 'text!report-templates/tabbed' }
    });
});
