""" Models for notice app """
from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _
from messaging.tasks import send_email

from condominium.models import Company


class Feedback(models.Model):

    New = 'NEW'
    Resolved = 'RES'
    Ignored = 'IGN'
    STATUS_CHOICES = (
        (New, _('New feedback')),
        (Resolved, _('Resolved feedback')),
        (Ignored, _('Ignored feedback')),
    )
    #  Fields
    title = models.CharField(_('Feedback title'), max_length=100)
    text = models.TextField(_('Feedback text'))
    status = models.CharField(_('Feedback status'), max_length=3,
                              choices=STATUS_CHOICES, default=New)
    # Creator and Date information
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_('Created by'),
                                   blank=True, null=True, on_delete=models.CASCADE)
    date_created = models.DateTimeField(_("Date created"), auto_now_add=True)
    date_updated = models.DateTimeField(_("Date updated"), auto_now=True, db_index=True)

    class Meta:
        verbose_name = _('Feedback')
        verbose_name_plural = _('Feedbacks')
        ordering = ['-date_created']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        service_email = Company.objects.first().service_email
        if service_email:
            send_email(self.title, self.text, to=[service_email]) # TODO add delay
        super().save(*args, **kwargs) # Call the real save() method
