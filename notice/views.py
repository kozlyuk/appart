from django.views.generic import ListView, CreateView, DetailView, UpdateView, DeleteView
from notice.models import Choice, Notice, Question
from notice.forms import ChoiceForm

from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.translation import ugettext_lazy as _
from django.urls import reverse_lazy

class ChoiceListView(LoginRequiredMixin, ListView):
    model = Choice
    template_name = "choice/choice_list.j2"
    context_object_name = 'choices'

class ChoiceCreateView(CreateView):
    model = Choice
    template_name = "choice/choice_form.j2"
    form_class = ChoiceForm
    success_url = reverse_lazy('notice_Choice_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["header"] = _("Choice create")
        context["text_submit"] = _("Submit")
        return context


class ChoiceDetailView(DetailView):
    model = Choice
    template_name = "choice/choice_detail.j2"

class ChoiceUpdateView(UpdateView):
    model = Choice
    template_name = "choice/choice_form.j2"
    form_class = ChoiceForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["header"] = "Choice edit"
        context["text_submit"] = "Submit"
        return context


class ChoiceDeleteView(DeleteView):
    model = Choice
    template_name = "choice/choice_delete.j2"


class NoticeListView(ListView):
    model = Notice
    template_name = "notice/notice_list.j2"

class NoticeCreateView(CreateView):
    model = Notice
    template_name = "notice/notice_create.j2"

class NoticeDetailView(DetailView):
    model = Notice
    template_name = "notice/notice_detail.j2"

class NoticeUpdateView(UpdateView):
    model = Notice
    template_name = "notice/notice_update.j2"

class QuestionListView(ListView):
    model = Question
    template_name = "question/question_list.j2"

class QuestionCreateView(CreateView):
    model = Question
    template_name = "question/question_list.j2"

class QuestionDetailView(DetailView):
    model = Question
    template_name = "question/question_detail.j2"

class QuestionUpdateView(UpdateView):
    model = Question
    template_name = "question/question_update.j2"