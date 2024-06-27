"""
URL configuration for english_website project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("registration/", include("registration.urls")),
    path("group1/", include("group1.urls")),
    path("group2/", include("group2.urls")),
    path("group3/", include("group3.urls")),
    path("group4/", include("group4.urls")),
    path("group5/", include("group5.urls")),
    path("group6/", include("group6.urls")),
    path("group7/", include("group7.urls")),
    path("group8/", include("group8.urls")),
    path("group9/", include("group9.urls")),
    path("group10/", include("group10.urls")),
    path("group11/", include("group11.urls")),
    path("group12/", include("group12.urls")),
    path("group13/", include("group13.urls")),
    path("group14/", include("group14.urls")),
    path("group15/", include("group15.urls")),
    path("group16/", include("group16.urls")),

]
