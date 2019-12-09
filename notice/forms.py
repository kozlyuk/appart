from django import forms
from . import models


class ChoiceForm(forms.ModelForm):
    class Meta:
        model = models.Choice
        fields = [
            "votes",
            "choice_text",
            "user",
            "question",
        ]


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
