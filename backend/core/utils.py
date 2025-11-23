# core/utils.py
from django.core.mail import EmailMessage, get_connection
from django.template.loader import render_to_string
from reportlab.pdfgen import canvas
from io import BytesIO
from django.conf import settings
import qrcode
from django.core.files.base import ContentFile

def generate_receipt_pdf(donation):
    """
    Simple PDF receipt generator using reportlab. Customize template/layout as needed.
    Returns BytesIO.
    """
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=(595, 842))  # A4 portrait
    p.setFont("Helvetica-Bold", 16)
    p.drawString(40, 800, f"Donation Receipt - #{donation.id}")
    p.setFont("Helvetica", 12)
    p.drawString(40, 780, f"Amount: ₹{donation.amount} {donation.currency}")
    p.drawString(40, 760, f"Payment ID: {donation.razorpay_payment_id or 'N/A'}")
    p.drawString(40, 740, f"Date: {donation.created_at.strftime('%Y-%m-%d %H:%M')}")
    if donation.donor and donation.donor.user:
        p.drawString(40, 720, f"Donor: {donation.donor.user.get_full_name()} ({donation.donor.user.email})")
    p.line(40, 700, 550, 700)
    p.drawString(40, 680, "Thank you for supporting our cause.")
    p.showPage()
    p.save()
    buffer.seek(0)
    return buffer

def send_email_with_attachment(subject, body, to_email, attachment_bytes=None, attachment_name='file.pdf'):
    """
    Uses Django's EmailMessage. Ensure EMAIL_* settings are configured or SiteCredential SMTP is used before calling.
    """
    email = EmailMessage(subject=subject, body=body, to=[to_email])
    if attachment_bytes:
        email.attach(attachment_name, attachment_bytes.read(), 'application/pdf')
    email.send()

def send_receipt_email(donation, to_email):
    pdf_buffer = generate_receipt_pdf(donation)
    subject = f"Donation Receipt - #{donation.id}"
    body = f"Dear donor,\n\nThank you for your donation of ₹{donation.amount}. Attached is your receipt.\n\nRegards,\nNGO"
    send_email_with_attachment(subject, body, to_email, attachment_bytes=pdf_buffer, attachment_name=f"receipt_{donation.id}.pdf")


def send_member_approval_email(member):
    """
    Sample HTML/text email on member approval. Use render_to_string with a template if available.
    """
    if not member.user.email:
        return
    subject = "Membership Approved"
    body = f"Dear {member.user.first_name},\n\nYour membership ({member.member_id}) has been approved.\n\nRegards,\nNGO"
    send_email_with_attachment(subject, body, member.user.email)



# core/email_backend.py  (utility to use DB-stored SMTP)
from django.core.mail import get_connection
from .models import SiteCredential

def get_smtp_connection():
    cred = SiteCredential.objects.first()
    if not cred or not cred.smtp_host:
        return get_connection()  # fallback to default configured in settings
    return get_connection(
        host=cred.smtp_host,
        port=cred.smtp_port or 587,
        username=cred.smtp_user,
        password=cred.smtp_password,
        use_tls=True
    )
