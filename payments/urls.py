"""appart.payments URL Configuration"""

from django.urls import path, include
from rest_framework import routers

from payments import api
from payments import views


router = routers.DefaultRouter()
router.register("Payment", api.PaymentViewSet)
router.register("Bill", api.BillViewSet)
router.register("Service", api.ServiceViewSet)

urlpatterns = (
    path("api/v1/", include(router.urls)),
    path("Payment/", views.PaymentListView.as_view(), name="payments_Payment_list"),
    path("Payment/create/", views.PaymentCreateView.as_view(), name="payments_Payment_create"),
    path("Payment/detail/<int:pk>/", views.PaymentDetailView.as_view(), name="payments_Payment_detail"),
    path("Payment/update/<int:pk>/", views.PaymentUpdateView.as_view(), name="payments_Payment_update"),
    path("Bill/", views.BillListView.as_view(), name="payments_Bill_list"),
    path("Bill/create/", views.BillCreateView.as_view(), name="payments_Bill_create"),
    path("Bill/detail/<int:pk>/", views.BillDetailView.as_view(), name="payments_Bill_detail"),
    path("Bill/update/<int:pk>/", views.BillUpdateView.as_view(), name="payments_Bill_update"),
    path("Service/", views.ServiceListView.as_view(), name="payments_Service_list"),
    path("Service/create/", views.ServiceCreateView.as_view(), name="payments_Service_create"),
    path("Service/detail/<int:pk>/", views.ServiceDetailView.as_view(), name="payments_Service_detail"),
    path("Service/update/<int:pk>/", views.ServiceUpdateView.as_view(), name="payments_Service_update"),
)
