""" Views for managing messaging """

import logging
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import FormView
from django.urls import reverse_lazy
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.conf import settings

from viberbot import Api
from viberbot.api.bot_configuration import BotConfiguration
from viberbot.api.messages import TextMessage

from messaging.forms import ViberSentForm


# Get an instance of a logger
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

# Set Viber bot configuration
BOT_CONFIGURATION = BotConfiguration(
    name=settings.VIBER_BOT_NAME,
    avatar=settings.VIBER_AVATAR,
    auth_token=settings.VIBER_AUTH_TOKEN
)
VIBER = Api(BOT_CONFIGURATION)


@csrf_exempt
@require_POST
def webhook(request):
    """ Set Webhook for viber responces """
    logger.debug('received request. post data: %s', request.get_data())
    # handle the request here
    return HttpResponse(status=200)


class ViberSentView(LoginRequiredMixin, FormView):
    """ ViberSentView - view for sent viber messages """
    template_name = 'contact.html'
    form_class = ViberSentForm
    success_url = reverse_lazy('dashboard_main')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

    def form_valid(self, form):
        phone_number = form.cleaned_data['phone_number']
        text_message = form.cleaned_data['text_message']

        return super().form_valid(form)
