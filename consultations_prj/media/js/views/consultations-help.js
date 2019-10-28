define([
    'knockout',
    'views/base-manager'
], function(ko, BaseManagerView) {
    var helpViewModel = BaseManagerView.extend({
        initialize: function(options) {
            BaseManagerView.prototype.initialize.call(this, options);
        }
    });
    return new helpViewModel();
});