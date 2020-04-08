from __future__ import absolute_import, unicode_literals

from smtplib import SMTPException
from django.core.mail import EmailMessage
from celery.utils.log import get_task_logger
from appart.celery import app

logger = get_task_logger(__name__)


@app.task
def send_email(mail_subject, message, to):
    """ sends email to emails list """

    # filter active apartments
    try:
        email = EmailMessage(mail_subject, message, to=to)
        email.send()
        logger.info("Email %s sent to %s", mail_subject, to[0])
    except SMTPException as error:
        logger.info("Connection error while send email to %s", error)
