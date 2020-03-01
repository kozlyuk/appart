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

    path("api/v1/", include(router.urls)),

    path("notice/choice/", views.ChoiceListView.as_view(), name="notice_Choice_list"),
    path("notice/choice/create/", views.ChoiceCreateView.as_view(), name="notice_Choice_create"),
    path("notice/choice/detail/<int:pk>/", views.ChoiceDetailView.as_view(), name="notice_Choice_detail"),
    path("notice/choice/update/<int:pk>/", views.ChoiceUpdateView.as_view(), name="notice_Choice_update"),
    path("notice/choice/delete/<int:pk>/", views.ChoiceDeleteView.as_view(), name="notice_Choice_delete"),
    path("notice/news/", views.NewsListView.as_view(), name="notice_News_list"),
    path("notice/news/create/", views.NewsCreateView.as_view(), name="notice_News_create"),
    path("notice/news/detail/<int:pk>/", views.NewsDetailView.as_view(), name="notice_News_detail"),
    path("notice/news/update/<int:pk>/", views.NewsUpdateView.as_view(), name="notice_News_update"),
    path("notice/news/delete/<int:pk>/", views.NewsDeleteView.as_view(), name="notice_News_delete"),
    path("notice/question/", views.QuestionListView.as_view(), name="notice_Question_list"),
    path("notice/question/create/", views.QuestionCreateView.as_view(), name="notice_Question_create"),
    path("notice/question/detail/<int:pk>/", views.QuestionDetailView.as_view(), name="notice_Question_detail"),
    path("notice/question/update/<int:pk>/", views.QuestionUpdateView.as_view(), name="notice_Question_update"),
    path("notice/question/delete/<int:pk>/", views.QuestionDeleteView.as_view(), name="notice_Question_delete"),
)
