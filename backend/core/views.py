# core/views.py
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny
from django.contrib.auth import get_user_model, authenticate, login
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

import razorpay
import json
import hmac
import hashlib

from .models import Member, Donation, Banner, Campaign, News, SiteCredential
from .serializers import (
    MemberSerializer, MemberCreateSerializer, DonationSerializer,
    BannerSerializer, CampaignSerializer, NewsSerializer,
    SiteCredentialSerializer, SiteCredentialAdminSerializer,
    RegisterSerializer, SimpleUserSerializer
)

User = get_user_model()

# Public endpoints: campaigns, news, banners
class CampaignViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Campaign.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = CampaignSerializer
    permission_classes = [AllowAny]

class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = News.objects.order_by('-published_at')
    serializer_class = NewsSerializer
    permission_classes = [AllowAny]

class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.all().order_by('-created_at')
    serializer_class = BannerSerializer
    # only staff can create/update/delete, read for all
    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [IsAdminUser()]
        return [AllowAny()]

# Member registration and self-service
class MemberRegistrationView(generics.CreateAPIView):
    serializer_class = MemberCreateSerializer
    permission_classes = [AllowAny]

# Simple register endpoint that creates User + Member
class RegisterAPI(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

# Member viewset for admin/authorized access
class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all().order_by('-created_at')
    serializer_class = MemberSerializer

    def get_permissions(self):
        if self.action in ['create', 'register']:
            return [AllowAny()]
        if self.action in ['approve_member']:
            return [IsAdminUser()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def approve_member(self, request, pk=None):
        member = self.get_object()
        member.is_approved = True
        member.save()
        # optionally send approval email
        from .utils import send_member_approval_email
        try:
            send_member_approval_email(member)
        except Exception:
            pass
        return Response({'status': 'approved'})

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        try:
            member = request.user.member_profile
        except Member.DoesNotExist:
            return Response({'detail': 'Not a member'}, status=404)
        return Response(MemberSerializer(member).data)


# Donations
class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all().order_by('-created_at')
    serializer_class = DonationSerializer

    def get_permissions(self):
        if self.action in ['create_order']:
            return [AllowAny()]
        if self.action in ['webhook']:
            return [AllowAny()]
        # admin only for list and edit
        if self.request.method in ['GET'] and not self.request.user.is_staff:
            return [IsAdminUser()]
        return [IsAdminUser()]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def create_order(self, request):
        """
        Expects { amount: 1000, campaign_id: optional }
        Returns Razorpay order object + local donation id
        """
        amount_raw = request.data.get('amount')
        try:
            amount = float(amount_raw)
            if amount <= 0:
                raise ValueError
        except Exception:
            return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

        # convert to paise
        amount_paise = int(round(amount * 100))

        # fetch credentials
        cred = SiteCredential.objects.first()
        if not cred or not cred.razorpay_key_id or not cred.razorpay_key_secret:
            return Response({'error': 'Payment gateway not configured'}, status=status.HTTP_400_BAD_REQUEST)

        client = razorpay.Client(auth=(cred.razorpay_key_id, cred.razorpay_key_secret))
        order = client.order.create({
            'amount': amount_paise,
            'currency': 'INR',
            'payment_capture': 1
        })
        donation = Donation.objects.create(amount=amount, razorpay_order_id=order['id'], status='created')
        return Response({'order': order, 'donation_id': donation.id})

# SiteCredential endpoints (admin can set full secrets; public GET returns only key id)
class SiteCredentialViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request):
        cred = SiteCredential.objects.first()
        if not cred:
            return Response({})
        # only return safe fields
        data = SiteCredentialSerializer(cred).data
        return Response(data)

    def create(self, request):
        # Admin only
        if not request.user.is_staff:
            return Response({'detail': 'Not allowed'}, status=403)
        serializer = SiteCredentialAdminSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def update(self, request, pk=None):
        if not request.user.is_staff:
            return Response({'detail': 'Not allowed'}, status=403)
        cred = SiteCredential.objects.first()
        serializer = SiteCredentialAdminSerializer(instance=cred, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# Razorpay webhook handler (use razorpay utility to verify signature)
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def razorpay_webhook(request):
    payload = request.body
    sig = request.META.get('HTTP_X_RAZORPAY_SIGNATURE', '')
    cred = SiteCredential.objects.first()
    if not cred or not cred.razorpay_key_secret:
        return Response({'error': 'Razorpay not configured'}, status=400)

    # verify signature using razorpay util
    try:
        razorpay.utility.verify_webhook_signature(payload, sig, cred.razorpay_key_secret)
    except Exception as e:
        # invalid signature
        return Response({'error': 'invalid signature'}, status=400)

    data = json.loads(payload)
    ev = data.get('event')
    # handle payment captured
    if ev == 'payment.captured':
        payment = data.get('payload', {}).get('payment', {}).get('entity', {})
        order_id = payment.get('order_id')
        payment_id = payment.get('id')
        donation = Donation.objects.filter(razorpay_order_id=order_id).first()
        if donation:
            donation.razorpay_payment_id = payment_id
            donation.status = 'captured'
            donation.save()
            # send receipt email in background (or sync for now)
            from .utils import send_receipt_email
            try:
                # if donor is linked to a member, find their email
                to_email = None
                if donation.donor and donation.donor.user and donation.donor.user.email:
                    to_email = donation.donor.user.email
                # fallback: if webhook includes email
                email_from_payload = payment.get('email')
                if not to_email and email_from_payload:
                    to_email = email_from_payload
                if to_email:
                    send_receipt_email(donation, to_email)
            except Exception:
                pass
    return Response({'status': 'ok'})
