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
        ## - Add PrimaryRefNo to document.strings for quicksearch.
        prime_refno_list = ["e7d69602-9939-11ea-b514-f875a44e0e11", 	## "Activity"
                            "3bdc39fb-9a93-11ea-b4fe-f875a44e0e11", 	## "Archive Source"
                            "8dca12b3-edeb-11eb-a9ee-a87eeabdefba", 	## "Area"
                            "dd8032af-b494-11ea-8110-f875a44e0e11", 	## "Artefact"
                            "46fbf790-95ce-11ea-8331-f875a44e0e11", 	## "Bibliographic Source"
                            "b37552bd-9527-11ea-97f4-f875a44e0e11", 	## "Consultation"
                            "79026215-a0f4-11ea-81df-f875a44e0e11", 	## "Digital Object"
                            "44441e0c-99ac-11ea-97cc-f875a44e0e11", 	## "Heritage Story"
                            "7f5591c5-efed-11eb-8e44-a87eeabdefba", 	## "Historic Aircraft"
                            "4a1e7dc7-f000-11eb-ac44-a87eeabdefba", 	## "Historic Landscape Characterization"
                            "f1cbd897-f007-11eb-8b4b-a87eeabdefba", 	## "Maritime Vessel"
                            "325a2f33-efe4-11eb-b0bb-a87eeabdefba", 	## "Monument"
                            "c8e9e9c4-9456-11ea-a001-f875a44e0e11", 	## "Organization"
                            "1f7ada20-eff5-11eb-b62a-a87eeabdefba", 	## "Period"
                            "9718f941-950e-11ea-a048-f875a44e0e11", 	## "Person"
                            "9d8fc930-eff6-11eb-a991-a87eeabdefba", 	## "Place"
                            "d6734e3d-94fb-11ea-b836-f875a44e0e11"  	## "Application Area"
                            ]
        try:
            if str(nodeid) in prime_refno_list :
                val = {"string": str(nodevalue), "nodegroup_id": tile.nodegroup_id, "provisional": provisional}
                document["strings"].append(val)
        except Exception as e:
            print(e)

        ## Perform base class processing.
        super().append_to_document(document, nodevalue, nodeid, tile, provisional=False)     

    pass
