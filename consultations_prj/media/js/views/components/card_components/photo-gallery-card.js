define([
    'knockout',
    'underscore',
    'viewmodels/card-component'
], function(ko, _, CardComponentViewModel) {
    return ko.components.register('photo-gallery-card', {
        viewModel: function(params) {
            params.configKeys = ['acceptedFiles', 'maxFilesize'];
            var self = this;
            CardComponentViewModel.apply(this, [params]);

            this.tabItems = [
                {'name': 'alpha', 'icon': 'fa fa-android'},
                {'name': 'beta', 'icon': 'fa fa-anchor'},
                {'name': 'delta', 'icon': 'fa fa-camera'}
            ];
            this.activeTab = ko.observable();
            this.setActiveTab = function(tabname){
                var name = this.activeTab() === tabname ? '' : tabname;
                this.activeTab(name);
            };
        },
        template: {
            require: 'text!templates/views/components/card_components/photo-gallery-card.htm'
        }
    });
});
