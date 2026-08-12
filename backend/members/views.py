from rest_framework import permissions, viewsets

from .models import Member, MembershipPlan, Payment, Subscription
from .permissions import (
    IsManagerOrReadOnly,
    IsSuperAdminOrCoordinator,
)
from .serializers import (
    MemberSerializer,
    MembershipPlanSerializer,
    PaymentSerializer,
    SubscriptionSerializer,
)


def is_manager(user):
    return (
        user.is_superuser
        or user.role in ("SUPER_ADMIN", "COORDINATOR")
    )


class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = Member.objects.select_related("user").all()

        if is_manager(self.request.user):
            return queryset

        return queryset.filter(user=self.request.user)

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsSuperAdminOrCoordinator()]

        return [permissions.IsAuthenticated()]


class MembershipPlanViewSet(viewsets.ModelViewSet):
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer
    permission_classes = (IsManagerOrReadOnly,)


class SubscriptionViewSet(viewsets.ModelViewSet):
    serializer_class = SubscriptionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = Subscription.objects.select_related(
            "member__user",
            "plan",
        ).all()

        if is_manager(self.request.user):
            return queryset

        return queryset.filter(member__user=self.request.user)

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsSuperAdminOrCoordinator()]

        return [permissions.IsAuthenticated()]


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = Payment.objects.select_related(
            "subscription__member__user",
            "subscription__plan",
        ).all()

        if is_manager(self.request.user):
            return queryset

        return queryset.filter(
            subscription__member__user=self.request.user
        )

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsSuperAdminOrCoordinator()]

        return [permissions.IsAuthenticated()]