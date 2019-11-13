from rest_framework import viewsets, permissions

from . import serializers
from . import models


class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Payment class"""

    queryset = models.Payment.objects.all()
    serializer_class = serializers.PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]


class BillViewSet(viewsets.ModelViewSet):
    """ViewSet for the Bill class"""

    queryset = models.Bill.objects.all()
    serializer_class = serializers.BillSerializer
    permission_classes = [permissions.IsAuthenticated]


class BillPaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for the BillPayment class"""

    queryset = models.BillPayment.objects.all()
    serializer_class = serializers.BillPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]


class ServiceViewSet(viewsets.ModelViewSet):
    """ViewSet for the Service class"""

    queryset = models.Service.objects.all()
    serializer_class = serializers.ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]
