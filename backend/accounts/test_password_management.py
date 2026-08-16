from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase


User = get_user_model()


class ChangePasswordAPITests(APITestCase):
    def setUp(self):
        self.old_password = "StrongPassword123!"
        self.new_password = "NewStrongPassword456!"

        self.user = User.objects.create_user(
            username="password-member",
            email="password-member@test.com",
            password=self.old_password,
            role=User.Role.MEMBER,
        )

        self.old_token = Token.objects.create(
            user=self.user,
        )

        self.url = reverse(
            "auth-change-password",
        )
        self.login_url = reverse(
            "auth-login",
        )

    def test_anonymous_user_cannot_change_password(
        self,
    ):
        response = self.client.post(
            self.url,
            {
                "old_password": self.old_password,
                "new_password": self.new_password,
                "new_password_confirm": (
                    self.new_password
                ),
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_user_can_change_password(self):
        old_token_key = self.old_token.key

        self.client.force_authenticate(
            user=self.user,
        )

        response = self.client.post(
            self.url,
            {
                "old_password": self.old_password,
                "new_password": self.new_password,
                "new_password_confirm": (
                    self.new_password
                ),
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertIn(
            "token",
            response.data,
        )

        self.user.refresh_from_db()

        self.assertTrue(
            self.user.check_password(
                self.new_password,
            )
        )
        self.assertFalse(
            self.user.check_password(
                self.old_password,
            )
        )
        self.assertFalse(
            Token.objects.filter(
                key=old_token_key,
            ).exists()
        )
        self.assertTrue(
            Token.objects.filter(
                key=response.data["token"],
                user=self.user,
            ).exists()
        )

    def test_old_password_must_be_correct(self):
        self.client.force_authenticate(
            user=self.user,
        )

        response = self.client.post(
            self.url,
            {
                "old_password": "IncorrectPassword123!",
                "new_password": self.new_password,
                "new_password_confirm": (
                    self.new_password
                ),
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn(
            "old_password",
            response.data,
        )

        self.user.refresh_from_db()

        self.assertTrue(
            self.user.check_password(
                self.old_password,
            )
        )

    def test_new_password_confirmation_must_match(
        self,
    ):
        self.client.force_authenticate(
            user=self.user,
        )

        response = self.client.post(
            self.url,
            {
                "old_password": self.old_password,
                "new_password": self.new_password,
                "new_password_confirm": (
                    "DifferentPassword789!"
                ),
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn(
            "new_password_confirm",
            response.data,
        )

    def test_new_password_must_be_different(self):
        self.client.force_authenticate(
            user=self.user,
        )

        response = self.client.post(
            self.url,
            {
                "old_password": self.old_password,
                "new_password": self.old_password,
                "new_password_confirm": (
                    self.old_password
                ),
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn(
            "new_password",
            response.data,
        )

    def test_weak_new_password_is_rejected(self):
        self.client.force_authenticate(
            user=self.user,
        )

        response = self.client.post(
            self.url,
            {
                "old_password": self.old_password,
                "new_password": "123",
                "new_password_confirm": "123",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn(
            "new_password",
            response.data,
        )

    def test_user_can_login_with_new_password(self):
        self.client.force_authenticate(
            user=self.user,
        )

        change_response = self.client.post(
            self.url,
            {
                "old_password": self.old_password,
                "new_password": self.new_password,
                "new_password_confirm": (
                    self.new_password
                ),
            },
            format="json",
        )

        self.assertEqual(
            change_response.status_code,
            status.HTTP_200_OK,
        )

        self.client.force_authenticate(
            user=None,
        )

        old_login_response = self.client.post(
            self.login_url,
            {
                "username": self.user.username,
                "password": self.old_password,
            },
            format="json",
        )
        new_login_response = self.client.post(
            self.login_url,
            {
                "username": self.user.username,
                "password": self.new_password,
            },
            format="json",
        )

        self.assertEqual(
            old_login_response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )
        self.assertEqual(
            new_login_response.status_code,
            status.HTTP_200_OK,
        )