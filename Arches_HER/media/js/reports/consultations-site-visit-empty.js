define([
    'knockout',
], function(ko) {
    ko.components.register('consultations-site-visit-empty', {
        viewModel: function(params) {
            this.icon = params.activeTab().icon;
            this.resourceId = params.report ? params.report.attributes.resourceid : undefined;
        },
        template: { require: 'text!templates/views/components/reports/consultations-site-visit-empty.htm' }
    });
});
