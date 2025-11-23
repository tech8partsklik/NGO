from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
from core.models import Donation, SiteCredential
from .razorpay_service import get_razorpay_client
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from razorpay import Utility


@api_view(["POST"])
@permission_classes([AllowAny])
def create_razorpay_order(request):
    amount = request.data.get("amount")
    donor_detail_json = request.data.get("donor_detail_json", {
        "name":"Anonymous"
    })

    if not amount:
        return Response({"error": "Amount required"}, status=400)

    client = get_razorpay_client()

    order = client.order.create({
        "amount": int(float(amount) * 100), 
        "currency": "INR",
        "payment_capture": "1"
    })

    donation = Donation.objects.create(
        donor_detail_json=donor_detail_json,
        amount=amount,
        razorpay_order_id=order["id"],
        status="created"
    )

    return Response({
        "order_id": order["id"],
        "amount": amount,
        "key": SiteCredential.objects.first().razorpay_key_id,
        "donation_id": donation.id,
    })





@api_view(["POST"])
@permission_classes([AllowAny])
def verify_razorpay_payment(request):
    
    try:
        order_id = request.data.get("razorpay_order_id")
        payment_id = request.data.get("razorpay_payment_id")
        signature = request.data.get("razorpay_signature")

        client = get_razorpay_client()    
        client.utility.verify_payment_signature({
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": signature
        })

        donation = Donation.objects.get(razorpay_order_id=order_id)
        donation.razorpay_payment_id = payment_id
        donation.status = "paid"
        donation.verified = True
        donation.save()

        return Response({"message": "Payment verified successfully"})
    except Exception as e:
        print(e  , 'is exception')
        return Response({"error": "Verification failed"}, status=400)
