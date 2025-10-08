import _ from "underscore";
import ko from "knockout";
import koMapping from "knockout-mapping";
import uuid from "uuid";
import arches from "arches";
import AlertViewModel from "viewmodels/alert";
import workflowUtils from "utils/workflows";
import CommunicationSelectResourceTemplate from "templates/views/components/workflows/communication-workflow/communication-select-resource.htm";
import { generateArchesURL } from "@/arches/utils/generate-arches-url.ts";

function viewModel(params) {
    var self = this;
    Object.assign(self, workflowUtils);
    this.resValue = ko.observable().extend({ deferred: true });
    this.resourceid = ko.observable();
    const communicationNodegroupId = "caf5bff1-a3d7-11e9-aa28-00224800b26d";
    this.disableResourceSelection = ko.observable(false);
    this.loading = params.loading;
    this.graphid = params.graphid;
    var getValue = function (key, isString = false) {
        return self.getProp(params, key, "value", isString);
    };
    this.date = ko.observable(getValue("date"));
    this.subject = ko.observable(getValue("subject", true));
    this.type = ko.observable(getValue("type"));
    this.tileid = ko.observable(getValue("tileid"));

    this.resValue.subscribe(function (val) {
        const resourceid =
            Array.isArray(val) && val.length ? val[0].resourceId : val;
        self.resourceid(ko.unwrap(resourceid));
    }, this);

    this.resourceid.subscribe(function (val) {
        if (val) {
            if (self.resValue() != val) {
                self.resValue([
                    {
                        resourceId: ko.observable(val),
                        ontologyProperty: ko.observable(""),
                        inverseOntologyProperty: ko.observable(""),
                        resourceXresourceId: "",
                    },
                ]);
            }
        }
    });

    this.resourceid(getValue("resourceid"));
    if (this.resourceid()) {
        this.disableResourceSelection(true);
    }

    this.updatedValue = ko.pureComputed(function () {
        return {
            tileid: self.tileid(),
            date: self.date(),
            subject: self.subject(),
            type: self.type(),
            resourceid: self.resourceid(),
        };
    });

    this.updatedValue.subscribe(function (val) {
        if (self.resourceid()) {
            params.value(val);
        }
    });

    var communicationTileData = ko.pureComputed(function () {
        return {
            "caf5bff5-a3d7-11e9-8c7e-00224800b26d": ko.unwrap(self.date), //data node
            "f4ea6a30-9378-11ea-a36d-f875a44e0e11": ko.unwrap(self.subject), //subject
            "caf5bff4-a3d7-11e9-99c5-00224800b26d": ko.unwrap(self.type), //type
        };
    });

    this.buildTile = function (tileDataObj, nodeGroupId, resourceid, tileid) {
        var res = {
            tileid: tileid || "",
            nodegroup_id: nodeGroupId,
            parenttile_id: null,
            resourceinstance_id: resourceid,
            sortorder: 0,
            tiles: {},
            data: {},
            transaction_id: params.form.workflowId,
        };
        for (const key in tileDataObj) {
            res.data[key] = tileDataObj[key];
        }
        return res;
    };

    this.saveTile = function (tileDataObj, nodeGroupId, resourceid, tileid) {
        var tile = self.buildTile(tileDataObj, nodeGroupId, resourceid, tileid);
        if (!tileid) {
            tileid = uuid.generate();
        }
        return window
            .fetch(generateArchesURL("api_tiles", { tileid: tileid }), {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(tile),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    response.json().then((result) => {
                        params.form.error(new Error("Missing Required Value"));
                        params.pageVm.alert(
                            new AlertViewModel(
                                "ep-alert-red",
                                result.title,
                                result.message
                            )
                        );
                        return;
                    });
                }
            });
    };

    params.form.save = function () {
        self.saveTile(
            communicationTileData(),
            communicationNodegroupId,
            self.resourceid(),
            self.tileid()
        ).then(function (data) {
            if (data?.resourceinstance_id) {
                self.resourceid(data.resourceinstance_id);
                self.tileid(data.tileid);
                self.disableResourceSelection(true);
                params.form.complete(true);
                //params.form.savedData({
                //    resourceid: self.resourceid(), ...self.updatedValue()
                //});
                params.form.savedData({
                    data: {
                        resourceid: self.resourceid(),
                        ...self.updatedValue(),
                    },
                    resourceInstanceId: self.resourceid(),
                    tileId: self.tileid(),
                    nodegroupId: communicationNodegroupId,
                });
            }
        });
    };
}

ko.components.register("communication-select-resource", {
    viewModel: viewModel,
    template: CommunicationSelectResourceTemplate,
});

export default viewModel;
