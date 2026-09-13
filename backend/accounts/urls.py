from django.urls import path

from .views import (
    ChangePasswordView,
    CurrentUserView,
    LoginView,
    LogoutView,
    RegisterView,
    ScopedTokenRefreshView,
    ScopedTokenVerifyView,
)


urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="auth-register",
    ),
    path(
        "login/",
        LoginView.as_view(),
        name="auth-login",
    ),
    path(
        "logout/",
        LogoutView.as_view(),
        name="auth-logout",
    ),
    path(
        "me/",
        CurrentUserView.as_view(),
        name="auth-me",
    ),
    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="auth-change-password",
    ),
    path(
        "token/refresh/",
        ScopedTokenRefreshView.as_view(),
        name="auth-token-refresh",
    ),
    path(
        "token/verify/",
        ScopedTokenVerifyView.as_view(),
        name="auth-token-verify",
    ),
]
