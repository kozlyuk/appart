"""appart.notice URL Configuration"""

from django.urls import path, include
from rest_framework import routers

from notice import api

router = routers.DefaultRouter()
router.register("notice", api.NoticeViewSet)
router.register("news", api.NewsViewSet)
router.register("choice", api.ChoiceViewSet)
router.register("question", api.QuestionViewSet)


urlpatterns = (
    path("api/v1/", include(router.urls)),

    path("api/v1/get_notices/<int:apartment>/", api.NoticeListView.as_view()),

)
