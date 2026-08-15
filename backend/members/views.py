from rest_framework import filters, permissions, viewsets

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
    filter_backends = (
        filters.SearchFilter,
        filters.OrderingFilter,
    )
    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
        "user__email",
        "user__phone",
    )
    ordering_fields = (
        "joined_at",
        "birth_date",
        "is_active",
    )
    ordering = ("-joined_at",)

    def get_queryset(self):
        queryset = Member.objects.select_related("user").all()

        if is_manager(self.request.user):
            return queryset

        return queryset.filter(user=self.request.user)

    def get_permissions(self):
        if self.action in (
            "create",
            "update",
            "partial_update",
            "destroy",
        ):
            return [IsSuperAdminOrCoordinator()]

        return [permissions.IsAuthenticated()]


class MembershipPlanViewSet(viewsets.ModelViewSet):
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer
    permission_classes = (IsManagerOrReadOnly,)
    filter_backends = (
        filters.SearchFilter,
        filters.OrderingFilter,
    )
    search_fields = (
        "name",
        "description",
    )
    ordering_fields = (
        "name",
        "duration_days",
        "price",
        "is_active",
    )
    ordering = ("price",)


class SubscriptionViewSet(viewsets.ModelViewSet):
    serializer_class = SubscriptionSerializer
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = (
        filters.SearchFilter,
        filters.OrderingFilter,
    )
    search_fields = (
        "member__user__username",
        "member__user__first_name",
        "member__user__last_name",
        "member__user__email",
        "plan__name",
    )
    ordering_fields = (
        "start_date",
        "end_date",
        "created_at",
        "is_suspended",
    )
    ordering = ("-start_date",)

    def get_queryset(self):
        queryset = Subscription.objects.select_related(
            "member__user",
            "plan",
        ).all()

        if is_manager(self.request.user):
            return queryset

        return queryset.filter(member__user=self.request.user)

    def get_permissions(self):
        if self.action in (
            "create",
            "update",
            "partial_update",
            "destroy",
        ):
            return [IsSuperAdminOrCoordinator()]

        return [permissions.IsAuthenticated()]


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = (
        filters.SearchFilter,
        filters.OrderingFilter,
    )
    search_fields = (
        "reference",
        "notes",
        "subscription__member__user__username",
        "subscription__member__user__first_name",
        "subscription__member__user__last_name",
        "subscription__plan__name",
    )
    ordering_fields = (
        "amount",
        "paid_at",
        "method",
    )
    ordering = ("-paid_at",)

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
        if self.action in (
            "create",
            "update",
            "partial_update",
            "destroy",
        ):
            return [IsSuperAdminOrCoordinator()]

        return [permissions.IsAuthenticated()]