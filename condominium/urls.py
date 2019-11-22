"""appart.condominium URL Configuration"""

from django.urls import path, include
from rest_framework import routers

from condominium import api
from condominium import views


router = routers.DefaultRouter()
router.register("Apartment", api.ApartmentViewSet)
router.register("House", api.HouseViewSet)
router.register("Company", api.CompanyViewSet)

urlpatterns = (
    path("api/v1/", include(router.urls)),

    path("Apartment/list", views.ApartmentListView.as_view(), name="condominium_Apartment_list"),
    path("Apartment/create/", views.ApartmentCreateView.as_view(), name="condominium_Apartment_create"),
    path("Apartment/detail/<int:pk>/", views.ApartmentDetailView.as_view(),name="condominium_Apartment_detail"),
    path("Apartment/update/<int:pk>/", views.ApartmentUpdateView.as_view(), name="condominium_Apartment_update"),
    path("Apartment/delete/<int:pk>/", views.ApartmentDeleteView.as_view(), name="condominium_Apartment_delete"),

    path("House/list", views.HouseListView.as_view(), name="condominium_House_list"),
    path("House/create/", views.HouseCreateView.as_view(), name="condominium_House_create"),
    path("House/detail/<int:pk>/", views.HouseDetailView.as_view(), name="condominium_House_detail"),
    path("House/update/<int:pk>/", views.HouseUpdateView.as_view(), name="condominium_House_update"),
    path("House/delete/<int:pk>/", views.HouseDeleteView.as_view(), name="condominium_House_delete"),

    path("Company/create/", views.CompanyCreateView.as_view(), name="condominium_Company_create"),
    path("Company/update/<int:pk>/", views.CompanyUpdateView.as_view(), name="condominium_Company_update"),
)
