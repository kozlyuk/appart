from django.db.models import Q
from django.utils.translation import ugettext_lazy as _
from rest_framework import viewsets, status, views
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from dimservice.models import Work, Order, Execution
from dimservice.serializers import WorkSerializer, OrderSerializer, ExecutionSerializer
from condominium.models import Apartment


class WorkViewSet(viewsets.ModelViewSet):
    """ViewSet for the Work class"""

    queryset = Work.objects.all()
    serializer_class = WorkSerializer


class WorkWithoutPagination(WorkViewSet):
    """ViewSet for the Work class
    Without pagination
    """
    pagination_class = None


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for the Order class
    Filter queryset by search string ('filter' get parameter)
    Filter queryset by apartment, work, exec_status and pay_status fields
    ('apartment', 'work', 'exec_status', 'pay_status' get parameters)
    Order queryset by any given field ('order' get parameter)
    """

    serializer_class = OrderSerializer

    def get_queryset(self):
        queryset = Order.objects.all()
        search_string = self.request.GET.get('filter', '').split()
        apartment = self.request.GET.get('apartment')
        work = self.request.GET.get('work')
        exec_statuses = self.request.GET.getlist('exec_status')
        pay_statuses = self.request.GET.getlist('pay_status')
        order = self.request.GET.get('order')
        for word in search_string:
            queryset = queryset.filter(Q(apartment__number__contains=word) |
                                       Q(apartment__account_number__contains=word) |
                                       Q(work__name__icontains=word) |
                                       Q(work__price_code__contains=word))

        if apartment:
            queryset = queryset.filter(apartment=apartment)
        if work:
            queryset = queryset.filter(work=work)
        if exec_statuses:
            qs_union = Order.objects.none()
            for exec_status in exec_statuses:
                qs_segment = queryset.filter(exec_status=exec_status)
                qs_union = qs_union | qs_segment
            queryset = qs_union
        if pay_statuses:
            qs_union = Order.objects.none()
            for pay_status in pay_statuses:
                qs_segment = queryset.filter(pay_status=pay_status)
                qs_union = qs_union | qs_segment
            queryset = qs_union
        if order:
            queryset = queryset.order_by(order)

        # Set up eager loading to avoid N+1 selects
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        return queryset


class OrderListView(ListAPIView):
    """
    View all orders of apartment.

    * Requires parameters: apartment.
    * Only apartment owner has permission to orders.
    * Return error HTTP_400_BAD_REQUEST if apartment does not exist
    """

    serializer_class = OrderSerializer

    def get_queryset(self):
        apartment_pk = self.kwargs['apartment']
        # get the apartment
        try:
            apartment = Apartment.objects.get(pk=apartment_pk)
        # return error HTTP_400_BAD_REQUEST if apartment does not exist
        except Apartment.DoesNotExist:
            return Response(_('Apartment with such id does not exist'),
                            status=status.HTTP_400_BAD_REQUEST)

        # get orders for apartment
        queryset = apartment.order_set.all()

        # Set up eager loading to avoid N+1 selects
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        return queryset


class ExecutionViewSet(viewsets.ModelViewSet):
    """ViewSet for the Execution class"""

    queryset = Execution.objects.all()
    serializer_class = ExecutionSerializer


class ExecStatusChoices(views.APIView):
    """
    Send JSON list of EXEC_STATUS_CHOICES
    """
    def get(self, request):
        # Sending JSON list EXEC_STATUS_CHOICES
        json_data = [Order.EXEC_STATUS_CHOICES]
        return Response(json_data, status=status.HTTP_200_OK)


class PaymentStatusChoices(views.APIView):
    """
    Send JSON list of PAYMENT_STATUS_CHOICES
    """
    def get(self, request):
        # Sending JSON list PAYMENT_STATUS_CHOICES
        json_data = [Order.PAYMENT_STATUS_CHOICES]
        return Response(json_data, status=status.HTTP_200_OK)
