SET CLIENT_ENCODING TO UTF8;
SET STANDARD_CONFORMING_STRINGS TO ON;
BEGIN;

INSERT INTO map_sources(name, source)
    VALUES ('select-application-area', '{
        "data": "/geojson?nodeid=6c923175-53d9-11e9-8c78-dca90488358a",
        "type": "geojson"
    }');