""" Models for describing management structure of dimservice """

from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.db import models

from condominium.models import Apartment


class Work(models.Model):
    name = models.CharField(_('Work name'), max_length=64)
    price_code = models.CharField(_('Price code'), max_length=10, unique=True)
    price = models.DecimalField(_('Price'), max_digits=8, decimal_places=2, default=0)
    description = models.TextField(_('Description'), blank=True)
    is_active = models.BooleanField(_('Active'), default=True)
    duration = models.DurationField(_('Duration'), blank=True, null=True)

    class Meta:
        verbose_name = _('Work')
        verbose_name_plural = _('Works')
        ordering = ['-price_code']

    def __str__(self):
        return f"{self.price_code} {self.name}"

class Order(models.Model):
    """ Abstract Model contains Orders """

    New = 'NE'
    Scheduled = 'SC'
    Cancelled = 'CA'
    Done = 'DO'
    Troubled = 'TR'
    EXEC_STATUS_CHOICES = (
        (New, _('New')),
        (Scheduled, _('Scheduled')),
        (Cancelled, _('Cancelled')),
        (Done, _('Done')),
        (Troubled, _('Troubled'))
    )
    NotPaid = 'NP'
    AdvancePaid = 'AP'
    PaidUp = 'PU'
    PAYMENT_STATUS_CHOICES = (
        (NotPaid, _('Not paid')),
        (AdvancePaid, _('Advance paid')),
        (PaidUp, _('Paid up'))
    )
    #  Relationships
    apartment = models.ForeignKey(Apartment, verbose_name=_('Apartment'), on_delete=models.PROTECT)
    work = models.ForeignKey(Work, verbose_name=_('Work'), on_delete=models.PROTECT)
    executors = models.ManyToManyField(settings.AUTH_USER_MODEL, through='Execution',
                                       related_name='orders', verbose_name=_('Goods'), blank=True)
    # Fields
    exec_status = models.CharField(_('Execution status'), max_length=2,
                                   choices=EXEC_STATUS_CHOICES, default=New)
    pay_status = models.CharField(_('Pay status'), max_length=2,
                                  choices=PAYMENT_STATUS_CHOICES, default=NotPaid)
    information = models.CharField(_('Information'), max_length=255, blank=True)
    warning = models.CharField(_('Warning'), max_length=255, blank=True)
    # Creator and Date information
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_('Created by'),
                                   blank=True, null=True, on_delete=models.CASCADE)
    date_created = models.DateTimeField(_("Date created"), auto_now_add=True)
    date_updated = models.DateTimeField(_("Date updated"), auto_now=True, db_index=True)
    date_closed = models.DateTimeField(_("Date closed"), blank=True, null=True)

    class Meta:
        verbose_name = _('Order')
        verbose_name_plural = _('Orders')
        ordering = ['-date_created']

    def __str__(self):
        return f"{self.work} {self.apartment}"


class Execution(models.Model):
    Scheduled = 'SC'
    Done = 'DO'
    Troubled = 'TR'
    EXEC_STATUS_CHOICES = (
        (Scheduled, _('Scheduled')),
        (Done, _('Done')),
        (Troubled, _('Troubled'))
    )
    # Relationships
    order = models.ForeignKey(Order, verbose_name=_('Order'), on_delete=models.CASCADE)
    executor = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_('Executor'),
                                 on_delete=models.PROTECT)
    # Fields
    scheduled_time = models.DateTimeField(_('Scheduled time'))
    exec_status = models.CharField(_('Execution status'), max_length=2,
                                   choices=EXEC_STATUS_CHOICES, default=Scheduled)

    class Meta:
        verbose_name = _('Executor')
        verbose_name_plural = _('Executors')

    def __str__(self):
        return f"{self.order} {self.executor}"
