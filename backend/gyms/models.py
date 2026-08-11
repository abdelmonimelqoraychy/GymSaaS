from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.db import models


hex_color_validator = RegexValidator(
    regex=r"^#[0-9A-Fa-f]{6}$",
    message="Utilisez une couleur au format #RRGGBB.",
)


class Gym(models.Model):
    name = models.CharField(
        max_length=150,
        verbose_name="Nom de la salle",
    )

    logo = models.ImageField(
        upload_to="gym/logo/",
        blank=True,
        null=True,
    )

    primary_color = models.CharField(
        max_length=7,
        default="#2563EB",
        validators=[hex_color_validator],
        verbose_name="Couleur principale",
    )

    secondary_color = models.CharField(
        max_length=7,
        default="#111827",
        validators=[hex_color_validator],
        verbose_name="Couleur secondaire",
    )

    email = models.EmailField(blank=True)

    phone = models.CharField(
        max_length=20,
        blank=True,
    )

    address = models.TextField(blank=True)

    city = models.CharField(
        max_length=100,
        blank=True,
    )

    description = models.TextField(
        blank=True,
        verbose_name="Description",
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Salle active",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Salle"
        verbose_name_plural = "Salle"

    def clean(self):
        if not self.pk and Gym.objects.exists():
            raise ValidationError(
                "La plateforme ne peut contenir qu’une seule salle."
            )

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.name