""" Views for managing messaging """

from datetime import datetime
from django.conf.locale.uk import formats as uk_formats

from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import FormView
from django.urls import reverse_lazy
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from messaging.viber_init import viber, logger
from viberbot.api.viber_requests import ViberConversationStartedRequest
from viberbot.api.viber_requests import ViberFailedRequest
from viberbot.api.viber_requests import ViberMessageRequest
from viberbot.api.viber_requests import ViberSubscribedRequest
from viberbot.api.viber_requests import ViberUnsubscribedRequest
from viberbot.api.messages.text_message import TextMessage

date_format = uk_formats.DATE_INPUT_FORMATS[0]
time_format = uk_formats.TIME_INPUT_FORMATS[0]


@csrf_exempt
@require_POST
def webhook(request):
    """ Set Webhook for viber responces """
    logger.debug('received request. post data: %s', request.body)

    viber_request = viber.parse_request(request.body)

    if isinstance(viber_request, ViberMessageRequest):
        message = viber_request.message
        if "привіт" in message.text.lower():
            viber.send_messages(viber_request.sender.id, [
                TextMessage(text="Привіт!")
            ])
        if "годин" in message.text.lower():
            viber.send_messages(viber_request.sender.id, [
                TextMessage(text=datetime.now().strftime(time_format))
            ])
        elif "час" in message.text.lower():
            viber.send_messages(viber_request.sender.id, [
                TextMessage(text=datetime.now().strftime(time_format))
            ])
        elif "дата" in message.text.lower():
            viber.send_messages(viber_request.sender.id, [
                TextMessage(text=datetime.now().strftime(date_format))
            ])
        else:
            viber.send_messages(viber_request.sender.id, [
                TextMessage(text="Даруйте не вкурив")
            ])
    elif isinstance(viber_request, ViberSubscribedRequest):
        viber.send_messages(viber_request.user.id, [
            TextMessage(text="Привіт я бот! Вмію надсилати дату і час")
        ])
    elif isinstance(viber_request, ViberFailedRequest):
        logger.warn("client failed receiving message. failure: {0}".format(viber_request))

    return HttpResponse(status=200)
