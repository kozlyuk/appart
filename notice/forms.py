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
            "notice_type",
            "title",
            "text",
            "picture",
            "actual_from",
            "actual_to",
            "apartment",
            "created_by",
            "house",
        ]
        widgets = {
            "actual_to": forms.DateInput(attrs={'class': 'form-control'}),
            "actual_from": forms.DateInput(attrs={'class': 'form-control'}),
            "picture": forms.FileInput(attrs={'class': 'custom-file-input'}),
            "title": forms.TextInput(attrs={'class': 'form-control'}),
            "notice_type": forms.Select(attrs={'class': 'form-control'}),
            "text": SummernoteWidget(attrs={'class': 'form-control'}),
            "apartment": forms.Select(attrs={'class': 'form-control'}),
            "created_by": forms.HiddenInput(),
            "house": forms.Select(attrs={'class': 'form-control'})
        }


class QuestionForm(forms.ModelForm):
    class Meta:
        model = models.Question
        fields = [
            "actual_from",
            "actual_to",
            "question_text",
            "created_by",
        ]
