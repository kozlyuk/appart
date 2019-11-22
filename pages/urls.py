"""appart.pages URL Configuration"""

from django.urls import path

from pages import views


urlpatterns = (
    path("Company/", views.CompanyView.as_view(), name='company_main'),
    path("House/<int:pk>/", views.HouseView.as_view(), name='house_main'),
)
