define([
    'underscore',
    'jquery',
    'arches',
    'knockout'
], function(_, $, arches, ko) {
    function viewModel(params) {
        console.log(params);
        var self = this;
        params.stateProperties = function(){
                return {}
            };
    };
    return ko.components.register('final-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/final-step.htm'
        }
    });
});
