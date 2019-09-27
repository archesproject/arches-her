define([
    'knockout',
    'views/components/cards/default'
], function(ko, CardViewModel) {

    function viewmodel(params) {
        CardViewModel.apply(this, [params]);
        var self = this;
        console.log("hello from cardjs");

    }

    return ko.components.register('default-card', {
        viewModel: CardComponentViewModel,
        template: {
            require: 'text!templates/views/components/cards/default.htm'
        }
    });
});