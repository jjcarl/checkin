"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf import settings
from django.conf.urls import include, url, patterns
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth.models import User, Group
from rest_framework.authtoken import views
from main.views import UserViewSet, LocationViewSet, FamilyViewSet
from main.views import CheckinViewSet, TodoViewSet
from rest_framework import routers, permissions, serializers, viewsets
admin.autodiscover()
from oauth2_provider.ext.rest_framework import TokenHasReadWriteScope, TokenHasScope
from django.contrib.auth import views as auth_views


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group


# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, TokenHasReadWriteScope]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['groups']
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
# router.register(r'locations', LocationViewSet)
# router.register(r'families', FamilyViewSet)
# router.register(r'checkins', CheckinViewSet)
# router.register(r'todo', TodoViewSet)


urlpatterns = [
    url(r'^api-token-auth/', views.obtain_auth_token),
    url(r'^', include(router.urls)),
    url(r'^o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    url(r'^admin/', include(admin.site.urls)),
    # basic auth
    url(r'^login/$', 'main.user_auth.login', name='login'),
    url(r'^logout/$', 'main.user_auth.logout', name='logout'),

    # password reset flow
    url(r'^password/reset/$',
        auth_views.password_reset,
        {"template_name": "password_reset/password_reset_form.html"},
        name="password_reset"
        ),
    url(r'^password/reset/done/$',
        auth_views.password_reset_done,
        {"template_name": "password_reset/password_reset_form_done.html"},
        name="password_reset_done"),
    url(r'^password/reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>.+)/$',
        auth_views.password_reset_confirm,
        {"template_name": "password_reset/password_reset_confirm.html"},
        name="password_reset_confirm"),
    url(r'^password/reset/confirm/done/$',
        auth_views.password_reset_complete,
        {"template_name": "password_reset/password_reset_complete.html"},
        name="password_reset_complete"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
