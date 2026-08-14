from rest_framework import serializers

from .models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = (
            "id",
            "full_name",
            "phone",
            "email",
            "subject",
            "message",
            "status",
            "created_at",
        )
        read_only_fields = (
            "id",
            "status",
            "created_at",
        )

    def validate_full_name(self, value):
        value = value.strip()

        if len(value) < 2:
            raise serializers.ValidationError(
                "Le nom complet doit contenir au moins 2 caractères."
            )

        return value

    def validate_subject(self, value):
        value = value.strip()

        if len(value) < 3:
            raise serializers.ValidationError(
                "Le sujet doit contenir au moins 3 caractères."
            )

        return value

    def validate_message(self, value):
        value = value.strip()

        if len(value) < 10:
            raise serializers.ValidationError(
                "Le message doit contenir au moins 10 caractères."
            )

        return value