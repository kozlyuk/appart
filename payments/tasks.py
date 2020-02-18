from __future__ import absolute_import, unicode_literals

from celery.utils.log import get_task_logger
from django.conf import settings
from django.template.loader import render_to_string
from django.core.mail import send_mail
from envista.celery import app

from condominium.models import Apartment
from payments.models import Bill
from messaging.views import send_notice

logger = get_task_logger(__name__)

@app.task
def create_invoices:
    """ create invoices for all apartments """

    apprtments = Apartment.objects.all()
