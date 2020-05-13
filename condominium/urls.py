"""appart.condominium URL Configuration"""

from django.urls import path, include
from rest_framework import routers

from condominium import api

router = routers.DefaultRouter()
router.register("apartment", api.ApartmentViewSet, basename='Apartment')
router.register("apartment_without_pagination", api.ApartmentWithoutPagination, basename='apartment_without_pagination')
router.register("house", api.HouseViewSet, basename='House')
router.register("house_without_pagination", api.HouseWithoutPagination, basename='house_without_pagination')
router.register("company", api.CompanyViewSet)


urlpatterns = (
    path("api/v1/", include(router.urls)),
)
