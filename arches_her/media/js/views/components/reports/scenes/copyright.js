import _ from "underscore";
import ko from "knockout";
import arches from "arches";
import reportUtils from "utils/report";
import CopyrightTemplate from "templates/views/components/reports/scenes/copyright.htm";
import "bindings/datatable";
import "bindings/reports";

export default ko.components.register(
    "views/components/reports/scenes/copyright",
    {
        viewModel: function (params) {
            const self = this;
            Object.assign(self, reportUtils);

            self.copyrightTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(4).fill(null),
            };

            self.dataConfig = {
                copyright: "copyright",
            };

            self.cards = Object.assign({}, params.cards);
            self.resource = params?.data || undefined;
            self.edit = params.editTile || self.editTile;
            self.delete = params.deleteTile || self.deleteTile;
            self.add = params.addTile || self.addNewTile;
            self.copyright = ko.observableArray();
            self.visible = {
                copyright: ko.observable(true),
            };
            Object.assign(self.dataConfig, params.dataConfig || {});

            const copyrightNode = self.getRawNodeValue(
                params.data(),
                self.dataConfig.copyright
            );

            if (copyrightNode) {
                const holder = self.getNodeValue(
                    copyrightNode,
                    "copyright holder"
                );
                const holderLink = self.getResourceLink(
                    self.getRawNodeValue(copyrightNode, "copyright holder")
                );
                const note = self.getNodeValue(
                    copyrightNode,
                    "copyright note",
                    "copyright note text"
                );
                const type = self.getNodeValue(copyrightNode, "copyright type");
                const tileid = self.getTileId(copyrightNode);
                self.copyright([{ holder, holderLink, note, type, tileid }]);
            }
        },
        template: CopyrightTemplate,
    }
);
