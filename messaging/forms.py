""" Forms for managing messaging """

from django import forms


class ViberSentForm(forms.ModelForm):

    phone_number = forms.CharField(max_length=10, min_length=10)
    text_message = forms.CharField(max_length=254)
