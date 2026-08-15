from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import ContactMessage


class ContactMessageAPITests(APITestCase):
    def setUp(self):
        self.url = reverse("contact-create")
        self.valid_data = {
            "full_name": "Abdelmonim El Qoraychy",
            "phone": "0612345678",
            "email": "test@example.com",
            "subject": "Demande d'informations",
            "message": (
                "Je souhaite obtenir davantage "
                "d'informations sur votre salle."
            ),
        }

    def test_anonymous_user_can_create_contact_message(self):
        response = self.client.post(
            self.url,
            self.valid_data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )
        self.assertEqual(ContactMessage.objects.count(), 1)
        self.assertEqual(
            ContactMessage.objects.first().email,
            "test@example.com",
        )

    def test_new_message_has_default_status(self):
        response = self.client.post(
            self.url,
            self.valid_data,
            format="json",
        )

        self.assertEqual(
            response.data["status"],
            ContactMessage.Status.NEW,
        )

    def test_invalid_email_is_rejected(self):
        self.valid_data["email"] = "adresse-invalide"

        response = self.client.post(
            self.url,
            self.valid_data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("email", response.data)
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_short_message_is_rejected(self):
        self.valid_data["message"] = "Court"

        response = self.client.post(
            self.url,
            self.valid_data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("message", response.data)
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_status_cannot_be_selected_by_visitor(self):
        self.valid_data["status"] = ContactMessage.Status.PROCESSED

        response = self.client.post(
            self.url,
            self.valid_data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )
        self.assertEqual(
            ContactMessage.objects.first().status,
            ContactMessage.Status.NEW,
        )