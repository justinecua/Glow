<<<<<<< HEAD
"""
URL configuration for AgoraProj project.

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
from django.conf import settings
from django.shortcuts import render
from django.urls import path, include
from django.views.generic import TemplateView
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

def permission_denied(request):
    return render(request, '403.html', status=403)

urlpatterns = [
    path('', include('Agora.urls')),
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('account/login/', auth_views.LoginView.as_view(template_name='account/login.html'), name='login'),
    path('account/signup/', TemplateView.as_view(template_name='account/signup.html'), name='signup'),
    path('account/logout/', auth_views.LogoutView.as_view(next_page='home'), name='logout'),
    path('account/', include('allauth.urls')),
]

if settings.ALLOW_ADMIN:
    urlpatterns += [
        path('admin/', admin.site.urls),
    ]
else:
    urlpatterns += [
        path('admin/', permission_denied),
    ]
=======
"""
URL configuration for AgoraProj project.

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
from django.conf import settings
from django.shortcuts import render
from django.urls import path, include
from django.views.generic import TemplateView
from django.contrib.auth import views as auth_views


def permission_denied(request):
    return render(request, '403.html', status=403)

urlpatterns = [
    path('', include('Agora.urls')),
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('account/login/', auth_views.LoginView.as_view(template_name='account/login.html'), name='login'),
    path('account/signup/', TemplateView.as_view(template_name='account/signup.html'), name='signup'),
    path('account/logout/', auth_views.LogoutView.as_view(next_page='home'), name='logout'),
    path('account/', include('allauth.urls')),
]

if settings.ALLOW_ADMIN:
    urlpatterns += [
        path('admin/', admin.site.urls),
    ]
else:
    urlpatterns += [
        path('admin/', permission_denied),
    ]
>>>>>>> 5d3d5850e63c80939288d10be922a761d063bf92
