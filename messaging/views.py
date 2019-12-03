""" Views for managing messaging """

import logging
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import FormView
from django.urls import reverse_lazy
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from viberbot import Api
from viberbot.api.bot_configuration import BotConfiguration

from messaging.forms import ViberSentForm

bot_configuration = BotConfiguration(
    name='PythonSampleBot',
    avatar='https://bnbkeepers.com/assets/uploads/pic1-1490178768.jpg',
    auth_token='4aad892000a7d6f9-80aecfcf7028b55f-39b5e6f03ba8a278'
)
viber = Api(bot_configuration)


@csrf_exempt
@require_POST
def webhook(request):
    logging.debug('received request. post data: %s', request.get_data())
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
