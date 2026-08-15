from datetime import timedelta
from decimal import Decimal

from django.db.models import Sum
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from members.models import Member, Payment, Subscription
from members.permissions import IsSuperAdminOrCoordinator
from members.serializers import PaymentSerializer


class DashboardSummaryView(APIView):
    permission_classes = (IsSuperAdminOrCoordinator,)

    def get(self, request):
        today = timezone.localdate()
        month_start = today.replace(day=1)
        expiration_limit = today + timedelta(days=7)

        subscriptions = Subscription.objects.all()
        payments = Payment.objects.all()

        total_revenue = payments.aggregate(
            total=Sum("amount"),
        )["total"] or Decimal("0.00")

        monthly_revenue = payments.filter(
            paid_at__date__gte=month_start,
            paid_at__date__lte=today,
        ).aggregate(
            total=Sum("amount"),
        )["total"] or Decimal("0.00")

        active_subscriptions = subscriptions.filter(
            end_date__gte=today,
            is_suspended=False,
        ).count()

        expiring_soon = subscriptions.filter(
            end_date__gte=today,
            end_date__lte=expiration_limit,
            is_suspended=False,
        ).count()

        expired_subscriptions = subscriptions.filter(
            end_date__lt=today,
            is_suspended=False,
        ).count()

        suspended_subscriptions = subscriptions.filter(
            is_suspended=True,
        ).count()

        recent_payments = payments.select_related(
            "subscription__member__user",
            "subscription__plan",
        ).order_by("-paid_at")[:5]

        data = {
            "members": {
                "total": Member.objects.count(),
                "active": Member.objects.filter(
                    is_active=True,
                ).count(),
                "inactive": Member.objects.filter(
                    is_active=False,
                ).count(),
            },
            "subscriptions": {
                "active": active_subscriptions,
                "expiring_soon": expiring_soon,
                "expired": expired_subscriptions,
                "suspended": suspended_subscriptions,
            },
            "revenue": {
                "total": total_revenue,
                "current_month": monthly_revenue,
            },
            "recent_payments": PaymentSerializer(
                recent_payments,
                many=True,
            ).data,
        }

        return Response(
            data,
            status=status.HTTP_200_OK,
        )