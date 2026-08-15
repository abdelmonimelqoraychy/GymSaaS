from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/contacts/", include("contacts.urls")),
    path("api/", include("members.urls")),
    path("api-auth/", include("rest_framework.urls")),
    path("api/dashboard/", include("dashboard.urls")),
    path("api/attendances/", include("attendances.urls")),
]