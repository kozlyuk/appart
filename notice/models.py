""" Models for notice app """
from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _

from condominium.models import Apartment, House


class Notice(models.Model):
    """ Model contains Notices """

    Warn = 'WA'
    Info = 'IN'
    STATUS_CHOICES = (
        (Warn, _('Warning')),
        (Info, _('Info')),
    )

    #  Relationships
    apartment = models.ForeignKey(Apartment, verbose_name=_(
        'Apartment'), on_delete=models.PROTECT, blank=True, null=True)

    #  Fields
    title = models.CharField(_('News title'), max_length=100)
    text = models.TextField(_('News text'))
    notice_status = models.CharField(
        _('News status'), max_length=2, choices=STATUS_CHOICES, default=Info)
    actual_from = models.DateField(_('Actual from'), blank=True, null=True)
    actual_to = models.DateField(_('Actual to'), blank=True, null=True)

    # Creator and Date information
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_('Created by'),
                                   blank=True, null=True, on_delete=models.CASCADE)
    date_created = models.DateTimeField(_("Date created"), auto_now_add=True)
    date_updated = models.DateTimeField(
        _("Date updated"), auto_now=True, db_index=True)

    class Meta:
        verbose_name = _('Notice')
        verbose_name_plural = _('Notices')
        ordering = ['-date_created']

    def __str__(self):
        return self.title


class News(models.Model):
    """ Model contains News """

    Warn = 'WA'
    Info = 'IN'
    STATUS_CHOICES = (
        (Warn, _('Warning')),
        (Info, _('Info')),
    )

    #  Relationships
    houses = models.ManyToManyField(House, verbose_name=_('Houses'), blank=True)

    #  Fields
    title = models.CharField(_('News title'), max_length=100)
    text = models.TextField(_('News text'))
    news_status = models.CharField(
        _('News status'), max_length=2, choices=STATUS_CHOICES, default=Info)
    actual_from = models.DateField(_('Actual from'), blank=True, null=True)
    actual_to = models.DateField(_('Actual to'), blank=True, null=True)
    picture = models.ImageField(
        _('Picture'), upload_to='notice/', blank=True, null=True)

    # Creator and Date information
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_('Created by'),
                                   blank=True, null=True, on_delete=models.CASCADE)
    date_created = models.DateTimeField(_("Date created"), auto_now_add=True)
    date_updated = models.DateTimeField(
        _("Date updated"), auto_now=True, db_index=True)

    class Meta:
        verbose_name = _('News')
        ordering = ['-news_status', '-date_created']

    def __str__(self):
        return self.title


class Question(models.Model):
    """ Model contains Poll questions """

    #  Fields
    question_text = models.TextField(_("Question text"))
    actual_from = models.DateField(_('Actual from'), blank=True, null=True)
    actual_to = models.DateField(_('Actual to'), blank=True, null=True)

    # Creator and Date information
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_('Created by'),
                                   blank=True, null=True, on_delete=models.CASCADE)
    date_created = models.DateTimeField(_("Date created"), auto_now_add=True)
    date_updated = models.DateTimeField(
        _("Date updated"), auto_now=True, db_index=True)

    class Meta:
        verbose_name = _('Poll')
        verbose_name_plural = _('Polls')
        ordering = ['-date_created']

    def __str__(self):
        return self.question_text


class Choice(models.Model):
    """ Model contains Poll choices """

    #  Relationships
    question = models.ForeignKey(Question, verbose_name=_(
        'Question'), on_delete=models.CASCADE)
    user = models.ManyToManyField(settings.AUTH_USER_MODEL, verbose_name=_('Users'))

    #  Fields
    choice_text = models.CharField(_("Choise text"), max_length=255)
    votes = models.IntegerField(_("Votes"), default=0)

    class Meta:
        verbose_name = _('Choice')
        verbose_name_plural = _('Choices')

    def __str__(self):
        return self.choice_text
