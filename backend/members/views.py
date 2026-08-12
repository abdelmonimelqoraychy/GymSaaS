from rest_framework import permissions, viewsets

from .models import Member, MembershipPlan, Payment, Subscription
from .serializers import (
    MemberSerializer,
    MembershipPlanSerializer,
    PaymentSerializer,
    SubscriptionSerializer,
)


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.select_related("user").all()
    serializer_class = MemberSerializer
    permission_classes = (permissions.IsAuthenticated,)


class MembershipPlanViewSet(viewsets.ModelViewSet):
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer
    permission_classes = (permissions.IsAuthenticated,)


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.select_related(
        "member__user",
        "plan",
    ).all()
    serializer_class = SubscriptionSerializer
    permission_classes = (permissions.IsAuthenticated,)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related(
        "subscription__member__user",
        "subscription__plan",
    ).all()
    serializer_class = PaymentSerializer
    permission_classes = (permissions.IsAuthenticated,)