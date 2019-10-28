define([
    'jquery',
    'underscore',
    'knockout',
    'knockout-mapping',
    'arches',
    'viewmodels/alert',
    'search-components',
    'views/base-manager',
    'views/components/simple-switch'
], function($, _, ko, koMapping, arches, AlertViewModel, SearchComponents, BaseManagerView) {
    function viewModel(params) {
        BaseManagerView.apply(this,[params]);
        var self = this;

    }
    ko.components.register('consultations-help', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/consultations-help.htm'
        }
    });
    return viewModel;
});