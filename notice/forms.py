from django import forms
from . import models

from django_summernote.widgets import SummernoteWidget, SummernoteInplaceWidget

class ChoiceForm(forms.ModelForm):
    class Meta:
        model = models.Choice
        fields = [
            "user", #TODO: make select2 widget
            "question",
            "votes", #TODO:add hidden input
            "choice_text",
        ]
        widgets = {
            "votes": forms.NumberInput(attrs={'class': 'form-control'}),
            "choice_text": SummernoteWidget(attrs={'class': 'form-control'}),
            "user": forms.SelectMultiple(attrs={'class': 'form-control'}),
            "question": forms.Select(attrs={'class': 'form-control'}),
        }


class NoticeForm(forms.ModelForm):
    class Meta:
        model = models.Notice
        fields = [
            "actual_to",
            "actual_from",
            "picture",
            "title",
            "notice_type",
            "text",
            "apartment",
            "created_by",
            "house",
        ]


class QuestionForm(forms.ModelForm):
    class Meta:
        model = models.Question
        fields = [
            "actual_from",
            "actual_to",
            "question_text",
            "created_by",
        ]
