from django.views import generic
from . import models
from . import forms


class ChoiceListView(generic.ListView):
    model = models.Choice
    form_class = forms.ChoiceForm


class ChoiceCreateView(generic.CreateView):
    model = models.Choice
    form_class = forms.ChoiceForm


class ChoiceDetailView(generic.DetailView):
    model = models.Choice
    form_class = forms.ChoiceForm


class ChoiceUpdateView(generic.UpdateView):
    model = models.Choice
    form_class = forms.ChoiceForm
    pk_url_kwarg = "pk"


class NoticeListView(generic.ListView):
    model = models.Notice
    form_class = forms.NoticeForm


class NoticeCreateView(generic.CreateView):
    model = models.Notice
    form_class = forms.NoticeForm


class NoticeDetailView(generic.DetailView):
    model = models.Notice
    form_class = forms.NoticeForm


class NoticeUpdateView(generic.UpdateView):
    model = models.Notice
    form_class = forms.NoticeForm
    pk_url_kwarg = "pk"


class QuestionListView(generic.ListView):
    model = models.Question
    form_class = forms.QuestionForm


class QuestionCreateView(generic.CreateView):
    model = models.Question
    form_class = forms.QuestionForm


class QuestionDetailView(generic.DetailView):
    model = models.Question
    form_class = forms.QuestionForm


class QuestionUpdateView(generic.UpdateView):
    model = models.Question
    form_class = forms.QuestionForm
    pk_url_kwarg = "pk"
