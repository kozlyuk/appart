from rest_framework import viewsets

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
        # Simply add the extra select_related / prefetch_related here
        queryset = Order.objects.all()
        queryset = queryset.select_related('apartment', 'apartment__house')   # TODO not working!!!
        return queryset


class ExecutionViewSet(viewsets.ModelViewSet):
    """ViewSet for the Execution class"""

    queryset = Execution.objects.all()
    serializer_class = ExecutionSerializer
