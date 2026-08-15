from django.db import models


class ContactMessage(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "Nouveau"
        IN_PROGRESS = "in_progress", "En cours"
        PROCESSED = "processed", "Traité"

    full_name = models.CharField(
        max_length=150,
        verbose_name="Nom complet",
    )
    phone = models.CharField(
        max_length=30,
        blank=True,
        verbose_name="Téléphone",
    )
    email = models.EmailField(
        verbose_name="Adresse e-mail",
    )
    subject = models.CharField(
        max_length=200,
        verbose_name="Sujet",
    )
    message = models.TextField(
        verbose_name="Message",
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
        verbose_name="Statut",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date d’envoi",
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Dernière modification",
    )

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"

    def __str__(self):
        return f"{self.full_name} — {self.subject}"