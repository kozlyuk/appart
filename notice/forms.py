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
        model = models.News
        fields = [
            "news_type",
            "news_status",
            "title",
            "text",
            "picture",
            "actual_from",
            "actual_to",
            "created_by",
            "house",
        ]
        widgets = {
            "actual_to": forms.DateInput(attrs={'class': 'form-control'}),
            "actual_from": forms.DateInput(attrs={'class': 'form-control'}),
            "picture": forms.FileInput(attrs={'class': 'custom-file-input'}),
            "title": forms.TextInput(attrs={'class': 'form-control'}),
            "news_type": forms.Select(attrs={'class': 'form-control'}),
            "news_status": forms.Select(attrs={'class': 'form-control'}),
            "text": SummernoteWidget(attrs={'class': 'form-control'}),
            "created_by": forms.HiddenInput(),
            "house": forms.Select(attrs={'class': 'form-control'})
        }


class QuestionForm(forms.ModelForm):
    class Meta:
        model = models.Question
        fields = [
            "question_text",
            "actual_from",
            "actual_to",
            "created_by",
        ]
        widgets = {
            "actual_from": forms.DateInput(attrs={'class': 'form-control'}),
            "actual_to": forms.DateInput(attrs={'class': 'form-control'}),
            "question_text": SummernoteWidget(attrs={'class': 'form-control'}),
            "created_by": forms.HiddenInput(),
        }
