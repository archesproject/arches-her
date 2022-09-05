define([
    'knockout'
], function (ko) {

    return ko.components.register('accessibility', {
        template: { require: 'text!templates/views/components/plugins/accessibility.htm' }
    });

});