""" Models for describing management structure of condominium """

from django.db import models
from django.db.models import Sum
from django.utils.translation import ugettext_lazy as _
from django.conf import settings


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
    service_email = models.EmailField(_('Service email address'), blank=True)
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


class House(models.Model):
    """ Model contains Houses of managerial company """

    #  Relationships
    company = models.ForeignKey(Company, verbose_name=_('Company'), on_delete=models.PROTECT)
    #  Fields
    name = models.CharField(_('Name'), max_length=255)
    address = models.CharField(_('Address'), max_length=255, blank=True)
    logo = models.ImageField(_('Photo'), upload_to='company/pictures/', default='company/no_image.jpg', blank=True)
    description = models.TextField(_('Description'), blank=True)

    class Meta:
        verbose_name = _('House')
        verbose_name_plural = _('Houses')
        ordering = ['name']

    def __str__(self):
        return self.name if self.name else self.address


class Apartment(models.Model):
    """ Model contains Apartments """

    #  Relationships
    house = models.ForeignKey(House, verbose_name=_('House'), on_delete=models.PROTECT)
    resident = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_('Resident'),
                                 blank=True, null=True, on_delete=models.SET_NULL)
    #  Fields
    number = models.PositiveSmallIntegerField(_('Apartment Number'))
    account_number = models.CharField(_('Account number'), max_length=30)
    area = models.DecimalField(_('Area'), max_digits=6, decimal_places=2, default=0)
    residents_count = models.PositiveSmallIntegerField(_('Residents count'), blank=True, null=True)
    exemption_count = models.PositiveSmallIntegerField(_('Exemptions count'), blank=True, null=True)
    description = models.TextField(_('Description'), blank=True)
    is_active = models.BooleanField(_('Is active'), default=False)
    debt = models.DecimalField(_('Total debt'), max_digits=8, decimal_places=2, default=0)

    class Meta:
        unique_together = ('house', 'number')
        verbose_name = _('Apartment')
        verbose_name_plural = _('Apartments')
        ordering = ['house', 'number']

    def __str__(self):
        return f"№{self.number} {self.house.name}"

    def bill_number_generate(self, period):
        """ return autogenerated bill number in format %Y%m%d-N """
        period_bills_count = self.bill_set.filter(period__contains=period) \
                                        .count() + 1
        return f'{period}-{self.account_number}-{period_bills_count}'

    def total_bills_sum(self):
        """ return bills sum for appartment """
        return self.bill_set.filter(is_active=True) \
                            .aggregate(bills_sum=Sum('total_value')) \
                            ['bills_sum'] or 0

    def total_payments_sum(self):
        """ return payments sum for appartment """
        return self.payment_set.aggregate(payments_sum=Sum('value')) \
                                ['payments_sum'] or 0

    def current_total_debt(self):
        """ return total debt of apartment """
        return self.total_bills_sum() - self.total_payments_sum()
