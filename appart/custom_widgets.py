from django.forms import TextInput, Select, PasswordInput, Textarea
from appart.settings import BASE_DIR

class CustomInput(TextInput):
    input_type  =  'text' 
    template_name = 'widgets/customFormFields/customFormField.html'

    def __init__(self, attrs=None, config=None):
        self.attrs = {} if attrs is None else attrs.copy()
        self.config = {} if config is None else config.copy()

    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        return context

class CustomFileInput(CustomInput):
    input_type  =  'file' 
    template_name = "widgets/customFormFields/customFileInput.html"

class CustomSelect(Select):
    input_type  =  'select' 
    template_name = "widgets/customFormFields/customSelect.html"

class CustomSelect(Select):
    input_type  =  'select' 
    template_name = "widgets/customFormFields/customSelect.html"

class CustomPasswordInput(PasswordInput):
    input_type  =  'password' 
    template_name = "widgets/customFormFields/customFormField.html"

class CustomTextarea(Textarea):
    template_name = "widgets/customFormFields/customTextarea.html"

class CustomNumberInput(CustomInput):
    input_type = "number"