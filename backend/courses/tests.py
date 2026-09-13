from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Coach


User = get_user_model()


class PublicCoachPrivacyTests(APITestCase):
    def setUp(self):
        self.coach = Coach.objects.create(
            first_name="Sara",
            last_name="Amrani",
            specialty="Fitness",
            email="sara@example.com",
            phone="0612345678",
            bio="Coach sportive.",
            is_active=True,
        )
        self.url = reverse("coach-list")

    def test_public_list_hides_private_contact_details(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        coach = response.data[0]
        self.assertNotIn("email", coach)
        self.assertNotIn("phone", coach)
        self.assertIn("specialty", coach)

    def test_manager_list_contains_contact_details(self):
        manager = User.objects.create_user(
            username="manager",
            password="StrongPassword123!",
            role=User.Role.COORDINATOR,
        )
        self.client.force_authenticate(manager)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        coach = response.data[0]
        self.assertEqual(coach["email"], "sara@example.com")
        self.assertEqual(coach["phone"], "0612345678")
