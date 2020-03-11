from rest_framework import viewsets, mixins

from dimservice.models import Work, Order, Execution
from dimservice.serializers import WorkSerializer, OrderSerializer, ExecutionSerializer


class WorkViewSet(viewsets.ModelViewSet):
    """ViewSet for the Work class"""

    queryset = Work.objects.all()
    serializer_class = WorkSerializer


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
                for status in exec_statuses:
                    qs_segment = queryset.filter(exec_status=status)
                    qs_union = qs_union | qs_segment
                queryset = qs_union
            if pay_statuses:
                qs_union = Order.objects.none()
                for status in pay_statuses:
                    qs_segment = queryset.filter(pay_status=status)
                    qs_union = qs_union | qs_segment
                queryset = qs_union
            if order:
                queryset = queryset.order_by(order)

            # Set up eager loading to avoid N+1 selects
            # queryset = self.get_serializer_class().setup_eager_loading(queryset)
            return queryset


class ExecutionViewSet(viewsets.ModelViewSet):
    """ViewSet for the Execution class"""

    queryset = Execution.objects.all()
    serializer_class = ExecutionSerializer
