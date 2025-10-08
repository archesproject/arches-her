import _ from "underscore";
import ko from "knockout";
import arches from "arches";
import reportUtils from "utils/report";
import KeyValueTemplate from "templates/views/components/reports/scenes/keyvalue.htm";
import "bindings/datatable";
import "bindings/reports";

export default ko.components.register(
    "views/components/reports/scenes/keyvalue",
    {
        // IMPORTANT:  this scene *requires* you to compile your own data.  Aboutness is too disparate across all models.
        viewModel: function (params) {
            var self = this;
            Object.assign(self, reportUtils);

            self.cards = Object.assign({}, params.cards);
            self.resource = params?.data || undefined;
            self.edit = params.editTile || self.editTile;
            self.delete = params.deleteTile || self.deleteTile;
            self.add = params.addTile || self.addNewTile;
            self.item = ko.unwrap(params.data);
            self.tileid = params.tileid || self.item?.tileid;
            self.visible = {};
            self.inline = params.inline || false;
            self.small = params.small || false;
        },
        template: KeyValueTemplate,
    }
);
