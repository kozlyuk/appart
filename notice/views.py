from django.views.generic import ListView, CreateView, DetailView, UpdateView, DeleteView
from notice.models import Choice, Notice, Question
from notice.forms import ChoiceForm, NoticeForm

from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.translation import ugettext_lazy as _
from django.urls import reverse_lazy


class NoticeListView(ListView):
    model = Notice
    template_name = "notice/notice_list.j2"
    context_object_name = 'notices'


class NoticeCreateView(CreateView):
    model = Notice
    template_name = "notice/notice_form.j2"
    form_class = NoticeForm
    success_url = reverse_lazy('notice_Notice_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["header"] = _("Create news")
        context["text_submit"] = _("Submit")
        return context

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        return super().form_valid(form)


class NoticeDetailView(DetailView):
    model = Notice
    template_name = "notice/notice_detail.j2"


class NoticeUpdateView(UpdateView):
    model = Notice
    template_name = "notice/notice_form.j2"
    form_class = NoticeForm
    success_url = reverse_lazy('notice_Notice_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["header"] = _("Update news: ") + str(self.object.title)
        context["text_submit"] = _("Submit")
        return context

class NoticeDeleteView(DeleteView):
    model = Notice
    template_name = "notice/notice_delete.j2"
    success_url = reverse_lazy("notice_Notice_list")

class QuestionListView(ListView):
    model = Question
    template_name = "question/question_list.j2"


class QuestionCreateView(CreateView):
    model = Question
    template_name = "question/question_list.j2"

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        return super().form_valid(form)


class QuestionDetailView(DetailView):
    model = Question
    template_name = "question/question_detail.j2"


class QuestionUpdateView(UpdateView):
    model = Question
    template_name = "question/question_update.j2"


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
    success_url = reverse_lazy('notice_Choice_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["header"] = "Choice edit"
        context["text_submit"] = "Submit"
        return context


class ChoiceDeleteView(DeleteView):
    model = Choice
    template_name = "choice/choice_delete.j2"
    success_url = reverse_lazy('notice_Choice_list')
