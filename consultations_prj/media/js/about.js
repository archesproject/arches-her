define([
    'knockout',
    // 'views/base-manager'
], function(ko) {
    function aboutViewModel(params) {
        /** L#74 of arches base.htm requires this file to be in media/js/ **/
        // BaseManagerView.apply(this,[params]);
        var self = this;
        self.loading(false);
        self.visible(true);
        console.log(ko.unwrap(self));

    }
    return ko.components.register('about', {
        viewModel: aboutViewModel,
        template: {
            require: 'text!templates/about.htm'
        }
    });
    return aboutViewModel;
});