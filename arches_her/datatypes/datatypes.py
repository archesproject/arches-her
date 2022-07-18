## Inherit from core datatypes.
from arches.app.datatypes import datatypes
from arches.app.datatypes.base import BaseDataType

class DataTypeFactory(datatypes.DataTypeFactory):
    pass

class StringDataType(datatypes.StringDataType):
    pass

class BooleanDataType(datatypes.BooleanDataType):
    pass

class DateDataType(datatypes.DateDataType):
    pass

class EDTFDataType(datatypes.EDTFDataType):
    pass

class GeojsonFeatureCollectionDataType(datatypes.GeojsonFeatureCollectionDataType):
    pass

class FileListDataType(datatypes.FileListDataType):
    pass

class BaseDomainDataType(datatypes.BaseDomainDataType):
    pass

class DomainDataType(datatypes.DomainDataType):
    pass

class DomainListDataType(datatypes.DomainListDataType):
    pass

class ResourceInstanceDataType(datatypes.ResourceInstanceDataType):
    pass

class ResourceInstanceListDataType(datatypes.ResourceInstanceListDataType):
    pass

class NodeValueDataType(datatypes.NodeValueDataType):
    pass

class AnnotationDataType(datatypes.AnnotationDataType):
    pass

class NumberDataType(datatypes.NumberDataType):
   
    def append_to_document(self, document, nodevalue, nodeid, tile, provisional=False):
        ## #46273 Primary Referance Number Override.
        ## - Add Monument.PrimaryRefNo["325a2f33-efe4-11eb-b0bb-a87eeabdefba"] to document.strings for quicksearch.
        try:
            if str(nodeid) == "325a2f33-efe4-11eb-b0bb-a87eeabdefba" :
                val = {"string": str(nodevalue), "nodegroup_id": tile.nodegroup_id, "provisional": provisional}
                document["strings"].append(val)
        except Exception as e:
            print(e)

        ## Perform base class processing.
        super().append_to_document(document, nodevalue, nodeid, tile, provisional=False)     

    pass
