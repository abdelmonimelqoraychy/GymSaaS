from django.contrib.auth import authenticate
from rest_framework import (
    permissions,
    status,
)
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from members.serializers import MemberSerializer

from .serializers import (
    RegistrationSerializer,
    UserSerializer,
)


class RegisterView(APIView):
    permission_classes = (
        permissions.AllowAny,
    )

    def post(self, request):
        serializer = RegistrationSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        user = serializer.save()
        token, _ = Token.objects.get_or_create(
            user=user,
        )

        member = user.member_profile

        return Response(
            {
                "token": token.key,
                "user": UserSerializer(
                    user,
                ).data,
                "member": MemberSerializer(
                    member,
                    context={
                        "request": request,
                    },
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = (
        permissions.AllowAny,
    )

    def post(self, request):
        username = request.data.get(
            "username",
        )
        password = request.data.get(
            "password",
        )

        if not username or not password:
            return Response(
                {
                    "detail": (
                        "Le nom d’utilisateur et le mot "
                        "de passe sont obligatoires."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(
            request=request,
            username=username,
            password=password,
        )

        if user is None:
            return Response(
                {
                    "detail": (
                        "Identifiants incorrects."
                    ),
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {
                    "detail": (
                        "Ce compte est désactivé."
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        token, _ = Token.objects.get_or_create(
            user=user,
        )

        return Response(
            {
                "token": token.key,
                "user": UserSerializer(
                    user,
                ).data,
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = (
        permissions.IsAuthenticated,
    )

    def post(self, request):
        Token.objects.filter(
            user=request.user,
        ).delete()

        return Response(
            {
                "detail": (
                    "Déconnexion réussie."
                ),
            },
            status=status.HTTP_200_OK,
        )


class CurrentUserView(APIView):
    permission_classes = (
        permissions.IsAuthenticated,
    )

    def get(self, request):
        return Response(
            UserSerializer(
                request.user,
            ).data,
            status=status.HTTP_200_OK,
        )