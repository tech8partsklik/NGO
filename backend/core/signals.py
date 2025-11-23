from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile, Member

@receiver(post_save, sender=User)
def create_related_profiles(sender, instance, created, **kwargs):
    if created:
        profile = UserProfile.objects.create(user=instance)
        Member.objects.create(user=instance, profile=profile)
