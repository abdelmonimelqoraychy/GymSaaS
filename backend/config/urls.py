from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health_check(request):
    return JsonResponse(
        {
            "status": "ok",
            "service": "gymsaas-api",
        }
    )


urlpatterns = [
    path(
        "health/",
        health_check,
        name="health-check",
    ),
    path(
        "admin/",
        admin.site.urls,
    ),
    path(
        "api/auth/",
        include("accounts.urls"),
    ),
    path(
        "api/contacts/",
        include("contacts.urls"),
    ),
    path(
        "api/dashboard/",
        include("dashboard.urls"),
    ),
    path(
        "api/attendances/",
        include("attendances.urls"),
    ),
    path(
        "api/reports/",
        include("reports.urls"),
    ),
    path(
        "api/audit-logs/",
        include("auditlogs.urls"),
    ),
    path(
        "api/",
        include("members.urls"),
    ),
    path(
        "api-auth/",
        include("rest_framework.urls"),
    ),
]