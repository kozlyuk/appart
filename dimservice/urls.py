"""appart.dimservice URL Configuration"""

from django.urls import path, include
from rest_framework_nested import routers

from dimservice import api

router = routers.DefaultRouter()
router.register("work", api.WorkViewSet, basename='work')
router.register("work_without_pagination", api.WorkWithoutPagination,
                basename='work_without_pagination')
router.register("order", api.OrderViewSet,
                basename='Order')

order_router = routers.NestedDefaultRouter(router, r'order', lookup='order')
order_router.register(r'execution', api.ExecutionViewSet, basename='Execution')

urlpatterns = (
    path("api/v1/", include(router.urls)),
    path("api/v1/", include(order_router.urls)),

    path("api/v1/get_exec_choices/", api.ExecStatusChoices.as_view()),
    path("api/v1/get_payment_choices/", api.PaymentStatusChoices.as_view()),
    path("api/v1/get_execution_choices/", api.ExecutionStatusChoices.as_view()),
)
