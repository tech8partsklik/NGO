# core/urls.py
from django.urls import path, include
from rest_framework import routers
from .views import (
    BannerViewSet, CampaignViewSet, NewsViewSet,
    MemberViewSet, DonationViewSet, SiteCredentialViewSet,
    razorpay_webhook, MemberRegistrationView, RegisterAPI
)
from .donation_views import verify_razorpay_payment,create_razorpay_order

# router = routers.DefaultRouter()
# router.register(r'banners', BannerViewSet, basename='banners')
# router.register(r'campaigns', CampaignViewSet, basename='campaigns')
# router.register(r'news', NewsViewSet, basename='news')
# router.register(r'members', MemberViewSet, basename='members')
# router.register(r'donations', DonationViewSet, basename='donations')



# SiteCredential uses a custom ViewSet
# We'll expose /sitecredential/ (GET returns key id, POST by admin sets secrets)
# We'll map it manually below.

urlpatterns = [
    # path('', include(router.urls)),
    path('sitecredential/', SiteCredentialViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update'}), name='sitecredential'),
    path('register/', RegisterAPI.as_view(), name='register'),
    path('member-register/', MemberRegistrationView.as_view(), name='member-register'),
    path('webhook/razorpay/', razorpay_webhook, name='razorpay-webhook'),
    path("donations/create-order/", create_razorpay_order),
    path("donations/verify-payment/",verify_razorpay_payment),
]
