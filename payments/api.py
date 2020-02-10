from rest_framework import viewsets

from . import serializers
from . import models


class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Payment class"""

    queryset = models.Payment.objects.all()
    serializer_class = serializers.PaymentSerializer


class BillViewSet(viewsets.ModelViewSet):
    """ViewSet for the Bill class"""

    queryset = models.Bill.objects.all()
    serializer_class = serializers.BillSerializer


class ServiceViewSet(viewsets.ModelViewSet):
    """ViewSet for the Service class"""

    queryset = models.Service.objects.all()
    serializer_class = serializers.ServiceSerializer
