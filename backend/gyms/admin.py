from django.contrib import admin

from .models import Gym


@admin.register(Gym)
class GymAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "city",
        "phone",
        "is_active",
        "updated_at",
    )

    search_fields = (
        "name",
        "city",
        "email",
        "phone",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    def has_add_permission(self, request):
        if Gym.objects.exists():
            return False

        return super().has_add_permission(request)