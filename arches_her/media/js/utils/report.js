import ko from "knockout";
import arches from "arches";
import { generateArchesURL } from "@/arches/utils/generate-arches-url.ts";

const standardizeNode = (obj) => {
    if (obj) {
        const keys = Object.keys(obj);
        keys.forEach((x) => {
            obj[x.toLowerCase().trim()] = obj[x];
        });
    }
};

const getRawNodeValue = (resource, ...args) => {
    let rootNode = resource;
    let testPaths = undefined;

    if (typeof args?.[0] == "object") {
        testPaths = args[0]?.testPaths;
    } else {
        testPaths = [args];
    }

    for (const path of testPaths) {
        let node = rootNode;
        for (let i = 0; i < path.length; ++i) {
            standardizeNode(node);
            const pathComponent = path[i];
            node = node?.[pathComponent];
        }
        if (node) {
            return node;
        }
    }
};

const deleteTile = async (tileid, card) => {
    const tile = card.tiles().find((y) => tileid == y.tileid);
    if (tile) {

        const tileUrl = generateArchesURL(
            "tile"
        );

        return $.ajax({
            type: "DELETE",
            url: tileUrl,
            data: JSON.stringify(tile.getData()),
            success: () => {
                const tiles = card.tiles();
                const tileIndex = tiles.indexOf(tile);
                tiles.splice(tileIndex, 1);
                card.tiles(tiles);
            },
        });
    }
    throw Error("Couldn't delete; tile was not found.");
};
const removedTiles = ko.observableArray();

const checkNestedData = (resource, ...args) => {
    if (!resource) {
        return false;
    }
    for (key of Object.keys(resource)) {
        if (args.includes(key)) {
            continue;
        }
        const rawValue = getRawNodeValue(resource, key);
        if (!rawValue || typeof rawValue !== "object") {
            continue;
        }
        if (processRawNodeValue(rawValue) != "--") {
            return true;
        } else {
            try {
                if (checkNestedData(rawValue)) {
                    return true;
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    return false;
};

const processRawNodeValue = (rawValue) => {
    if (typeof rawValue === "string") {
        return rawValue;
    } else if (!rawValue) {
        return "--";
    }
    const nodeValue =
        rawValue?.["@display_value"] || rawValue?.["display_value"];
    const geojson = rawValue?.geojson;
    if (geojson) {
        return geojson;
    }

    //strict checks here because some nodeValues (0, false, etc.) should be rendered differently.
    if (nodeValue !== undefined && nodeValue !== null && nodeValue !== "") {
        return $(`<span>${nodeValue}</span>`).text();
    } else {
        return "--";
    }
};

const removeTileFromResourceTree = (resourceObj, tileid) => {
    const resourceKeys = Object.keys(resourceObj);
    for (key of resourceKeys) {
        if (resourceObj[key]?.["@tile_id"] == tileid) {
            delete resourceObj[key];
            break;
        } else if (Array.isArray(resourceObj[key])) {
            for (item of resourceObj[key]) {
                if (item?.["@tile_id"] == tileid) {
                    const itemIndex = resourceObj[key].indexOf(item);
                    resourceObj[key].splice(itemIndex, 1);
                    break;
                }
            }
        } else if (typeof resourceObj[key] === "object") {
            resourceObj = removeTileFromResource(resourceObj[key], tileid);
        }
    }
    return resourceObj;
};

export default {
    // default table configuration - used for display
    defaultTableConfig: {
        responsive: {
            breakpoints: [
                { name: "infinity", width: Infinity },
                { name: "bigdesktop", width: 1900 },
                { name: "meddesktop", width: 1480 },
                { name: "smalldesktop", width: 1280 },
                { name: "medium", width: 1188 },
                { name: "tabletl", width: 1024 },
                { name: "btwtabllandp", width: 848 },
                { name: "tabletp", width: 768 },
                { name: "mobilel", width: 480 },
                { name: "mobilep", width: 320 },
            ],
        },
        paging: false,
        searching: false,
        scrollCollapse: true,
        info: true,
        columnDefs: [
            {
                orderable: false,
                targets: -1,
            },
        ],
    },

    removedTiles: removedTiles,

    // used to collapse sections within a tab
    toggleVisibility: (observable) => {
        observable(!observable());
    },

    // Functions used for interacting with card tree
    deleteTile: async (tileid, card, ...params) => {
        try {
            await deleteTile(tileid, card);
        } catch (e) {
            console.log(e);
            return;
        }

        const resource = params?.find(
            (param) =>
                ko.isObservable(param) &&
                Object.keys(ko.toJS(param)).some(
                    (key) => ko.toJS(param)[key]?.["@tile_id"] == tileid
                )
        );
        if (resource) {
            const resourceValue = ko.toJS(resource);
            resource(removeTileFromResourceTree(resourceValue, tileid));
        }

        const eventTarget = params?.find((param) => param?.target)?.target;
        if (eventTarget) {
            removedTiles.push(tileid);
            $(eventTarget)
                .closest("table")
                .DataTable()
                .row($(eventTarget).closest("tr"))
                .remove()
                .draw();
        }
    },

    editTile: function (tileid, card) {
        if (card) {
            const tile = card.tiles().find((y) => tileid == y.tileid);
            if (tile) {
                tile.selected(true);
            }
        }
    },

    // Can be used to check if current page is in report mode or resource manager mode
    checkCardsAvailable: function (cards) {
        if (Object.keys(cards).length > 0) {
            return true;
        }
    },

    // Used to add a new tile object to a given card.  If nested card, saves the parent tile for the
    // card and uses the same card underneath the parent tile.
    addNewTile: async (card) => {
        let currentCard = card;
        if (card.parentCard && !card.parent?.tileid) {
            await card.parentCard.saveParentTile();
            currentCard = card.parentCard
                .tiles()?.[0]
                .cards.find((x) => x.nodegroupid == card.nodegroupid);
        }
        currentCard.canAdd()
            ? currentCard.selected(true)
            : currentCard.tiles()[0].selected(true);
        if (
            currentCard.cardinality == "n" ||
            (currentCard.cardinality == "1" && !currentCard.tiles().length)
        ) {
            const currentSubscription = currentCard.selected.subscribe(
                function () {
                    currentCard.showForm(true);
                    currentSubscription.dispose();
                }
            );
        }
    },

    // builds an object-based dictionary for cards
    createCardDictionary: (cards) => {
        cards = ko.unwrap(cards);
        if (!cards) {
            return;
        }
        const dictionary = {};
        for (card of cards) {
            dictionary[card.model.name()] = card;
        }
        standardizeNode(dictionary);
        return dictionary;
    },

    // extract a value from a resource graph given a specific path (args)
    getRawNodeValue: getRawNodeValue,

    processRawValue: processRawNodeValue,

    getResourceLink: (node) => {
        if (node) {
            const resourceId =
                node?.resourceId || node?.instance_details?.[0]?.resourceId;
            if (resourceId) {
                const urlPathname = window.location.pathname;
                if (urlPathname.includes("resource")) {
                    return generateArchesURL("resource", { resourceid: resourceId });
                } else {
                    return generateArchesURL("resource_report", { resourceid: resourceId });
                }
            }
        }
    },

    getFileName: (node) => {
        if (node) {
            return node?.file_details?.[0].name;
        }
    },

    getTileId: (node) => {
        if (node) {
            return node?.["@tile_id"];
        }
    },

    getNodeValue: (resource, ...args) => {
        const rawValue = getRawNodeValue(resource, ...args);
        return processRawNodeValue(rawValue);
    },

    // see if there's any node with a valid displayable value.  If yes, return true.
    // potentially useful for deeply nested resources
    nestedDataExists: checkNestedData,
};
