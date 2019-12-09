from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, CreateView, DetailView, UpdateView
from notice.models import Choice, Notice, Question

class ChoiceListView(LoginRequiredMixin, ListView):
    model = Choice
    template_name = "choice/choice_list.j2"
    context_object_name = 'choices'

class ChoiceCreateView(CreateView):
    model = Choice
    template_name = "choice/choice_create.j2"

class ChoiceDetailView(DetailView):
    model = Choice
    template_name = "choice/choice_detail.j2"

class ChoiceUpdateView(UpdateView):
    model = Choice
    template_name = "choice/choice_update.j2"

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