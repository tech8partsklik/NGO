# core/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Member, Donation, Banner, Campaign, News, SiteCredential

User = get_user_model()

class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        # create Member profile automatically (if your Member model uses OneToOne)
        Member.objects.create(user=user)
        return user

class MemberSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer()
    class Meta:
        model = Member
        fields = ('id', 'member_id', 'user', 'mobile', 'dob', 'address', 'photo', 'is_approved', 'role', 'created_at')

class MemberCreateSerializer(serializers.ModelSerializer):
    # used for public registration (no user nested)
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=6)
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Member
        fields = ('username', 'email', 'password', 'first_name', 'last_name',
                  'mobile', 'dob', 'address', 'photo')

    def create(self, validated_data):
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        user = User.objects.create(username=username, email=email, first_name=first_name, last_name=last_name)
        user.set_password(password)
        user.save()
        member = Member.objects.create(user=user, **validated_data)
        # Optionally send confirmation email here (see utils.send_member_confirmation)
        return member

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ('id', 'donor', 'amount', 'currency', 'status', 'razorpay_order_id', 'razorpay_payment_id', 'created_at')

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ('id', 'title', 'subtitle', 'image', 'is_active', 'created_at')

class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = ('id', 'title', 'short_description', 'description', 'image', 'goal_amount', 'raised_amount', 'is_active', 'created_at')

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ('id', 'title', 'summary', 'content', 'image', 'published_at')

class SiteCredentialSerializer(serializers.ModelSerializer):
    # we expose only key id in GET (secret encrypted in DB)
    class Meta:
        model = SiteCredential
        fields = ('id', 'name', 'razorpay_key_id', 'updated_at')
        read_only_fields = ('updated_at',)

class SiteCredentialAdminSerializer(serializers.ModelSerializer):
    # full serializer for admin POST/PUT to save encrypted fields
    class Meta:
        model = SiteCredential
        fields = ('id', 'name', 'razorpay_key_id', 'razorpay_key_secret', 'smtp_host', 'smtp_port', 'smtp_user', 'smtp_password', 'updated_at')
        read_only_fields = ('updated_at',)
