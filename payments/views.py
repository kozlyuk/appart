from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import Payment, Bill, Service
from .forms import PaymentForm, BillForm, ServiceForm


class PaymentListView(LoginRequiredMixin, ListView):
    model = Payment
    form_class = PaymentForm


class PaymentCreateView(LoginRequiredMixin, CreateView):
    model = Payment
    form_class = PaymentForm


class PaymentDetailView(LoginRequiredMixin, DetailView):
    model = Payment
    form_class = PaymentForm


class PaymentUpdateView(LoginRequiredMixin, UpdateView):
    model = Payment
    form_class = PaymentForm
    pk_url_kwarg = "pk"


class BillListView(LoginRequiredMixin, ListView):
    model = Bill
    form_class = BillForm


class BillCreateView(LoginRequiredMixin, CreateView):
    model = Bill
    form_class = BillForm


class BillDetailView(LoginRequiredMixin, DetailView):
    model = Bill
    form_class = BillForm


class BillUpdateView(LoginRequiredMixin, UpdateView):
    model = Bill
    form_class = BillForm
    pk_url_kwarg = "pk"


class ServiceListView(LoginRequiredMixin, ListView):
    model = Service
    form_class = ServiceForm


class ServiceCreateView(LoginRequiredMixin, CreateView):
    model = Service
    form_class = ServiceForm


class ServiceDetailView(LoginRequiredMixin, DetailView):
    model = Service
    form_class = ServiceForm


class ServiceUpdateView(LoginRequiredMixin, UpdateView):
    model = Service
    form_class = ServiceForm
    pk_url_kwarg = "pk"
