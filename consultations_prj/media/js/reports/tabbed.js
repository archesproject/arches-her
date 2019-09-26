define([
    'knockout',
    'viewmodels/tabbed-report'
], function(ko, TabbedReportViewModel) {
    // register custom tabbed report components here
    
    return ko.components.register('tabbed-report', {
        viewModel: TabbedReportViewModel,
        template: { require: 'text!report-templates/tabbed' }
    });
});
