from django.contrib import admin
from django import forms

from . import models


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


class NoticeAdminForm(forms.ModelForm):

    class Meta:
        model = models.Notice
        fields = "__all__"


class NoticeAdmin(admin.ModelAdmin):
    form = NoticeAdminForm
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



admin.site.register(models.Choice, ChoiceAdmin)
admin.site.register(models.Notice, NoticeAdmin)
admin.site.register(models.Question, QuestionAdmin)
