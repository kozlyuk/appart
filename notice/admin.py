from django.contrib import admin
from django import forms

from . import models


class NewsAdminForm(forms.ModelForm):

    class Meta:
        model = models.News
        fields = "__all__"


class NewsAdmin(admin.ModelAdmin):
    form = NewsAdminForm
    list_display = [
        "actual_to",
        "actual_from",
        "picture",
        "title",
        "notice_type",
        "date_updated",
        "date_created",
        "text",
    ]


class NoticeAdminForm(forms.ModelForm):

    class Meta:
        model = models.Notice
        fields = "__all__"


class NoticeAdmin(admin.ModelAdmin):
    form = NoticeAdminForm
    list_display = [
        "actual_to",
        "actual_from",
        "apartment",
        "title",
        "date_updated",
        "date_created",
        "text",
    ]
class ChoiceAdminForm(forms.ModelForm):

    class Meta:
        model = models.Choice
        fields = "__all__"


class ChoiceAdmin(admin.ModelAdmin):
    form = ChoiceAdminForm
    list_display = [
        "votes",
        "choice_text",
    ]


class QuestionAdminForm(forms.ModelForm):

    class Meta:
        model = models.Question
        fields = "__all__"


class QuestionAdmin(admin.ModelAdmin):
    form = QuestionAdminForm
    list_display = [
        "actual_from",
        "actual_to",
        "question_text",
        "date_updated",
        "date_created",
    ]



admin.site.register(models.News, NewsAdmin)
admin.site.register(models.Notice, NoticeAdmin)
admin.site.register(models.Choice, ChoiceAdmin)
admin.site.register(models.Question, QuestionAdmin)
