from django.contrib.staticfiles.storage import staticfiles_storage
from django.urls import reverse
from jinja2 import Environment
from django.utils import translation


def environment(**options):
    env = Environment(**options)
    env.install_gettext_translations(translation)
    env.globals.update(
        {
            'static': staticfiles_storage.url,
            'url': reverse,
        }
    )
    return env
