from django.urls import path, include
from rest_framework import routers

from condominium import api as condominium_api
from notice import api as notice_api

router = routers.DefaultRouter()
router.register("Choice", notice_api.ChoiceViewSet)
router.register("Notice", notice_api.NoticeViewSet)
router.register("News", notice_api.NewsViewSet)
router.register("Question", notice_api.QuestionViewSet)
