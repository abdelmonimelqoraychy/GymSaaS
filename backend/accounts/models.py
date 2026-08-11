from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        SUPER_ADMIN = "SUPER_ADMIN", "Super-administrateur"
        COORDINATOR = "COORDINATOR", "Coordinateur"
        MEMBER = "MEMBER", "Adhérent"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.MEMBER,
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
    )

    preferred_language = models.CharField(
        max_length=2,
        choices=[
            ("fr", "Français"),
            ("ar", "Arabe"),
        ],
        default="fr",
    )

    def __str__(self):
        return self.get_full_name() or self.username