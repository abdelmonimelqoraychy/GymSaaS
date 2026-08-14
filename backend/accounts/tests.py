from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()


class AuthenticationAPITests(APITestCase):
    def setUp(self):
        self.password = "TestPassword123!"
        self.user = User.objects.create_user(
            username="testuser",
            password=self.password,
            email="test@example.com",
            role=User.Role.MEMBER,
        )

    def test_login_returns_token_and_user(self):
        response = self.client.post(
            reverse("auth-login"),
            {
                "username": self.user.username,
                "password": self.password,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)
        self.assertEqual(
            response.data["user"]["username"],
            self.user.username,
        )
        self.assertEqual(
            response.data["user"]["role"],
            User.Role.MEMBER,
        )

    def test_login_rejects_invalid_credentials(self):
        response = self.client.post(
            reverse("auth-login"),
            {
                "username": self.user.username,
                "password": "incorrect-password",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_current_user_requires_authentication(self):
        response = self.client.get(reverse("auth-me"))

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_authenticated_user_can_read_profile(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(reverse("auth-me"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], self.user.username)

    def test_logout_deletes_token(self):
        login_response = self.client.post(
            reverse("auth-login"),
            {
                "username": self.user.username,
                "password": self.password,
            },
            format="json",
        )
        token = login_response.data["token"]

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token}",
        )
        logout_response = self.client.post(reverse("auth-logout"))

        self.assertEqual(
            logout_response.status_code,
            status.HTTP_200_OK,
        )

        profile_response = self.client.get(reverse("auth-me"))

        self.assertEqual(
            profile_response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )