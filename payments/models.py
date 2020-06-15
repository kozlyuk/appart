"""  Models for Payments application  """

from datetime import date
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.db.models import F, Sum

from condominium.models import Apartment, House


class Service(models.Model):
    """ Model contains Services """
    ByArea = 'BA'
    ByCounter = 'BC'
    UOM_CHOICES = (
        (ByArea, _('By square metre')),
        (ByCounter, _('By counter'))
    )
    #  Relationships
    houses = models.ManyToManyField(House, through='Rate',
                                    verbose_name=_('Houses'))
    #  Fields
    name = models.CharField(_('Name'), max_length=255, unique=True)
    description = models.CharField(_('Description'), max_length=255, blank=True)
    uom_type = models.CharField(_('Measurement type'), max_length=2, choices=UOM_CHOICES, default='BA')
    uom = models.CharField(_('Default units of measurement'), max_length=8, default=_('sq.m.'))

    class Meta:
        verbose_name = _('Service')
        verbose_name_plural = _('Services')

    def __str__(self):
        return str(self.name)

    def actual_rate(self):
        """ return actual service rate for current date """
        actual_rate = None
        actual_from_date = None
        for rate in self.rate_set.all():
            if rate.from_date <= date.today():
                if not actual_from_date or actual_from_date < rate.from_date:
                    actual_from_date = rate.from_date
                    actual_rate = rate.regular_price
        return actual_rate


class Rate(models.Model):
    """ Model contains Rates """
    #  Relationships
    service = models.ForeignKey(Service, verbose_name=_('Service'), on_delete=models.CASCADE)
    house = models.ForeignKey(House, verbose_name=_('House'), on_delete=models.CASCADE)
    #  Fields
    rate = models.DecimalField(_('Rate'), max_digits=8, decimal_places=2, default=0)
    from_date = models.DateField(_('Actual from'))

    class Meta:
        unique_together = ('service', 'house')
        verbose_name = _('Service')
        verbose_name_plural = _('Services')

    def __str__(self):
        return self.service + self.house


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
    is_active = models.BooleanField(_('Is active'), default=True)

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


    class Meta:
        verbose_name = _('Meter')
        verbose_name_plural = _('Meters')

    def __str__(self):
        return str(self.value)


class Bill(models.Model):
    """ Model contains bills for apartments """
    #  Relationships
    apartment = models.ForeignKey(Apartment, verbose_name=_('Apartment'), on_delete=models.PROTECT)
    service = models.ManyToManyField(Service, through='BillLine',
                                     verbose_name=_('Services'), blank=True)
    #  Fields
    number = models.CharField(_('Bill number'), unique=True, max_length=32)
    total_value = models.DecimalField(_('Total value'), max_digits=8, decimal_places=2, default=0)
    period = models.DateField(_('Bill date'), default=date.today)
    is_active = models.BooleanField(_('Is active'), default=True)
    #  Date information
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_('Created by'),
                                   blank=True, null=True, on_delete=models.CASCADE)
    date_created = models.DateTimeField(_("Date created"), auto_now_add=True)
    date_updated = models.DateTimeField(_("Date updated"), auto_now=True, db_index=True)

    class Meta:
        verbose_name = _('Bill')
        verbose_name_plural = _('Bills')

    def __str__(self):
        return self.number

    def calc_total_value(self):
        """ return calculated total_value from bill_lines """
        return self.billline_set.aggregate(total_value=Sum(F('previous_debt')+F('value'))) \
                                           ['total_value'] or 0


class BillLine(models.Model):
    """ Model contains BillLines for Bill model """
    bill = models.ForeignKey(Bill, verbose_name=_('Bill'), on_delete=models.CASCADE)
    service = models.ForeignKey(Service, verbose_name=_('Service'), on_delete=models.PROTECT)
    previous_debt = models.DecimalField(_('Debt value'), max_digits=8, decimal_places=2, default=0)
    value = models.DecimalField(_('Bill value'), max_digits=8, decimal_places=2, default=0)

    class Meta:
        verbose_name = _('BillLine')
        verbose_name_plural = _('BillLines')

    def __str__(self):
        return str(self.value)

    def total_debt(self):
        return str(self.previous_debt + self.value)


class Payment(models.Model):
    """ Model contains Payments for Bills """
    BankPayment = 'BP'
    LiqPay = 'LP'
    PAYMENT_TYPE_CHOICES = (
        (BankPayment, _('Bank payment')),
        (LiqPay, _('LiqPay payment'))
    )
    #  Relationships
    apartment = models.ForeignKey(Apartment, verbose_name=_('Apartment'),
                                  on_delete=models.PROTECT, blank=True, null=True)
    service = models.ManyToManyField(Service, through='PaymentService',
                                     verbose_name=_('Services'), blank=True)
    #  Fields
    payment_type = models.CharField(_('Payment type'), max_length=2, choices=PAYMENT_TYPE_CHOICES, default='BP')
    date = models.DateField(_('Payment date'), default=date.today)
    value = models.DecimalField(_('Payment value'), max_digits=8, decimal_places=2, default=0)
    description = models.CharField(_('Payment description'), max_length=255, blank=True)
    liqpay_responce = models.TextField(_('LiqPay responce'), blank=True, null=True)
    # Creator and Date information
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_('Created by'),
                                   blank=True, null=True, on_delete=models.CASCADE)
    date_created = models.DateTimeField(_("Date created"), auto_now_add=True)
    date_created = models.DateTimeField(_("Date updated"), auto_now=True, db_index=True)

    class Meta:
        verbose_name = _('Payment')
        verbose_name_plural = _('Payments')

    def __str__(self):
        return self.description


class PaymentService(models.Model):
    """ Model describes ManyToMany throw table between Payment and Services """
    #  Relationships
    payment = models.ForeignKey(Payment, verbose_name=_('Payment'), on_delete=models.PROTECT)
    service = models.ForeignKey(Service, verbose_name=_('Service'), on_delete=models.PROTECT)
    #  Fields
    value = models.DecimalField(_('Payment value'), max_digits=8, decimal_places=2, default=0)
