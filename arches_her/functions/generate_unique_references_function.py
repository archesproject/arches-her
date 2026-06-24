from uuid import UUID
from arches.app.functions.base import BaseFunction
from arches.app.models import models
from arches.app.models.tile import Tile
from arches.app.models.system_settings import settings
from django.db.models.functions import Cast
from django.db.models import Max, IntegerField
from django.db import connection
import logging
import json
from datetime import datetime

details = {
    "name": "Generate Unique References",
    "type": "node",
    "description": "Checks for Simple UID and Resource ID nodes populated and, if not populated, generates them",
    "defaultconfig": {
        "simpleuid_node": "",
        "resourceid_node": "",
        "uniqueresource_nodegroup": "",
        "triggering_nodegroups": [],
        "nodegroup_nodes": [],
    },
    "classname": "GenerateUniqueReferences",
    "component": "views/components/functions/generate-unique-references-function",
    "functionid": "39d627ae-6973-4ddb-8b62-1f0230e1e3f9",
}


class GenerateUniqueReferences(BaseFunction):
    # def __init__(self,):
    # super(GenerateUniqueReferences, self).__init__()
    # self.logger = logging.getLogger(__name__)

    def get(self):
        raise NotImplementedError

    def save(self, tile, request, context=None):
        self.logger = logging.getLogger(__name__)
        try:

            def get_next_simple_id():
                """
                Gets the max id for all simple_id nodes across all graphs where the GenerateUniqueReferences function has been configured
                """
                self.logger.debug(str(datetime.now()) + " DEBUG: get_next_simple_id CALLED ========================================")

                if simpleid_nextval_table_exists():
                    return get_next_simpleid()

                simpleid_node_info = get_simple_id_nodeinfo(details["functionid"])

                # Don't like doing direct SQL but the django model is too slow.
                # The input values are pulled from the database using the function configs.
                sql_node_str = ""
                sql_nodegroups = []
                sql_params = []
                for nodeinfo in simpleid_node_info:
                    sid = nodeinfo["simpleid"]
                    ngid = nodeinfo["unique_ng_id"]

                    # UUID parse to give a sql injection protection
                    try:
                        x = UUID(sid)
                        x = UUID(ngid)
                    except Exception:
                        raise TypeError("Expected UUID values are not parsing correctly")

                    sql_node_str = sql_node_str + "t.tiledata ->> %s::text,"
                    sql_params.append(str(sid))
                    sql_nodegroups.append(ngid)

                sql = f"""
                SELECT hobs.simple_id::int
                    FROM (
                        SELECT
                        COALESCE(
                            {sql_node_str}
                        '0') AS simple_id
                        FROM tiles t
                        WHERE nodegroupid IN %s
                    ) hobs
                    ORDER BY hobs.simple_id::int DESC
                    LIMIT 1
                """

                sql_nodegroups.append("11111111-1111-1111-1111-111111111111")
                sql_params.append(tuple(sql_nodegroups))

                with connection.cursor() as cursor:
                    cursor.execute(sql, sql_params)
                    ret = cursor.fetchone()

                try:
                    ret = int(ret[0]) + 1
                except:
                    ret = 1

                if not simpleid_nextval_table_exists():
                    create_simpleid_nextval_table(start=ret + 1)

                self.logger.debug(
                    str(datetime.now()) + " DEBUG: get_next_simple_id COMPLETE ({0})========================================".format(ret)
                )
                return ret

            def create_simpleid_nextval_table(start=1):
                cursor = connection.cursor()
                sql_params = [start]
                # New code to create table and sequence
                create_table_query = """
                    CREATE SEQUENCE simpleid_nextval_id_seq MINVALUE 1 START %s;
                    
                    CREATE TABLE simpleid_nextval
                    (
                        ID integer NOT NULL DEFAULT nextval('simpleid_nextval_id_seq'),
                        CONSTRAINT simpleid_nextval_pkey PRIMARY KEY (ID)
                    );
                    
                    ALTER SEQUENCE simpleid_nextval_id_seq OWNED BY simpleid_nextval.ID;
                """

                cursor.execute(create_table_query, sql_params)

            def simpleid_nextval_table_exists():
                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        SELECT EXISTS (
                            SELECT FROM information_schema.tables 
                            WHERE  table_schema = 'public'
                            AND    table_name   = 'simpleid_nextval'
                        );
                    """
                    )
                    return bool(cursor.fetchone()[0])

            def get_next_simpleid():
                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        TRUNCATE TABLE simpleid_nextval;
                        INSERT INTO simpleid_nextval DEFAULT VALUES RETURNING id;
                    """
                    )
                    return int(cursor.fetchone()[0])

            def get_simple_id_nodeinfo(functionid=None):
                """
                This will fetch all the set simpleid nodes configured across the graphs
                """
                if functionid is None:
                    raise Exception("Functionid is required")

                nodeinfos = []

                funcs = models.FunctionXGraph.objects.filter(function_id=functionid)
                for fn in funcs:
                    try:
                        nodeinfos.append(
                            {
                                "simpleid": fn.config["simpleuid_node"],
                                "unique_ng_id": fn.config["uniqueresource_nodegroup"],
                            }
                        )
                    except:
                        pass

                return nodeinfos

            resourceIdValue = tile.resourceinstance_id
            simpleNode = self.config["simpleuid_node"]
            resourceIdNode = self.config["resourceid_node"]
            refNodegroup = self.config["uniqueresource_nodegroup"]

            def check_and_populate_uids(currentTile, simpleid_node, resid_node, resourceidval):
                """
                Checks the input tile to see if it contains the correct resource id and simpleid
                values.  If not, populates these ids.
                """

                def populate_simple_id(currentTile, simple_node_id):
                    nextsimpleval = get_next_simple_id()
                    currentTile.data[simple_node_id] = nextsimpleval
                    return True

                def populate_resid_id(currentTile, resid_node_id, resourceid_val, language):
                    currentTile.data[resid_node_id] = {
                        language.code: {"value": str(resourceid_val), "direction": language.default_direction}
                    }
                    return True

                def get_formatted_id(id_string, language):
                    return id_string[language.code]["value"]

                try:
                    has_changes = False
                    simpleid = currentTile.data[simpleid_node]

                    languages = models.Language.objects.all()
                    default_language = languages.get(code=settings.LANGUAGE_CODE)

                    if simpleid is None or simpleid == 0:
                        has_changes = populate_simple_id(currentTile, simpleid_node)
                    else:
                        try:
                            x = int(currentTile.data[simpleid_node])
                            self.logger.debug("Resource " + str(resourceidval) + "has valid simpleid: " + str(x))
                        except:
                            has_changes = populate_simple_id(currentTile, simpleid_node)

                    if currentTile.data[resid_node] is not None:
                        try:
                            resid_string = get_formatted_id(currentTile.data[resid_node], default_language)
                            UUID(resid_string)
                        except:
                            has_changes = populate_resid_id(currentTile, resid_node, resourceidval, default_language)
                    else:
                        has_changes = populate_resid_id(currentTile, resid_node, resourceidval, default_language)

                    return has_changes

                except (
                    KeyboardInterrupt,
                    SystemExit,
                    ImportError,
                    RuntimeError,
                    SyntaxError,
                ) as c:
                    self.logger.critical(str(c))
                    return False

                except (
                    AttributeError,
                    EOFError,
                    LookupError,
                    NameError,
                    MemoryError,
                    ValueError,
                    IOError,
                ) as e:
                    self.logger.error(str(e))
                    return False

                except Warning as w:
                    self.logger.warning(str(w))
                    return False

                except Exception as ex:
                    self.logger.error(str(ex))
                    return False

            # if the current tile context is a refNG (i.e. it has trigger its own save then don't trigger another save)
            if str(tile.nodegroup_id) == refNodegroup:
                check_and_populate_uids(tile, simpleNode, resourceIdNode, resourceIdValue)
                return

            previously_saved_tiles = Tile.objects.filter(nodegroup_id=refNodegroup, resourceinstance_id=resourceIdValue)

            if len(previously_saved_tiles) > 0:
                for p in previously_saved_tiles:
                    try:
                        if check_and_populate_uids(p, simpleNode, resourceIdNode, resourceIdValue) == True:
                            p.save()
                        else:
                            self.logger.debug("Error.  Could not save Unique Identifiers tile.")
                    except (
                        KeyboardInterrupt,
                        SystemExit,
                        ImportError,
                        RuntimeError,
                        SyntaxError,
                    ) as c:
                        self.logger.critical(str(c))

                    except (
                        AttributeError,
                        EOFError,
                        LookupError,
                        NameError,
                        MemoryError,
                        ValueError,
                        IOError,
                    ) as e:
                        self.logger.error(str(e))

                    except Warning as w:
                        self.logger.warning(str(w))

                    except Exception as ex:
                        self.logger.error(str(ex))
            else:
                newRefTile = Tile().get_blank_tile_from_nodegroup_id(refNodegroup, resourceid=resourceIdValue, parenttile=None)
                if check_and_populate_uids(newRefTile, simpleNode, resourceIdNode, resourceIdValue) == True:
                    newRefTile.save()
                else:
                    self.logger.debug("Error.  Could not save Unique Identifiers tile.")

            return

        except (
            KeyboardInterrupt,
            SystemExit,
            ImportError,
            RuntimeError,
            SyntaxError,
        ) as c:
            self.logger.critical(str(c))

        except (
            AttributeError,
            EOFError,
            LookupError,
            NameError,
            MemoryError,
            ValueError,
            IOError,
        ) as e:
            self.logger.error(str(e))

        except Warning as w:
            self.logger.warning(str(w))

        except Exception as ex:
            self.logger.error(str(ex))

    def delete(self, tile, request):
        raise NotImplementedError

    def on_import(self, tile):
        raise NotImplementedError

    def after_function_save(self, tile, request):
        raise NotImplementedError
