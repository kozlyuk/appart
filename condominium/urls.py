"""appart.condominium URL Configuration"""

from django.urls import path, include
from rest_framework import routers

from condominium import api

router = routers.DefaultRouter()
router.register("apartment", api.ApartmentViewSet, basename='Apartment')
router.register("house", api.HouseViewSet)
router.register("company", api.CompanyViewSet)


urlpatterns = (
    path("api/v1/", include(router.urls)),
)
