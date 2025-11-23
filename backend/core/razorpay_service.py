import razorpay
from django.conf import settings
from core.models import SiteCredential

def get_razorpay_client():
    creds = SiteCredential.objects.first()

    if not creds or not creds.razorpay_key_id or not creds.razorpay_key_secret:
        raise Exception("Razorpay credentials not configured.")

    return razorpay.Client(auth=(creds.razorpay_key_id, creds.razorpay_key_secret))
