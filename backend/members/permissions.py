from rest_framework import permissions


class IsSuperAdminOrCoordinator(permissions.BasePermission):
    """
    Autorise les super-administrateurs, les coordinateurs
    et les superusers Django.
    """

    def has_permission(self, request, view):
        user = request.user

        return bool(
            user
            and user.is_authenticated
            and (
                user.is_superuser
                or user.role in ("SUPER_ADMIN", "COORDINATOR")
            )
        )


class IsManagerOrReadOnly(permissions.BasePermission):
    """
    Tous les utilisateurs authentifiés peuvent consulter.
    Seuls les responsables peuvent modifier.
    """

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True

        return (
            user.is_superuser
            or user.role in ("SUPER_ADMIN", "COORDINATOR")
        )