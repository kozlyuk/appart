"""appart.payments URL Configuration"""

from django.urls import path, include

from payments import views

urlpatterns = (
    path("payment/", views.PaymentListView.as_view(), name="payments_Payment_list"),
    path("payment/create/", views.PaymentCreateView.as_view(), name="payments_Payment_create"),
    path("payment/detail/<int:pk>/", views.PaymentDetailView.as_view(), name="payments_Payment_detail"),
    path("payment/update/<int:pk>/", views.PaymentUpdateView.as_view(), name="payments_Payment_update"),
    path("bill/", views.BillListView.as_view(), name="payments_Bill_list"),
    path("bill/create/", views.BillCreateView.as_view(), name="payments_Bill_create"),
    path("bill/detail/<int:pk>/", views.BillDetailView.as_view(), name="payments_Bill_detail"),
    path("bill/update/<int:pk>/", views.BillUpdateView.as_view(), name="payments_Bill_update"),
    path("service/", views.ServiceListView.as_view(), name="payments_Service_list"),
    path("service/create/", views.ServiceCreateView.as_view(), name="payments_Service_create"),
    path("service/detail/<int:pk>/", views.ServiceDetailView.as_view(), name="payments_Service_detail"),
    path("service/update/<int:pk>/", views.ServiceUpdateView.as_view(), name="payments_Service_update"),
)
