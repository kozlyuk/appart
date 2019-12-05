"""appart URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url
from django.conf.urls.static import static
from appart.settings import MEDIA_URL, MEDIA_ROOT
from appart.settings_local import DEBUG



urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('accounts.urls')),
    path('', include('condominium.urls')),
    path('', include('payments.urls')),
    path('', include('pages.urls')),
    path('', include('api.urls')),
    path('', include('messaging.urls')),

    url(r'^api-auth/', include('rest_framework.urls')),

]


if DEBUG:
    urlpatterns += static(MEDIA_URL, document_root=MEDIA_ROOT)
