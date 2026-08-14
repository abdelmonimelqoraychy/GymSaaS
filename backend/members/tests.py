from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Member, MembershipPlan, Subscription


User = get_user_model()


class MembersPermissionsTests(APITestCase):
    def setUp(self):
        self.member_user = User.objects.create_user(
            username="member1",
            password="TestPassword123!",
            role=User.Role.MEMBER,
        )
        self.member = Member.objects.create(user=self.member_user)

        self.other_user = User.objects.create_user(
            username="member2",
            password="TestPassword123!",
            role=User.Role.MEMBER,
        )
        self.other_member = Member.objects.create(user=self.other_user)

        self.coordinator = User.objects.create_user(
            username="coordinator",
            password="TestPassword123!",
            role=User.Role.COORDINATOR,
        )

        self.plan = MembershipPlan.objects.create(
            name="Mensuel",
            duration_days=30,
            price="300.00",
        )

        self.subscription = Subscription.objects.create(
            member=self.member,
            plan=self.plan,
        )
        self.other_subscription = Subscription.objects.create(
            member=self.other_member,
            plan=self.plan,
        )

    def test_anonymous_user_cannot_access_members(self):
        response = self.client.get(reverse("member-list"))

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_member_sees_only_own_profile(self):
        self.client.force_authenticate(user=self.member_user)

        response = self.client.get(reverse("member-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.member.id)

    def test_member_cannot_access_another_profile(self):
        self.client.force_authenticate(user=self.member_user)

        response = self.client.get(
            reverse(
                "member-detail",
                kwargs={"pk": self.other_member.pk},
            )
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_member_sees_only_own_subscription(self):
        self.client.force_authenticate(user=self.member_user)

        response = self.client.get(reverse("subscription-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]["id"],
            self.subscription.id,
        )

    def test_member_cannot_create_plan(self):
        self.client.force_authenticate(user=self.member_user)

        response = self.client.post(
            reverse("plan-list"),
            {
                "name": "Annuel",
                "duration_days": 365,
                "price": "2500.00",
                "description": "",
                "is_active": True,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_coordinator_sees_all_members(self):
        self.client.force_authenticate(user=self.coordinator)

        response = self.client.get(reverse("member-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_coordinator_can_create_plan(self):
        self.client.force_authenticate(user=self.coordinator)

        response = self.client.post(
            reverse("plan-list"),
            {
                "name": "Annuel",
                "duration_days": 365,
                "price": "2500.00",
                "description": "",
                "is_active": True,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )