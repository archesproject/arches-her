from arches.app.models.system_settings import settings
from arches.app.utils import import_class_from_string


class FileTemplateModifierFactory:
    def __init__(self):
        pass

    @staticmethod
    def get_file_template_modifier_class():
        if settings.setting_exists("CONSULTATION_FILE_TEMPLATE_MODIFIER"):
            return import_class_from_string(settings.CONSULTATION_FILE_TEMPLATE_MODIFIER)
        else:
            return None

class FileTemplateModifier:
    """
    Base class for adding custom information to the Consultation file template.
    """

    def __init__(self):
        pass

    @staticmethod
    def get_template_path():
        """
        Adds custom Consultation letter template configuration.

        :return: dict structured as uuid: consultation letter doc name
        :rtype dict
        """
        pass