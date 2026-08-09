from django.contrib import admin

from .models import Branch, Gym, GymUser


class BranchInline(admin.TabularInline):
    model = Branch
    extra = 0


@admin.register(Gym)
class GymAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
        "owner",
        "status",
        "language",
        "created_at",
    )

    list_filter = (
        "status",
        "language",
        "currency",
    )

    search_fields = (
        "name",
        "slug",
        "owner__username",
        "owner__email",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }

    inlines = [BranchInline]


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "gym",
        "city",
        "is_main",
        "is_active",
    )

    list_filter = (
        "is_main",
        "is_active",
        "city",
    )

    search_fields = (
        "name",
        "gym__name",
        "city",
    )


@admin.register(GymUser)
class GymUserAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "gym",
        "branch",
        "role",
        "is_active",
    )

    list_filter = (
        "role",
        "is_active",
        "gym",
    )

    search_fields = (
        "user__username",
        "user__email",
        "gym__name",
    )