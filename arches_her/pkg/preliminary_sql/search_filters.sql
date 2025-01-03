--- Adds custom search filters to the database.  Temporary solution until issue with command line registering is resolved.
INSERT INTO search_component (searchcomponentid,
                name,
                icon,
                modulename,
                classname,
                type,
                componentpath,
                componentname,
                config)
            VALUES (
                '8fc3d979-e51a-45d2-8136-6bcf207c9355',
                'BNG Filter',
                'fa fa-compass',
                'bng-filter.py',
                'BngFilter',
                'popup',
                'views/components/search/bng-filter',
                'bng-filter',
                '{}');