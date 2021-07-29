from uuid import UUID
from arches.app.functions.base import BaseFunction
from arches.app.models import models
from arches.app.models.tile import Tile
#from arches.app.models.resource import Resource
from django.db.models.functions import Cast
from django.db.models import Max, IntegerField
from django.db import connection
from django.contrib.postgres.fields.jsonb import KeyTextTransform
import logging
import json
from datetime import datetime 


details = {
    'name': 'Generate Unique References',
    'type': 'node',
    'description': "Checks for Simple UID and Resource ID nodes populated and, if not populated, generates them",
    'defaultconfig': {"simpleuid_node":"","resourceid_node":"","uniqueresource_nodegroup":"","triggering_nodegroups":[],"nodegroup_nodes":[]},
    'classname': 'GenerateUniqueReferences',
    'component': 'views/components/functions/generate-unique-references-function',
    'functionid': '39d627ae-6973-4ddb-8b62-1f0230e1e3f9'
}

class GenerateUniqueReferences(BaseFunction):

    #def __init__(self,):
        #super(GenerateUniqueReferences, self).__init__()
        #self.logger = logging.getLogger(__name__)

    def get(self):
        raise NotImplementedError


    def save(self,tile,request):
        self.logger = logging.getLogger(__name__)
        try:

            def get_max_simple_id():
                '''
                    Gets the max id for all simple_id nodes across all graphs where the GenerateUniqueReferences function has been configured
                '''
                self.logger.debug(str(datetime.now()) +" DEBUG: get_max_simple_id CALLED ========================================")
                simpleid_node_info = get_simple_id_nodeinfo(details['functionid']) 
                
                # Don't like doing direct SQL but the django model is too slow. 
                # The input values are pulled from the database using the function configs.
                sql_node_str = ''
                sql_nodegroup_str = ''
                for nodeinfo in simpleid_node_info:
                    sid = nodeinfo["simpleid"]
                    ngid = nodeinfo["unique_ng_id"]

                    # UUID parse to give a sql injection protection
                    try:
                        x = UUID(sid)
                        x = UUID(ngid)
                    except Exception:
                        raise TypeError("Expected UUID values are not parsing correctly")

                    sql_node_str = sql_node_str + "t.tiledata ->> '{0}'::text,".format(sid)
                    sql_nodegroup_str = sql_nodegroup_str + "'{0}',".format(ngid)
                
                sql = '''
                SELECT hobs.simple_id::int
                    FROM (
                        SELECT 
                        COALESCE(
                            {0}
                        '0') AS simple_id
                        FROM tiles t
                        WHERE nodegroupid IN (
                        {1}
                        '11111111-1111-1111-1111-111111111111'
                        )
                    ) hobs
                    ORDER BY hobs.simple_id::int DESC
                    LIMIT 1
                '''.format(sql_node_str,sql_nodegroup_str)

                with connection.cursor() as cursor:
                    cursor.execute(sql)
                    ret = cursor.fetchone()

                try:
                    ret = int(ret[0])
                except:
                    ret = -1
                
                self.logger.debug(str(datetime.now()) +" DEBUG: get_max_simple_id COMPLETE ({0})========================================".format(ret))
                return ret


            def get_simple_id_nodeinfo(functionid=None):
                '''
                    This will fetch all the set simpleid nodes configured across the graphs
                '''
                if functionid is None:
                    raise  Exception('Functionid is required')

                nodeinfos = []

                funcs = models.FunctionXGraph.objects.filter(function_id=functionid)
                for fn in funcs:
                    try:
                        nodeinfos.append({"simpleid": fn.config['simpleuid_node'],"unique_ng_id": fn.config['uniqueresource_nodegroup']})
                    except:
                        pass
                
                return nodeinfos

            resourceIdValue = tile.resourceinstance_id
            simpleNode = self.config[u"simpleuid_node"]
            resourceIdNode = self.config[u"resourceid_node"]
            refNodegroup = self.config[u"uniqueresource_nodegroup"]

            #simpleID = get_max_simple_id() + 1

            def checkAndPopulateUIDS(currentTile,simpleid_node,resid_node,resourceidval):
                '''
                Checks the input tile to see if it contains the correct resource id and simpleid 
                values.  If not, populates these ids.
                '''

                def populate_simple_id(tile,simple_node_id):
                    nextsimpleval = get_max_simple_id() + 1
                    currentTile.data[simple_node_id] = str(nextsimpleval)


                try:
                    if currentTile.data[simpleid_node] is not None:
                        try:
                            x = int(currentTile.data[simpleid_node])
                            self.logger.debug("Resource " + str(resourceidval) + "has valid simpleid: " + str(x))
                            pass
                        except:
                            populate_simple_id(currentTile,simpleid_node)
                    else:
                        populate_simple_id(currentTile,simpleid_node)

                    if currentTile.data[resid_node] is not None:
                        try:
                            UUID(currentTile.data[resid_node])
                            pass
                        except:
                            currentTile.data[resid_node] = str(resourceidval)
                    else:
                        currentTile.data[resid_node] = str(resourceidval)

                    return True

                except (KeyboardInterrupt,SystemExit,ImportError,RuntimeError,SyntaxError) as c:
                    self.logger.critical(str(c))
                    return False

                except (AttributeError,EOFError,LookupError,NameError,MemoryError,ValueError,IOError) as e:
                    self.logger.error(str(e))
                    return False

                except Warning as w:
                    self.logger.warning(str(w))
                    return False

                except Exception as ex:
                    self.logger.error(str(ex))
                    return False

            #if the current tile context is a refNG (i.e. it has trigger its own save then don't trigger another save)
            if str(tile.nodegroup_id) == refNodegroup:
                checkAndPopulateUIDS(tile,simpleNode,resourceIdNode,resourceIdValue)
                return

            previously_saved_tiles = Tile.objects.filter(nodegroup_id=refNodegroup,resourceinstance_id=resourceIdValue)
            
            if len(previously_saved_tiles) > 0: 
                for p in previously_saved_tiles:
                    try:
                        if checkAndPopulateUIDS(p,simpleNode,resourceIdNode,resourceIdValue) == True:
                            p.save()
                        else:
                            self.logger.debug("Error.  Could not save Unique Identifiers tile.")
                    except (KeyboardInterrupt,SystemExit,ImportError,RuntimeError,SyntaxError) as c:
                        self.logger.critical(str(c))

                    except (AttributeError,EOFError,LookupError,NameError,MemoryError,ValueError,IOError) as e:
                        self.logger.error(str(e))

                    except Warning as w:
                        self.logger.warning(str(w))

                    except Exception as ex:
                        self.logger.error(str(ex))
            else:
                newRefTile = Tile().get_blank_tile_from_nodegroup_id(refNodegroup,resourceid=resourceIdValue,parenttile=None)
                if checkAndPopulateUIDS(newRefTile,simpleNode,resourceIdNode,resourceIdValue) == True:
                    newRefTile.save()
                else:
                    self.logger.debug("Error.  Could not save Unique Identifiers tile.")

            return  

        except (KeyboardInterrupt,SystemExit,ImportError,RuntimeError,SyntaxError) as c:
            self.logger.critical(str(c))

        except (AttributeError,EOFError,LookupError,NameError,MemoryError,ValueError,IOError) as e:
            self.logger.error(str(e))

        except Warning as w:
            self.logger.warning(str(w))

        except Exception as ex:
            self.logger.error(str(ex))

    def delete(self,tile,request):
        raise NotImplementedError

    def on_import(self,tile):
        raise NotImplementedError

    def after_function_save(self,tile,request):
        raise NotImplementedError