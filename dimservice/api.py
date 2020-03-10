from rest_framework import viewsets, mixins

from dimservice.models import Work, Order, Execution
from dimservice.serializers import WorkSerializer, OrderSerializer, ExecutionSerializer


class WorkViewSet(viewsets.ModelViewSet):
    """ViewSet for the Work class"""

    queryset = Work.objects.all()
    serializer_class = WorkSerializer


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for the Order class"""

    serializer_class = OrderSerializer

    def get_queryset(self):
        queryset = Order.objects.all()
        # optimizing SQL queries
        queryset = queryset.select_related('apartment__house')
        return queryset


class ExecutionViewSet(viewsets.ModelViewSet):
    """ViewSet for the Execution class"""

    queryset = Execution.objects.all()
    serializer_class = ExecutionSerializer
