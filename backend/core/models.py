from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.validators import MinValueValidator
import uuid

# -------------------------
# CONSTANTS
# -------------------------

ROLE_CHOICES = (
    ('admin', 'Admin'),
    ('manager', 'Manager'),
    ('coordinator', 'Coordinator'),
    ('member', 'Member'),
)

DONATION_STATUS = (
    ("initiated", "Initiated"),
    ("pending", "Pending"),
    ("failed", "Failed"),
    ("paid", "Paid"),
    ("refunded", "Refunded"),
)

# -------------------------
# MASTER CREDENTIAL MODEL
# -------------------------
class SiteCredential(models.Model):
    name = models.CharField(max_length=100, unique=True, default="default")

    razorpay_key_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_key_secret = models.CharField(max_length=255, blank=True, null=True)

    smtp_host = models.CharField(max_length=255, blank=True, null=True)
    smtp_port = models.IntegerField(blank=True, null=True)
    smtp_user = models.CharField(max_length=255, blank=True, null=True)
    smtp_password = models.CharField(max_length=255, blank=True, null=True)

    updated_at = models.DateTimeField(auto_now=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Credentials ({self.name})"



# -------------------------
# USER PROFILE (For KYC + ID CARD EXPORT)
# -------------------------

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    phone_number = models.CharField(max_length=20, blank=True)
    country_code = models.CharField(max_length=10, default="+91")

    dob = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, blank=True, null=True)

    profile_photo = models.ImageField(upload_to="profile_photos/", blank=True, null=True)

    address = models.TextField(blank=True)
    city = models.CharField(max_length=150, blank=True)
    state = models.CharField(max_length=150, blank=True)
    pincode = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=150, blank=True, default="India")

    updated_at = models.DateTimeField(auto_now=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Profile - {self.user.username}"


# -------------------------
# MEMBER SYSTEM
# -------------------------

class Member(models.Model):
    """Represents an NGO membership profile tied to a user."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='member_account')
    profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE, null=True, blank=True)

    member_id = models.CharField(max_length=50, unique=True, blank=True)

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    is_approved = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.member_id:
            # More clean + predictable ID format: NGO-YYYY-XXXX
            self.member_id = f"NGO-{timezone.now().year}-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.member_id})"


# -------------------------
# DONATIONS
# -------------------------

class Donation(models.Model):
    member = models.ForeignKey(Member, on_delete=models.SET_NULL, null=True, blank=True)
    donor_detail_json=models.JSONField(default=dict,null=True,blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(10)])
    currency = models.CharField(max_length=10, default='INR')

    razorpay_order_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)

    status = models.CharField(max_length=30, choices=DONATION_STATUS, default='initiated')
    receipt_id = models.CharField(max_length=30, blank=True, null=True)
    verified = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Donation {self.amount} by {self.member}"


# -------------------------
# WEBSITE CONTENT MODELS
# -------------------------

class Banner(models.Model):
    title = models.CharField(max_length=255, blank=True)
    subtitle = models.CharField(max_length=500, blank=True)
    image = models.ImageField(upload_to="banners/")
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or "Banner"


class Campaign(models.Model):
    title = models.CharField(max_length=255)
    short_description = models.TextField()
    image = models.ImageField(upload_to="campaigns/", blank=True, null=True)
    goal_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    collected_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class News(models.Model):
    title = models.CharField(max_length=255)
    body = models.TextField(blank=True)
    published_at = models.DateField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Event(models.Model):
    title = models.CharField(max_length=255)
    event_date = models.DateTimeField()
    location = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
