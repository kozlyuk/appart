""" Models for describing management structure of condominium """

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.conf import settings


class Company(models.Model):
    """ Model contains managerial companies """
    name = models.CharField(_('Name'), max_length=45)
    fullname = models.CharField(_('Full name'), max_length=255)
    address = models.CharField(_('Legal address'), max_length=255, blank=True)
    requisites = models.CharField(_('Requisites'), max_length=255, blank=True)
    bank_requisites = models.CharField(_('Bank details'), max_length=255, blank=True)
    chief = models.CharField(_('Chief'), max_length=45, blank=True)
    phone = models.CharField(_('Phone'), max_length=13, blank=True)
    logo = models.ImageField(_('Logo'), upload_to='company/logo/', default='company/no_image.jpg')
    description = models.TextField(_('Description'), blank=True)

    class Meta:     # pylint: disable=too-few-public-methods, missing-class-docstring
        verbose_name = _('Company')
        verbose_name_plural = _('Companies')

    def __str__(self):
        return self.name


class House(models.Model):
    """ Model contains Houses of managerial company """
    company = models.ForeignKey(Company, verbose_name=_('Company'), on_delete=models.PROTECT)
    name = models.CharField(_('Name'), max_length=255)
    address = models.CharField(_('Address'), max_length=255, blank=True)
    logo = models.ImageField(_('Photo'), upload_to='company/pictures/', default='company/no_image.jpg')
    description = models.TextField(_('Description'), blank=True)

    class Meta:     # pylint: disable=too-few-public-methods, missing-class-docstring
        unique_together = ('company', 'name')
        verbose_name = _('House')
        verbose_name_plural = _('Houses')
        ordering = ['-name']

    def __str__(self):
        return self.name


class Apartment(models.Model):
    """ Model contains Houses of managerial company """
    house = models.ForeignKey(House, verbose_name=_('House'), on_delete=models.PROTECT)
    resident = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_('Resident'),
                                 null=True, on_delete=models.SET_NULL)
    number = models.PositiveSmallIntegerField(_('House'))
    area = models.PositiveSmallIntegerField(_('Area'), blank=True)
    residents_count = models.PositiveSmallIntegerField(_('Residents count'), blank=True)
    description = models.TextField(_('Description'), blank=True)

    class Meta:     # pylint: disable=too-few-public-methods, missing-class-docstring
        unique_together = ('house', 'number')
        verbose_name = _('Apartment')
        verbose_name_plural = _('Apartments')
        ordering = ['-number']

    def __str__(self):
        return self.number
