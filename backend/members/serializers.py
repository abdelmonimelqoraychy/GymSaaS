from rest_framework import serializers

from .models import Member, MembershipPlan, Payment, Subscription


class MembershipPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipPlan
        fields = (
            "id",
            "name",
            "duration_days",
            "price",
            "description",
            "is_active",
        )


class MemberSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )
    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    class Meta:
        model = Member
        fields = (
            "id",
            "user",
            "username",
            "full_name",
            "email",
            "birth_date",
            "address",
            "emergency_phone",
            "joined_at",
            "is_active",
        )
        read_only_fields = ("joined_at",)

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class SubscriptionSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(
        source="member.user.get_full_name",
        read_only=True,
    )
    plan_name = serializers.CharField(
        source="plan.name",
        read_only=True,
    )
    days_remaining = serializers.IntegerField(read_only=True)
    status = serializers.CharField(read_only=True)
    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True,
    )

    class Meta:
        model = Subscription
        fields = (
            "id",
            "member",
            "member_name",
            "plan",
            "plan_name",
            "start_date",
            "end_date",
            "days_remaining",
            "status",
            "status_display",
            "is_suspended",
            "created_at",
        )
        read_only_fields = (
            "end_date",
            "days_remaining",
            "status",
            "status_display",
            "created_at",
        )


class PaymentSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(
        source="subscription.member.user.get_full_name",
        read_only=True,
    )

    class Meta:
        model = Payment
        fields = (
            "id",
            "subscription",
            "member_name",
            "amount",
            "method",
            "paid_at",
            "reference",
            "notes",
        )