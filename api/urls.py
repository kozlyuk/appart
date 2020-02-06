from django.urls import path, include
from rest_framework import routers

from accounts import api as accounts_api
from condominium import api as condominium_api
from payments import api as payments_api
from notice import api as notice_api

router = routers.DefaultRouter()
router.register("user", accounts_api.UserViewSet)
router.register("apartment", condominium_api.ApartmentViewSet)
router.register("house", condominium_api.HouseViewSet)
router.register("company", condominium_api.CompanyViewSet)
router.register("Payment", payments_api.PaymentViewSet)
router.register("Bill", payments_api.BillViewSet)
router.register("Service", payments_api.ServiceViewSet)
router.register("Choice", notice_api.ChoiceViewSet)
router.register("Notice", notice_api.NoticeViewSet)
router.register("News", notice_api.NewsViewSet)
router.register("Question", notice_api.QuestionViewSet)


urlpatterns = [
    path("api/v1/", include(router.urls)),

    path("api/v1/user/get_by_number/<str:mobile_number>/", accounts_api.GetByNumber.as_view()),
]
