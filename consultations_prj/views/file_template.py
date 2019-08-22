'''
ARCHES - a program developed to inventory and manage immovable cultural heritage.
Copyright (C) 2013 J. Paul Getty Trust and World Monuments Fund

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
'''

from datetime import datetime
from django.http import HttpRequest, HttpResponseNotFound
from django.utils.translation import ugettext as _
from django.views.generic import View
from docx import Document
from arches.app.utils.betterJSONSerializer import JSONSerializer, JSONDeserializer
from arches.app.utils.response import JSONResponse
from arches.app.models import models
from arches.app.models.resource import Resource
from arches.app.models.system_settings import settings
from arches.app.datatypes.datatypes import DataTypeFactory
import os


class FileTemplateView(View):

    doc = None
    resource = None


    def get(self, request): 
        # data = JSONDeserializer().deserialize(request.body)
        datatype_factory = DataTypeFactory()
        template_id = request.GET.get('template_id')
        resourceinstance_id = request.GET.get('resourceinstance_id', None)
        self.resource = Resource.objects.get(resourceinstanceid=resourceinstance_id)
        self.resource.load_tiles()
        # consultation_instance_id = None
        # consultation = None
        # for tile in self.resource.tiles: # self.resource is of communication model
        #     if 'a5901911-6d1e-11e9-8674-dca90488358a' in tile.data.keys(): # related-consultation nodegroup
        #         consultation_instance_id = tile.data['a5901911-6d1e-11e9-8674-dca90488358a'][0]

        template_name = self.get_template_path(template_id)
        template_path = os.path.join(settings.APP_ROOT, 'docx', template_name)
        self.doc = Document(template_path)
        new_file_name = None
        new_file_path = None

        # if resourceinstance_id is not None:
        #     consultation = Resource.objects.get(resourceinstanceid=resourceinstance_id)
        #     consultation.load_tiles()

        if template_name == 'GLAAS Planning Letter A - No Progression - template.docx':
            self.edit_letter_A(self.resource, datatype_factory)
        elif template_name == 'GLAAS Planning Letter B2 - Predetermination - template.docx':
            self.edit_letter_B2(self.resource, datatype_factory)

        date = datetime.today()
        date = date.strftime("%Y")+'-'+date.strftime("%m")+'-'+date.strftime("%d")
        new_file_name = date+'_'+template_name
        new_file_path = os.path.join(settings.APP_ROOT, 'uploadedfiles/docx', new_file_name)
        self.doc.save(new_file_path)
        stat = os.stat(new_file_path)
        # with open(new_file_path, "rb") as docx_file:
        #     thing = result.value

        # create django post request
        # create new file then send it to make a new file

        if resourceinstance_id is not None:
            return JSONResponse({'resource': self.resource, 'size': stat.st_size, 'mod': stat.st_mtime, 'template': new_file_path, 'download': 'http://localhost:8000/files/uploadedfiles/docx/'+new_file_name })

        return HttpResponseNotFound()


    def get_template_path(self, template_id):
        template_dict = { # keys are conceptids from "Letters" concept list; values are known file names
            "a26c77ff-1d04-4b76-a45f-417f7ed24333":'', # Addit Cond Text
            "8c12a812-8000-4ec9-913d-c6fd516117f2":'', # Arch Rec Text
            "01dec356-e72e-40e6-b1b1-b847b9799d2f":'GLAAS Planning Letter A - No Progression - template.docx', # Letter A
            "320abc26-db82-44a6-be11-8d44aaa23365":'', # Letter A2
            "fd15c6c7-e94d-4914-8d51-a98bda6f4a7b":'', # Letter B1
            "8cc91474-11ce-47d9-b886-f0e3fc49d277":'GLAAS Planning Letter B2 - Predetermination - template.docx', # Letter B2
            "08bb630d-a27b-45bc-a13f-567b428018c5":'GLAAS Planning Letter C - Condition two stage - template.docx' # Letter C
            }
        for key, value in template_dict.items():
            if key == template_id:
                return value

        return None


    """
    def edit_letter_X(self, consultation, datatype_factory):
        # dict of string/node pairs specific to docx template
        template_dict = {
           string_key1: 'node_id1',
           string_key2: 'node_id2'
        }
        self.replace_in_letter(consultation.tiles, template_dict, datatype_factory)
    """


    def edit_letter_A(self, consultation, datatype_factory):
        template_dict = {
            'Case Officer':'36a6c511-6c49-11e9-b450-dca90488358a',
            'Completion Date': '0316def5-5675-11e9-8804-dca90488358a',
            'Proposal': 'f34ebbd4-53f3-11e9-b649-dca90488358a',
            'Log Date': '49f806e6-5674-11e9-a5b2-dca90488358a',
            'Action': '8b171540-6d1e-11e9-ac56-dca90488358a'
        }
        self.replace_in_letter(consultation.tiles, template_dict, datatype_factory)

    
    def edit_letter_B2(self, consultation, datatype_factory):
        template_dict = {
            'Case Officer':'36a6c511-6c49-11e9-b450-dca90488358a',
            'Completion Date': '0316def5-5675-11e9-8804-dca90488358a',
            'Proposal': 'f34ebbd4-53f3-11e9-b649-dca90488358a',
            'Log Date': '49f806e6-5674-11e9-a5b2-dca90488358a',
            'Action': '8b171540-6d1e-11e9-ac56-dca90488358a',
            'Site Name': '???'
        }
        self.replace_in_letter(consultation.tiles, template_dict, datatype_factory)


    def replace_in_letter(self, tiles, template_dict, datatype_factory):
        for tile in tiles:
            for key, value in template_dict.items():
                if value in tile.data:
                    my_node = models.Node.objects.get(nodeid=value)
                    datatype = datatype_factory.get_instance(my_node.datatype)
                    lookup_val = datatype.get_display_value(tile, my_node)
                    self.replace_string(self.doc, key, lookup_val)

    
    def replace_string(self, document, key, v):
        # Note that the intent here is to preserve how things are styled in the docx
        # easiest way is to iterate through p.runs, not as fast as iterating through parent.paragraphs
        # advantage of the former is that replacing run.text preserves styling, replacing p.text does not
        
        if v is not None and key is not None:
            k = "{{"+key+"}}"
            doc = document
            # some of these are probably unnecessary
            # foot_style = styles['Footer']
            # head_style = styles['Header']
            # t_style = None
            # p_style = None
            run_style = None

            if len(doc.paragraphs) > 0:
                replace_in_runs(doc.paragraphs, k, v)

            if len(doc.tables) > 0:
                iterate_tables(doc.tables, k, v)
            
            if len(doc.sections) > 0:
                for section in doc.sections:
                    replace_in_runs(section.footer.paragraphs, k, v)
                    iterate_tables(section.footer.tables, k, v)
                    replace_in_runs(section.header.paragraphs, k, v)
                    iterate_tables(section.header.tables, k, v)

        def replace_in_runs(p_list, k, v):
            for paragraph in p_list:
                for run in paragraph.runs:
                    if k in run.text:
                        run_style = run.style
                        run.text = run.text.replace(k, v)

        def iterate_tables(t_list, k, v):
            for table in t_list:
                for row in table.rows:
                    for cell in row.cells:
                        replace_in_runs(cell.paragraphs, k, v)

    
    def insert_image(self, document, k, v, image_path=None, config=None):
        # going to need to write custom logic depending on how images should be placed/styled

        return True


    def insert_custom(self, document, k, v, config=None):
        # perhaps replaces {{custom_object}} with pre-determined text structure with custom style/format

        return True

