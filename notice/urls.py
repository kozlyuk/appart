from django.urls import path, include
from rest_framework import routers

from notice import api

router = routers.DefaultRouter()
router.register("choice", api.ChoiceViewSet)
router.register("notice", api.NoticeViewSet)
router.register("news", api.NewsViewSet)
router.register("question", api.QuestionViewSet)

from notice import views


urlpatterns = (

    path("api/v1/", include(router.urls))
)
