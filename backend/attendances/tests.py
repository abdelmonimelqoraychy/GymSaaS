from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from members.models import (
    Member,
    MembershipPlan,
    Subscription,
)

from .models import Attendance


User = get_user_model()


class AttendanceAPITests(APITestCase):
    def setUp(self):
        self.coordinator = User.objects.create_user(
            username="attendance-coordinator",
            password="TestPassword123!",
            role=User.Role.COORDINATOR,
        )

        self.member_user = User.objects.create_user(
            username="attendance-member",
            password="TestPassword123!",
            role=User.Role.MEMBER,
        )
        self.member = Member.objects.create(
            user=self.member_user,
        )

        self.plan = MembershipPlan.objects.create(
            name="Formule Présence",
            duration_days=30,
            price="300.00",
        )
        self.subscription = Subscription.objects.create(
            member=self.member,
            plan=self.plan,
        )

        self.member_without_subscription_user = (
            User.objects.create_user(
                username="member-without-subscription",
                password="TestPassword123!",
                role=User.Role.MEMBER,
            )
        )
        self.member_without_subscription = Member.objects.create(
            user=self.member_without_subscription_user,
        )

        self.list_url = reverse("attendance-list")

    def test_anonymous_user_cannot_access_attendances(self):
        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_member_cannot_access_attendances(self):
        self.client.force_authenticate(
            user=self.member_user,
        )

        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_coordinator_can_register_check_in(self):
        self.client.force_authenticate(
            user=self.coordinator,
        )

        response = self.client.post(
            self.list_url,
            {
                "member": self.member.id,
                "entry_method": Attendance.EntryMethod.MANUAL,
                "notes": "",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )
        self.assertEqual(
            Attendance.objects.count(),
            1,
        )

        attendance = Attendance.objects.get()
        self.assertEqual(
            attendance.recorded_by,
            self.coordinator,
        )
        self.assertIsNone(attendance.check_out)

    def test_member_without_subscription_cannot_check_in(self):
        self.client.force_authenticate(
            user=self.coordinator,
        )

        response = self.client.post(
            self.list_url,
            {
                "member": self.member_without_subscription.id,
                "entry_method": Attendance.EntryMethod.MANUAL,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("member", response.data)
        self.assertEqual(
            Attendance.objects.count(),
            0,
        )

    def test_member_cannot_have_two_open_attendances(self):
        Attendance.objects.create(
            member=self.member,
            recorded_by=self.coordinator,
        )
        self.client.force_authenticate(
            user=self.coordinator,
        )

        response = self.client.post(
            self.list_url,
            {
                "member": self.member.id,
                "entry_method": Attendance.EntryMethod.MANUAL,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("member", response.data)
        self.assertEqual(
            Attendance.objects.count(),
            1,
        )

    def test_coordinator_can_register_checkout(self):
        attendance = Attendance.objects.create(
            member=self.member,
            recorded_by=self.coordinator,
        )
        self.client.force_authenticate(
            user=self.coordinator,
        )

        response = self.client.post(
            reverse(
                "attendance-checkout",
                kwargs={"pk": attendance.id},
            ),
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        attendance.refresh_from_db()
        self.assertIsNotNone(attendance.check_out)

    def test_checkout_cannot_be_registered_twice(self):
        attendance = Attendance.objects.create(
            member=self.member,
            recorded_by=self.coordinator,
        )
        self.client.force_authenticate(
            user=self.coordinator,
        )

        checkout_url = reverse(
            "attendance-checkout",
            kwargs={"pk": attendance.id},
        )

        first_response = self.client.post(
            checkout_url,
            format="json",
        )
        second_response = self.client.post(
            checkout_url,
            format="json",
        )

        self.assertEqual(
            first_response.status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(
            second_response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )