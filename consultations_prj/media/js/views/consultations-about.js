define([
    'knockout',
    'views/base-manager'
], function(ko, BaseManagerView) {
    var aboutViewModel = BaseManagerView.extend({
        initialize: function(options) {
            BaseManagerView.prototype.initialize.call(this, options);
        }
    });
    return new aboutViewModel();
});