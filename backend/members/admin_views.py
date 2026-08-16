from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers import UserSerializer

from .admin_serializers import (
    AdminMemberCreateSerializer,
)
from .permissions import IsSuperAdminOrCoordinator
from .serializers import MemberSerializer


class AdminMemberCreateView(APIView):
    permission_classes = (
        IsSuperAdminOrCoordinator,
    )

    def post(self, request):
        serializer = AdminMemberCreateSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )

        member = serializer.save()

        return Response(
            {
                "user": UserSerializer(
                    member.user,
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