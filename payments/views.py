from django.views import generic
from . import models
from . import forms


class PaymentListView(generic.ListView):
    model = models.Payment
    form_class = forms.PaymentForm


class PaymentCreateView(generic.CreateView):
    model = models.Payment
    form_class = forms.PaymentForm


class PaymentDetailView(generic.DetailView):
    model = models.Payment
    form_class = forms.PaymentForm


class PaymentUpdateView(generic.UpdateView):
    model = models.Payment
    form_class = forms.PaymentForm
    pk_url_kwarg = "pk"


class BillListView(generic.ListView):
    model = models.Bill
    form_class = forms.BillForm


class BillCreateView(generic.CreateView):
    model = models.Bill
    form_class = forms.BillForm


class BillDetailView(generic.DetailView):
    model = models.Bill
    form_class = forms.BillForm


class BillUpdateView(generic.UpdateView):
    model = models.Bill
    form_class = forms.BillForm
    pk_url_kwarg = "pk"


class ServiceListView(generic.ListView):
    model = models.Service
    form_class = forms.ServiceForm


class ServiceCreateView(generic.CreateView):
    model = models.Service
    form_class = forms.ServiceForm


class ServiceDetailView(generic.DetailView):
    model = models.Service
    form_class = forms.ServiceForm


class ServiceUpdateView(generic.UpdateView):
    model = models.Service
    form_class = forms.ServiceForm
    pk_url_kwarg = "pk"
