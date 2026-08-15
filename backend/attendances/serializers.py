from django.utils import timezone
from rest_framework import serializers

from members.models import Subscription

from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    member_name = serializers.StringRelatedField(
        source="member",
        read_only=True,
    )
    recorded_by_username = serializers.CharField(
        source="recorded_by.username",
        read_only=True,
    )

    class Meta:
        model = Attendance
        fields = (
            "id",
            "member",
            "member_name",
            "check_in",
            "check_out",
            "entry_method",
            "recorded_by",
            "recorded_by_username",
            "notes",
        )
        read_only_fields = (
            "id",
            "check_in",
            "recorded_by",
        )

    def validate(self, attrs):
        if self.instance is None:
            member = attrs.get("member")
            today = timezone.localdate()

            if not member.is_active:
                raise serializers.ValidationError(
                    {
                        "member": (
                            "Ce membre est inactif."
                        ),
                    }
                )

            has_active_subscription = Subscription.objects.filter(
                member=member,
                start_date__lte=today,
                end_date__gte=today,
                is_suspended=False,
            ).exists()

            if not has_active_subscription:
                raise serializers.ValidationError(
                    {
                        "member": (
                            "Ce membre ne possède pas "
                            "d'abonnement actif."
                        ),
                    }
                )

            already_inside = Attendance.objects.filter(
                member=member,
                check_out__isnull=True,
            ).exists()

            if already_inside:
                raise serializers.ValidationError(
                    {
                        "member": (
                            "Une entrée sans sortie existe "
                            "déjà pour ce membre."
                        ),
                    }
                )

            if attrs.get("check_out") is not None:
                raise serializers.ValidationError(
                    {
                        "check_out": (
                            "La sortie ne peut pas être "
                            "enregistrée lors de l'entrée."
                        ),
                    }
                )

        check_out = attrs.get("check_out")

        if (
            self.instance is not None
            and check_out is not None
            and check_out < self.instance.check_in
        ):
            raise serializers.ValidationError(
                {
                    "check_out": (
                        "L'heure de sortie doit être "
                        "postérieure à l'heure d'entrée."
                    ),
                }
            )

        return attrs