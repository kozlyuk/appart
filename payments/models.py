"""  Models for Payments application  """

from datetime import datetime, date
from django.utils.translation import ugettext_lazy as _
from django.db import models
from appart.formatChecker import ContentTypeRestrictedFileField
from django.urls import reverse

from accounts.models import User
from condominium.models import Apartment


def bills_directory_path(filename):
    """  file will be uploaded to MEDIA_ROOT/bills/Year/Month/<filename> """
    return 'bills/{0}/{1}/{2}'\
        .format(datetime.datetime.now().year, datetime.datetime.now().month, filename)


class Service(models.Model):
    #  Fields
    name = models.CharField(_('Name'), max_length=255, unique=True)
    description = models.CharField(_('Description'), max_length=255, blank=True)

    class Meta:
        verbose_name = _('Service')
        verbose_name_plural = _('Services')
        
    def __str__(self):
        return str(self.name)

    def get_absolute_url(self):
        return reverse("payments_Service_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("payments_Service_update", args=(self.pk,))


class Bill(models.Model):
    """ Model contains bills for apartments """
    #  Relationships
    service = models.ForeignKey(Service, verbose_name=_('Service'), on_delete=models.PROTECT)
    apartment = models.ForeignKey(Apartment, verbose_name=_('Apartment'), on_delete=models.PROTECT)
    #  Fields
    number = models.CharField(_('Bill number'), max_length=32)
    amount = models.DecimalField(_('Bill amount'), max_digits=8, decimal_places=2)
    date = models.DateField(_('Bill date'), default=date.today)
    pdf_copy = ContentTypeRestrictedFileField(_('Electronic copy'), upload_to=bills_directory_path,
                                              content_types=['application/pdf'],
                                              max_upload_size=10485760,
                                              blank=True, null=True)
    # Creator and Date information
    created_by = models.ForeignKey(User, verbose_name=_('Created by'), on_delete=models.CASCADE)
    date_created = models.DateTimeField(_("Date created"), auto_now_add=True)
    date_updated = models.DateTimeField(_("Date updated"), auto_now=True, db_index=True)

    class Meta:
        unique_together = ['service', 'apartment', 'number']
        verbose_name = _('Bill')
        verbose_name_plural = _('Bills')

    def __str__(self):
        return self.number

    def get_absolute_url(self):
        return reverse("payments_Bill_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("payments_Bill_update", args=(self.pk,))

    
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
    type = models.CharField(_('Payment type'), max_length=2, choices=PAYMENT_TYPE_CHOICES, default='BP')
    action = models.CharField(_('Payment action'), max_length=2, choices=PAYMENT_ACTION_CHOICES, default='PY')
    date = models.DateField(_('Payment date'), default=date.today)
    amount = models.DecimalField(_('Payment amount'), max_digits=8, decimal_places=2)
    description = models.CharField(_('Payment description'), max_length=255, blank=True)

    # Creator and Date information
    created_by = models.ForeignKey(User, verbose_name=_('Created by'), on_delete=models.CASCADE)
    date_created = models.DateTimeField(_("Date created"), auto_now_add=True)
    date_updated = models.DateTimeField(_("Date updated"), auto_now=True, db_index=True)

    class Meta:
        verbose_name = _('Payment')
        verbose_name_plural = _('Payments')

    def __str__(self):
        return self.description

    def get_absolute_url(self):
        return reverse("payments_Payment_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("payments_Payment_update", args=(self.pk,))


class BillPayment(models.Model):
    """ Model describes ManyToMany throw table between Bill and Payment """
    #  Relationships
    bill = models.ForeignKey(Bill, verbose_name=_('Bill'), on_delete=models.PROTECT)
    payment = models.ForeignKey(Payment, verbose_name=_('Payment'), on_delete=models.PROTECT)
    #  Fields
    amount = models.DecimalField(_('Payment amount'), max_digits=8, decimal_places=2)
