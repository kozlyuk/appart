from rest_framework import viewsets, permissions

from . import serializers
from . import models


class ApartmentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Apartment class"""

    queryset = models.Apartment.objects.all()
    serializer_class = serializers.ApartmentSerializer
    permission_classes = [permissions.IsAuthenticated]


class HouseViewSet(viewsets.ModelViewSet):
    """ViewSet for the House class"""

    queryset = models.House.objects.all()
    serializer_class = serializers.HouseSerializer
    permission_classes = [permissions.IsAuthenticated]


class CompanyViewSet(viewsets.ModelViewSet):
    """ViewSet for the Company class"""

    queryset = models.Company.objects.all()
    serializer_class = serializers.CompanySerializer
    permission_classes = [permissions.IsAuthenticated]
