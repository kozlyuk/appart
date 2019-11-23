"""appart.condominium URL Configuration"""

from django.urls import path, include

from condominium import views


urlpatterns = (
    path("apartment/list", views.ApartmentListView.as_view(), name="condominium_Apartment_list"),
    path("apartment/create/", views.ApartmentCreateView.as_view(), name="condominium_Apartment_create"),
    path("apartment/detail/<int:pk>/", views.ApartmentDetailView.as_view(),name="condominium_Apartment_detail"),
    path("apartment/update/<int:pk>/", views.ApartmentUpdateView.as_view(), name="condominium_Apartment_update"),
    path("apartment/delete/<int:pk>/", views.ApartmentDeleteView.as_view(), name="condominium_Apartment_delete"),
    path('resident/create/', views.ResidentModalView.as_view(), name='create_book'),

    path("house/list", views.HouseListView.as_view(), name="condominium_House_list"),
    path("house/create/", views.HouseCreateView.as_view(), name="condominium_House_create"),
    path("house/detail/<int:pk>/", views.HouseDetailView.as_view(), name="condominium_House_detail"),
    path("house/update/<int:pk>/", views.HouseUpdateView.as_view(), name="condominium_House_update"),
    path("house/delete/<int:pk>/", views.HouseDeleteView.as_view(), name="condominium_House_delete"),

#    path("company/create/", views.CompanyCreateView.as_view(), name="condominium_Company_create"),
    path("company/update/<int:pk>/", views.CompanyUpdateView.as_view(), name="condominium_Company_update"),
)
