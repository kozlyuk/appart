""" Models for notice app """
from django.db import models
from django.utils.translation import ugettext_lazy as _

from accounts.models import User
from condominium import models as model


class Notice(models.Model):
    """ Model contains Notices """

    Comany = 'CO'
    House = 'HO'
    Apartment = 'AP'
    TYPE_CHOICES = (
        (Comany, _('Company')),
        (House, _('House')),
        (Apartment, _('Apartment')),
    )

    #  Relationships
    house = models.ForeignKey(model.House, verbose_name=_('House'), on_delete=models.CASCADE, blank=True, null=True)
    apartment = models.ForeignKey(model.Apartment, verbose_name=_('Apartment'), on_delete=models.PROTECT, blank=True, null=True)

    #  Fields
    title = models.CharField(_('Notice name'), max_length=100)
    text = models.TextField(_('Notice'))
    notice_type = models.CharField(_('Notice type'), max_length=2, choices=TYPE_CHOICES, default=House)
    actual_from = models.DateField(_('Actual from'), blank=True, null=True)
    actual_to = models.DateField(_('Actual to'), blank=True, null=True)
    picture = models.ImageField(_('Picture'), upload_to='notice/', blank=True, null=True)

    # Creator and Date information
    created_by = models.ForeignKey(User, verbose_name=_('Created by'), on_delete=models.CASCADE)
    date_created = models.DateTimeField(_("Date created"), auto_now_add=True)
    date_updated = models.DateTimeField(_("Date updated"), auto_now=True, db_index=True)

    class Meta:
        verbose_name = 'Новина'
        verbose_name_plural = 'Новини'
        ordering = ['-created']

    def __str__(self):
        return self.title
