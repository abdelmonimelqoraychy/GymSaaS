from rest_framework.routers import DefaultRouter

from .views import (
    MemberViewSet,
    MembershipPlanViewSet,
    PaymentViewSet,
    SubscriptionViewSet,
)

router = DefaultRouter()
router.register("members", MemberViewSet, basename="member")
router.register("plans", MembershipPlanViewSet, basename="plan")
router.register(
    "subscriptions",
    SubscriptionViewSet,
    basename="subscription",
)
router.register("payments", PaymentViewSet, basename="payment")

urlpatterns = router.urls