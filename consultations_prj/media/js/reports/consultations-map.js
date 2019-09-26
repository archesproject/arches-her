define([
    'knockout'
], function(ko) {
    ko.components.register('consultations-map', {
        viewModel: function() {
            this.text = 'Consultations map....';
        },
        template: '<div data-bind="text: text"></div>'
    });
});
