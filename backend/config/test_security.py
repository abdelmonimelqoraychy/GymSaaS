from django.test import SimpleTestCase, override_settings
from rest_framework.exceptions import ValidationError

from .upload_validation import (
    MAX_IMAGE_SIZE,
    validate_image_upload,
)


class FakeUpload:
    def __init__(self, size, content_type):
        self.size = size
        self.content_type = content_type


class SecurityConfigurationTests(SimpleTestCase):
    @override_settings(SECURE_SSL_REDIRECT=True)
    def test_internal_health_check_is_not_redirected(self):
        response = self.client.get("/health/")

        self.assertEqual(response.status_code, 200)

    def test_health_check_accepts_head_but_rejects_post(self):
        head_response = self.client.head("/health/", secure=True)
        post_response = self.client.post("/health/", secure=True)

        self.assertEqual(head_response.status_code, 200)
        self.assertEqual(post_response.status_code, 405)

    @override_settings(SECURE_SSL_REDIRECT=True)
    def test_other_http_routes_are_redirected_to_https(self):
        response = self.client.get("/api/auth/login/")

        self.assertEqual(response.status_code, 301)
        self.assertTrue(response["Location"].startswith("https://"))

    @override_settings(
        SECURE_HSTS_SECONDS=31_536_000,
        SECURE_HSTS_INCLUDE_SUBDOMAINS=True,
    )
    def test_secure_responses_include_security_headers(self):
        response = self.client.get("/health/", secure=True)

        self.assertEqual(response["X-Content-Type-Options"], "nosniff")
        self.assertEqual(response["X-Frame-Options"], "DENY")
        self.assertEqual(
            response["Referrer-Policy"],
            "strict-origin-when-cross-origin",
        )
        self.assertIn(
            "max-age=31536000",
            response["Strict-Transport-Security"],
        )

    def test_image_larger_than_five_megabytes_is_rejected(self):
        upload = FakeUpload(
            MAX_IMAGE_SIZE + 1,
            "image/png",
        )

        with self.assertRaisesMessage(
            ValidationError,
            "L’image ne doit pas dépasser 5 Mo.",
        ):
            validate_image_upload(upload)

    def test_unexpected_image_type_is_rejected(self):
        upload = FakeUpload(100, "image/svg+xml")

        with self.assertRaisesMessage(
            ValidationError,
            "Utilisez une image JPEG, PNG ou WebP.",
        ):
            validate_image_upload(upload)
