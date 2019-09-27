define([
    'knockout'
], function(ko) {
    ko.components.register('consultations-status', {
        viewModel: function() {
            this.text = 'Consultations status....';
        },
        template: '<div data-bind="text: text"></div>'
    });
});
