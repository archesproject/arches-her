define(['underscore', 'knockout', 'arches', 'utils/report', 'bindings/datatable', 'views/components/reports/scenes/keyvalue'], function(_, ko, arches, reportUtils) {
    return ko.components.register('views/components/reports/scenes/default', {
        // IMPORTANT:  this scene *requires* you to compile your own data. 
        viewModel: function(params) {
            var self = this;
            Object.assign(self, reportUtils);

            self.cards = Object.assign({}, params.cards);
            self.edit = params.editTile || self.editTile;
            self.delete = params.deleteTile || self.deleteTile;
            self.add = params.addTile || self.addNewTile;
            self.data = ko.observable();
            self.data(ko.unwrap(params.data));
            self.visible = {};
            self.sections = ko.unwrap(params.data)?.sections || []
            for(const section of self.sections) {
                self.visible[section.title] = ko.observable(true);
            }
        },
        template: { require: 'text!templates/views/components/reports/scenes/default.htm' }
    });
});