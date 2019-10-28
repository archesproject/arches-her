define([
    'knockout',
    'views/base-manager'
], function(ko, BaseManagerView) {
    function aboutViewModel(params) {
        BaseManagerView.apply(this,[params]);
        var self = this;
        self.loading(false);
        self.visible(true);
        console.log(ko.unwrap(self));

    }
    ko.components.register('consultations-about', {
        viewModel: aboutViewModel,
        template: {
            require: 'text!consultations_prj/templates/views/consultations-about.htm'
        }
    });
});