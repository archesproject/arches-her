import arches from "arches";
import ko from "knockout";

export default {
    getProp: (params, key, prop, isString = false) => {
        if (ko.unwrap(params.value) && params.value()[key]) {
            return prop ? params.value()[key][prop] : params.value()[key];
        }

        if (
            ko.unwrap(params.value) &&
            params.value()["data"] &&
            params.value()["data"][key]
        ) {
            return prop & params.value()["data"][key][prop]
                ? params.value()["data"][key][prop]
                : params.value()["data"][key];
        }

        if (isString) {
            const emptyStrObject = {};
            emptyStrObject[arches.activeLanguage] = {
                value: "",
                direction: arches.languages.find(
                    (lang) => lang.code == arches.activeLanguage
                ).default_direction,
            };
            return emptyStrObject;
        } else {
            return null;
        }
    },
    createI18nString: (stringValue) => {
        return {
            [arches.activeLanguage]: {
                value: stringValue,
                direction: arches.languages.find(
                    (lang) => lang.code == arches.activeLanguage
                ).default_direction,
            },
        };
    },
    getI18nString: (StringDatatypeValue) => {
        try {
            return StringDatatypeValue[arches.activeLanguage].value;
        } catch {
            return "";
        }
    },
    setI18nString: (StringDatatypeValue, stringValue) => {
        if (typeof StringDatatypeValue === "object") {
            StringDatatypeValue[arches.activeLanguage] = {
                value: stringValue,
                direction: arches.languages.find(
                    (lang) => lang.code == arches.activeLanguage
                ).default_direction,
            };
            return StringDatatypeValue;
        } else {
            return {
                [arches.activeLanguage]: {
                    value: stringValue,
                    direction: arches.languages.find(
                        (lang) => lang.code == arches.activeLanguage
                    ).default_direction,
                },
            };
        }
    },
};
