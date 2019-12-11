from django.urls import path

from . import views


urlpatterns = (
    path("notice/choice/", views.ChoiceListView.as_view(), name="notice_Choice_list"),
    path("notice/choice/create/", views.ChoiceCreateView.as_view(), name="notice_Choice_create"),
    path("notice/choice/detail/<int:pk>/", views.ChoiceDetailView.as_view(), name="notice_Choice_detail"),
    path("notice/choice/update/<int:pk>/", views.ChoiceUpdateView.as_view(), name="notice_Choice_update"),
    path("notice/choice/delete/<int:pk>/", views.ChoiceDeleteView.as_view(), name="notice_Choice_delete"),
    path("notice/notice/", views.NoticeListView.as_view(), name="notice_Notice_list"),
    path("notice/notice/create/", views.NoticeCreateView.as_view(), name="notice_Notice_create"),
    path("notice/notice/detail/<int:pk>/", views.NoticeDetailView.as_view(), name="notice_Notice_detail"),
    path("notice/notice/update/<int:pk>/", views.NoticeUpdateView.as_view(), name="notice_Notice_update"),
    path("notice/notice/delete/<int:pk>/", views.NoticeUpdateView.as_view(), name="notice_Notice_delete"),
    path("notice/question/", views.QuestionListView.as_view(), name="notice_Question_list"),
    path("notice/question/create/", views.QuestionCreateView.as_view(), name="notice_Question_create"),
    path("notice/question/detail/<int:pk>/", views.QuestionDetailView.as_view(), name="notice_Question_detail"),
    path("notice/question/update/<int:pk>/", views.QuestionUpdateView.as_view(), name="notice_Question_update"),
)
