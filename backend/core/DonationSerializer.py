from rest_framework import serializers
from core.models import Donation

class DonationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ['id', 'amount', 'currency', 'donor']
        read_only_fields = ['id']
