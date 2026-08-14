from django.contrib import admin

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "email",
        "subject",
        "status",
        "created_at",
    )
    list_filter = (
        "status",
        "created_at",
    )
    search_fields = (
        "full_name",
        "email",
        "phone",
        "subject",
        "message",
    )
    readonly_fields = (
        "full_name",
        "phone",
        "email",
        "subject",
        "message",
        "created_at",
        "updated_at",
    )
    ordering = ("-created_at",)