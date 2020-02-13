""" Models for describing management structure of condominium """

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from django.urls import reverse

from django.db.models.signals import post_save
from django.dispatch import receiver
from condominium.services import bulk_create_apartments

class Company(models.Model):
    """ Model contains managerial companies """

    #  Fields
    name = models.CharField(_('Name'), max_length=45, blank=True)
    fullname = models.CharField(_('Full name'), max_length=255, blank=True)
    address = models.CharField(_('Legal address'), max_length=255, blank=True)
    requisites = models.CharField(_('Requisites'), max_length=255, blank=True)
    bank_requisites = models.CharField(_('Bank details'), max_length=255, blank=True)
    chief = models.CharField(_('Chief'), max_length=45, blank=True)
    phone = models.CharField(_('Phone'), max_length=13, blank=True)
    email = models.EmailField(_('Email address'), blank=True)
    official_site = models.URLField(_('Official site'), blank=True)
    logo = models.ImageField(_('Logo'), upload_to='company/logo/', default='company/no_image.jpg', blank=True)
    photo = models.ImageField(_('Photo'), upload_to='company/photo/', default='company/no_image.jpg', blank=True)
    description = models.TextField(_('Description'), blank=True)
    service_numbers = models.TextField(_('Service numbers'), blank=True)

    class Meta:
        verbose_name = _('Company')
        verbose_name_plural = _('Companies')

    def __str__(self):
        return self.name

    def get_update_url(self):
        return reverse("condominium_Company_update", args=(self.pk,))


class House(models.Model):
    """ Model contains Houses of managerial company """

    #  Fields
    name = models.CharField(_('Name'), max_length=255)
    address = models.CharField(_('Address'), max_length=255, blank=True)
    logo = models.ImageField(_('Photo'), upload_to='company/pictures/', default='company/no_image.jpg', blank=True)
    description = models.TextField(_('Description'), blank=True)
    apartments_count = models.PositiveSmallIntegerField(_('Apartments count'))

    class Meta:
        verbose_name = _('House')
        verbose_name_plural = _('Houses')
        ordering = ['name']

    def __str__(self):
        return self.name if self.name else self.address

    def get_absolute_url(self):
        return reverse("condominium_House_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("condominium_House_update", args=(self.pk,))

@receiver(post_save, sender=House, dispatch_uid="bulk_create_apartments")
def create_apartments(sender, instance, **kwargs):
    bulk_create_apartments(instance)


class Apartment(models.Model):
    """ Model contains Apartments """

    #  Relationships
    house = models.ForeignKey(House, verbose_name=_('House'), on_delete=models.PROTECT)
    resident = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_('Resident'),
                                 null=True, on_delete=models.SET_NULL)

    #  Fields
    number = models.PositiveSmallIntegerField(_('Apartment Number'))
    deal_number = models.CharField(_('Deal number'), max_length=30, blank=True)
    area = models.PositiveSmallIntegerField(_('Area'), blank=True, null=True)
    residents_count = models.PositiveSmallIntegerField(_('Residents count'), blank=True, null=True)
    description = models.TextField(_('Description'), blank=True)

    class Meta:
        unique_together = ('house', 'number')
        verbose_name = _('Apartment')
        verbose_name_plural = _('Apartments')
        ordering = ['house', 'number']

    def __str__(self):
        return str(self.number)

    def get_absolute_url(self):
        return reverse("condominium_Apartment_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("condominium_Apartment_update", args=(self.pk,))
