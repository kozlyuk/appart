"""appart.condominium URL Configuration"""

from django.urls import path, include
from rest_framework import routers

from condominium import api
from condominium import views

router = routers.DefaultRouter()
router.register("apartment", api.ApartmentViewSet, basename='Apartment')
router.register("house", api.HouseViewSet)
router.register("company", api.CompanyViewSet)


urlpatterns = (

    path("api/v1/", include(router.urls)),

#    path("company/create/", views.CompanyCreateView.as_view(), name="condominium_Company_create"),
    path("company/update/<int:pk>/", views.CompanyUpdateView.as_view(), name="condominium_Company_update"),
)
