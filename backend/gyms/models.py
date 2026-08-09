from django.conf import settings
from django.core.validators import RegexValidator
from django.db import models


hex_color_validator = RegexValidator(
    regex=r"^#[0-9A-Fa-f]{6}$",
    message="Utilisez une couleur au format #RRGGBB.",
)


class Gym(models.Model):
    class Status(models.TextChoices):
        TRIAL = "TRIAL", "Période d’essai"
        ACTIVE = "ACTIVE", "Active"
        SUSPENDED = "SUSPENDED", "Suspendue"
        CANCELLED = "CANCELLED", "Annulée"

    name = models.CharField(
        max_length=150,
        verbose_name="Nom de la salle",
    )

    slug = models.SlugField(
        max_length=160,
        unique=True,
        help_text="Exemple : atlas-fitness",
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="owned_gyms",
        limit_choices_to={"role": "GYM_OWNER"},
    )

    logo = models.ImageField(
        upload_to="gyms/logos/",
        blank=True,
        null=True,
    )

    primary_color = models.CharField(
        max_length=7,
        default="#2563EB",
        validators=[hex_color_validator],
    )

    secondary_color = models.CharField(
        max_length=7,
        default="#111827",
        validators=[hex_color_validator],
    )

    email = models.EmailField(blank=True)

    phone = models.CharField(
        max_length=20,
        blank=True,
    )

    address = models.TextField(blank=True)

    language = models.CharField(
        max_length=2,
        choices=[
            ("fr", "Français"),
            ("ar", "Arabe"),
        ],
        default="fr",
    )

    currency = models.CharField(
        max_length=3,
        default="MAD",
    )

    status = models.CharField(
        max_length=15,
        choices=Status.choices,
        default=Status.TRIAL,
    )

    trial_ends_at = models.DateField(
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["name"]
        verbose_name = "Salle"
        verbose_name_plural = "Salles"

    def __str__(self):
        return self.name


class Branch(models.Model):
    gym = models.ForeignKey(
        Gym,
        on_delete=models.CASCADE,
        related_name="branches",
    )

    name = models.CharField(
        max_length=150,
        verbose_name="Nom de l’établissement",
    )

    address = models.TextField(blank=True)

    city = models.CharField(
        max_length=100,
        blank=True,
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
    )

    email = models.EmailField(blank=True)

    is_main = models.BooleanField(
        default=False,
        verbose_name="Établissement principal",
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["gym", "name"]
        verbose_name = "Établissement"
        verbose_name_plural = "Établissements"
        constraints = [
            models.UniqueConstraint(
                fields=["gym", "name"],
                name="unique_branch_name_per_gym",
            )
        ]

    def __str__(self):
        return f"{self.gym.name} — {self.name}"


class GymUser(models.Model):
    class Role(models.TextChoices):
        OWNER = "OWNER", "Propriétaire"
        MANAGER = "MANAGER", "Responsable"
        RECEPTIONIST = "RECEPTIONIST", "Réceptionniste"
        COACH = "COACH", "Coach"

    gym = models.ForeignKey(
        Gym,
        on_delete=models.CASCADE,
        related_name="staff_members",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="gym_memberships",
    )

    branch = models.ForeignKey(
        Branch,
        on_delete=models.SET_NULL,
        related_name="staff_members",
        blank=True,
        null=True,
    )

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
    )

    is_active = models.BooleanField(
        default=True,
    )

    joined_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["gym", "user"]
        verbose_name = "Employé de salle"
        verbose_name_plural = "Employés des salles"
        constraints = [
            models.UniqueConstraint(
                fields=["gym", "user"],
                name="unique_user_per_gym",
            )
        ]

    def __str__(self):
        return f"{self.user} — {self.gym.name} ({self.get_role_display()})"