from django.urls import path

from . import views


urlpatterns = (
    path("notice/Choice/", views.ChoiceListView.as_view(), name="notice_Choice_list"),
    path("notice/Choice/create/", views.ChoiceCreateView.as_view(), name="notice_Choice_create"),
    path("notice/Choice/detail/<int:pk>/", views.ChoiceDetailView.as_view(), name="notice_Choice_detail"),
    path("notice/Choice/update/<int:pk>/", views.ChoiceUpdateView.as_view(), name="notice_Choice_update"),
    path("notice/Notice/", views.NoticeListView.as_view(), name="notice_Notice_list"),
    path("notice/Notice/create/", views.NoticeCreateView.as_view(), name="notice_Notice_create"),
    path("notice/Notice/detail/<int:pk>/", views.NoticeDetailView.as_view(), name="notice_Notice_detail"),
    path("notice/Notice/update/<int:pk>/", views.NoticeUpdateView.as_view(), name="notice_Notice_update"),
    path("notice/Question/", views.QuestionListView.as_view(), name="notice_Question_list"),
    path("notice/Question/create/", views.QuestionCreateView.as_view(), name="notice_Question_create"),
    path("notice/Question/detail/<int:pk>/", views.QuestionDetailView.as_view(), name="notice_Question_detail"),
    path("notice/Question/update/<int:pk>/", views.QuestionUpdateView.as_view(), name="notice_Question_update"),
)
