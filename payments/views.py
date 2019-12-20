from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.views.generic.dates imort YearArchiveView
from .models import Payment, Bill, Service
from .forms import PaymentForm, BillForm, ServiceForm


class PaymentListView(LoginRequiredMixin, ListView):
    model = Payment
    template_name = "payment/payment_list.j2"
    context_object_name = 'payments'


class PaymentCreateView(LoginRequiredMixin, CreateView):
    model = Payment
    form_class = PaymentForm

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        return super().form_valid(form)


class PaymentDetailView(LoginRequiredMixin, DetailView):
    model = Payment
    form_class = PaymentForm


class PaymentUpdateView(LoginRequiredMixin, UpdateView):
    model = Payment
    form_class = PaymentForm
    pk_url_kwarg = "pk"


class BillListView(LoginRequiredMixin, YearArchiveView):
    queryset = Bill.objects.all()
    date_field = "date"
    make_object_list = True
    allow_future = True


class BillCreateView(LoginRequiredMixin, CreateView):
    model = Bill
    form_class = BillForm

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        return super().form_valid(form)


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
