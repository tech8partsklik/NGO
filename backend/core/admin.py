from django.contrib import admin
from .models import SiteCredential, Member, Donation, Banner


@admin.register(SiteCredential)
class SiteCredentialAdmin(admin.ModelAdmin):
    list_display = ('name', 'updated_at')


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('member_id', 'user', 'is_approved', 'role', 'created_at')
    list_filter = ('is_approved', 'role')
    search_fields = ('member_id', 'user__username', 'user__first_name', 'user__email')


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('id', 'member', 'amount', 'status', 'created_at')
    list_filter = ('status',)


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'created_at')