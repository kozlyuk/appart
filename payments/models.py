"""  Models for Payments application  """

from datetime import datetime, date
from django.utils.translation import ugettext_lazy as _
from django.db import models
from appart.formatChecker import ContentTypeRestrictedFileField
from django.urls import reverse

from accounts.models import User
from condominium.models import Apartment


class Service(models.Model):
    """ Model contains Services """
    ByArea = 'BA'
    ByCounter = 'BC'
    UOM_CHOICES = (
        (ByArea, _('By square metre')),
        (ByCounter, _('By counter'))
    )
    #  Fields
    name = models.CharField(_('Name'), max_length=255, unique=True)
    description = models.CharField(_('Description'), max_length=255, blank=True)
    uom_type = models.CharField(_('Measurement type'), max_length=2, choices=UOM_CHOICES, default='BA')
    rate = models.DecimalField(_('Rate'), max_digits=8, decimal_places=2, default=0)
    uom = models.CharField(_('Default units of measurement'), max_length=8, default=_('sq.m.'))

    class Meta:
        verbose_name = _('Service')
        verbose_name_plural = _('Services')

    def __str__(self):
        return str(self.name)


class Meter(models.Model):
    """ Model contains Meters """
    EnergyMeter = 'EM'
    METER_CHOICES = (
        (EnergyMeter, _('Energy meter')),
    )
    #  Relationships
    apartment = models.ForeignKey(Apartment, verbose_name=_('Apartment'), on_delete=models.PROTECT)
    #  Fields
    meter_type = models.CharField(_('Meter type'), max_length=2, choices=METER_CHOICES, default='EM')
    serial_number = models.CharField(_('Serial number'), max_length=64, unique=True)

    class Meta:
        verbose_name = _('Meter')
        verbose_name_plural = _('Meters')

    def __str__(self):
        return str(self.serial_number)


class MeterRecord(models.Model):
    """ Model contains Meters """
    #  Relationships
    meter = models.ForeignKey(Meter, verbose_name=_('Meter'), on_delete=models.PROTECT)
    #  Fields
    value = models.DecimalField(_('Value'), max_digits=8, decimal_places=2, default=0)
    date = models.DateField(_('Date'), default=date.today)
    is_active = models.BooleanField(_('Is active'), default=True)


    class Meta:
        verbose_name = _('Meter')
        verbose_name_plural = _('Meters')

    def __str__(self):
        return str(self.serial_number)


class Bill(models.Model):
    """ Model contains bills for apartments """
    #  Relationships
    service = models.ForeignKey(Service, verbose_name=_('Service'), on_delete=models.PROTECT)
    apartment = models.ForeignKey(Apartment, verbose_name=_('Apartment'), on_delete=models.PROTECT)
    #  Fields
    number = models.CharField(_('Bill number'), max_length=32)
    amount = models.DecimalField(_('Bill amount'), max_digits=8, decimal_places=2)
    date = models.DateField(_('Bill date'), default=date.today)
    # Creator and Date information
    created_by = models.ForeignKey(User, verbose_name=_('Created by'),
        blank=True, null=True, on_delete=models.CASCADE)
    date_created = models.DateTimeField(_("Date created"), auto_now_add=True)
    date_updated = models.DateTimeField(_("Date updated"), auto_now=True, db_index=True)

    class Meta:
        unique_together = ['service', 'apartment', 'number']
        verbose_name = _('Bill')
        verbose_name_plural = _('Bills')

    def __str__(self):
        return self.number


class Payment(models.Model):
    """ Model contains Payments for Bills """
    BankPayment = 'BP'
    LiqPay = 'LP'
    PAYMENT_TYPE_CHOICES = (
        (BankPayment, _('Bank payment')),
        (LiqPay, _('LiqPay payment'))
    )
    PAYMENT_ACTION_CHOICES = (
        ('PY', 'pay'),
    )
    #  Relationships
    bill = models.ManyToManyField(Bill, through='BillPayment', verbose_name=_('Bill'))
    #  Fields
    payment_type = models.CharField(_('Payment type'), max_length=2, choices=PAYMENT_TYPE_CHOICES, default='BP')
    action = models.CharField(_('Payment action'), max_length=2, choices=PAYMENT_ACTION_CHOICES, default='PY')
    date = models.DateField(_('Payment date'), default=date.today)
    amount = models.DecimalField(_('Payment amount'), max_digits=8, decimal_places=2)
    description = models.CharField(_('Payment description'), max_length=255, blank=True)

    # Creator and Date information
    created_by = models.ForeignKey(User, verbose_name=_('Created by'),
        blank=True, null=True, on_delete=models.CASCADE)
    date_created = models.DateTimeField(_("Date created"), auto_now_add=True)
    date_updated = models.DateTimeField(_("Date updated"), auto_now=True, db_index=True)

    class Meta:
        verbose_name = _('Payment')
        verbose_name_plural = _('Payments')

    def __str__(self):
        return self.description


class BillPayment(models.Model):
    """ Model describes ManyToMany throw table between Bill and Payment """
    #  Relationships
    bill = models.ForeignKey(Bill, verbose_name=_('Bill'), on_delete=models.PROTECT)
    payment = models.ForeignKey(Payment, verbose_name=_('Payment'), on_delete=models.PROTECT)
    #  Fields
    amount = models.DecimalField(_('Payment amount'), max_digits=8, decimal_places=2)
