from django.views import generic
from .models import Payment, Bill, Service
from .forms import PaymentForm, BillForm, ServiceForm


class PaymentListView(generic.ListView):
    model = Payment
    form_class = PaymentForm


class PaymentCreateView(generic.CreateView):
    model = Payment
    form_class = PaymentForm


class PaymentDetailView(generic.DetailView):
    model = Payment
    form_class = PaymentForm


class PaymentUpdateView(generic.UpdateView):
    model = Payment
    form_class = PaymentForm
    pk_url_kwarg = "pk"


class BillListView(generic.ListView):
    model = Bill
    form_class = BillForm


class BillCreateView(generic.CreateView):
    model = Bill
    form_class = BillForm


class BillDetailView(generic.DetailView):
    model = Bill
    form_class = BillForm


class BillUpdateView(generic.UpdateView):
    model = Bill
    form_class = BillForm
    pk_url_kwarg = "pk"


class ServiceListView(generic.ListView):
    model = Service
    form_class = ServiceForm


class ServiceCreateView(generic.CreateView):
    model = Service
    form_class = ServiceForm


class ServiceDetailView(generic.DetailView):
    model = Service
    form_class = ServiceForm


class ServiceUpdateView(generic.UpdateView):
    model = Service
    form_class = ServiceForm
    pk_url_kwarg = "pk"
