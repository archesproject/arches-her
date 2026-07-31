from arches_her.utils.file_template_modifier import FileTemplateModifier


class TestFileTemplateModifier(FileTemplateModifier):

    def __init__(self):
        pass

    @staticmethod
    def get_template_path():
        return {
            "135d243a-3b91-4cb4-9bd7-9b37e1a974d0": "Test1.docx",
            "730583db-eef1-4913-b0de-84e03a19f75e": "Test2.docx",
            "e80f8344-cea8-4d30-8c9a-c7e86b1e6d44": "Test3.docx",
        }
