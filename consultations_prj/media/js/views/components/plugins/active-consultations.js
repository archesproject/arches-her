define([
    'knockout',
    'bindings/chosen'
], function(ko) {
    return ko.components.register('active-consultations', {
        viewModel: function(params) {
            var self = this;
            this.title = 'Active Consultations';
            this.layout = ko.observable('grid');
            this.setLayout = function(layout){
                self.layout(layout);
            };

            this.active_items = [
                {title: '34 Victoria Street, Westminster', description: 'Consultation/Proposal description, limited to just the first few lines in the consultation so that users can quickly scan and see if it is the consultation they are looking for', author: 'Sarah Harrison', consultation_type: 'Planning application - minor'},
                {title: '18 Minster Yard, Kensington', description: 'Consultation/Proposal description, limited to just the first few lines in the consultation so that users can quickly scan and see if it is the consultation they are looking for', author: 'Laura O\'Gorman', consultation_type: 'Planning application - major'},
                {title: 'Bishops Palace, East Hall', description: 'Another description here', author: 'Stewart Cakebread', consultation_type: 'Planning application - major'}
            ];
            

        },
        template: { require: 'text!templates/views/components/plugins/active-consultations.htm' }
    });
});
