define([
    'knockout',
    'viewmodels/tabbed-report',
    'reports/consultations-map',
    'reports/consultations-status'
], function(ko, TabbedReportViewModel) {
    return ko.components.register('tabbed-report', {
        viewModel: TabbedReportViewModel,
        template: { require: 'text!report-templates/tabbed' }
    });
});
