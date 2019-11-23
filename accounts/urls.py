"""appart.account URL Configuration"""

from django.urls import path, include, reverse_lazy
from django.contrib.auth import views as auth

from accounts import views

urlpatterns = [

    path('login/', views.CustomLoginView.as_view(template_name='auth.html'), name='login'),
    path('logout/', auth.LogoutView.as_view(next_page=reverse_lazy('login')), name='logout'),
    path('password_change/', auth.PasswordChangeView.as_view(), name='password_change'),
    path('password_change/done/', auth.PasswordChangeDoneView.as_view(), name='password_change_done'),
    path('password_reset/', auth.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth.PasswordResetCompleteView.as_view(), name='password_reset_complete'),

    path("user/", views.UserListView.as_view(), name="accounts_User_list"),
    path("user/create/", views.UserCreateView.as_view(), name="accounts_User_create"),
    path("user/detail/<int:pk>/", views.UserDetailView.as_view(), name="accounts_User_detail"),
    path("user/update/<int:pk>/", views.UserUpdateView.as_view(), name="accounts_User_update"),
    path('user/self_update/', views.UserSelfUpdate.as_view(), name='user_self_update'),

    path("dashboard/", views.DashboardView.as_view(), name='dashboard_main'),
]
