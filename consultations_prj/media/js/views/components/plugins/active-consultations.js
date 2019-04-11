define([
    'knockout'
], function(ko) {
    return ko.components.register('active-consultations', {
        viewModel: function(params) {
            this.title = 'Active Consultations';

            this.active_items = [
                {title: '34 Victoria Street, Westminster', description: 'Consultation/Proposal description, limited to just the first few lines in the consultation so that users can quickly scan and see if it is the consultation they are looking for', author: 'Sarah Harrison'},
                {title: '18 Minster Yard, Kensington', description: 'Consultation/Proposal description, limited to just the first few lines in the consultation so that users can quickly scan and see if it is the consultation they are looking for', author: 'Laura O\'Gorman'},
                {title: 'Bishops Palace, East Hall', description: 'Another description here', author: 'Stewart Cakebread'}
            ];
            

        },
        template: { require: 'text!templates/views/components/plugins/active-consultations.htm' }
    });
});
