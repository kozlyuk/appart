from django.urls import path, include
from rest_framework import routers

from . import api
from . import views


router = routers.DefaultRouter()
router.register("Payment", api.PaymentViewSet)
router.register("Bill", api.BillViewSet)
router.register("Service", api.ServiceViewSet)

urlpatterns = (
    path("api/v1/", include(router.urls)),
    path("payments/Payment/", views.PaymentListView.as_view(), name="payments_Payment_list"),
    path("payments/Payment/create/", views.PaymentCreateView.as_view(), name="payments_Payment_create"),
    path("payments/Payment/detail/<int:pk>/", views.PaymentDetailView.as_view(), name="payments_Payment_detail"),
    path("payments/Payment/update/<int:pk>/", views.PaymentUpdateView.as_view(), name="payments_Payment_update"),
    path("payments/Bill/", views.BillListView.as_view(), name="payments_Bill_list"),
    path("payments/Bill/create/", views.BillCreateView.as_view(), name="payments_Bill_create"),
    path("payments/Bill/detail/<int:pk>/", views.BillDetailView.as_view(), name="payments_Bill_detail"),
    path("payments/Bill/update/<int:pk>/", views.BillUpdateView.as_view(), name="payments_Bill_update"),
    path("payments/Service/", views.ServiceListView.as_view(), name="payments_Service_list"),
    path("payments/Service/create/", views.ServiceCreateView.as_view(), name="payments_Service_create"),
    path("payments/Service/detail/<int:pk>/", views.ServiceDetailView.as_view(), name="payments_Service_detail"),
    path("payments/Service/update/<int:pk>/", views.ServiceUpdateView.as_view(), name="payments_Service_update"),
)
