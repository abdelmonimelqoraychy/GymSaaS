from django.utils import timezone
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from members.permissions import IsSuperAdminOrCoordinator

from .models import Attendance
from .serializers import AttendanceSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.select_related(
        "member__user",
        "recorded_by",
    )
    serializer_class = AttendanceSerializer
    permission_classes = (IsSuperAdminOrCoordinator,)
    http_method_names = (
        "get",
        "post",
        "patch",
        "head",
        "options",
    )
    filter_backends = (
        filters.SearchFilter,
        filters.OrderingFilter,
    )
    search_fields = (
        "member__user__username",
        "member__user__email",
    )
    ordering_fields = (
        "check_in",
        "check_out",
    )
    ordering = ("-check_in",)

    def perform_create(self, serializer):
        serializer.save(
            recorded_by=self.request.user,
        )

    @action(
        detail=True,
        methods=("post",),
        url_path="checkout",
    )
    def checkout(self, request, pk=None):
        attendance = self.get_object()

        if attendance.check_out is not None:
            return Response(
                {
                    "detail": (
                        "La sortie de cette présence "
                        "est déjà enregistrée."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        attendance.check_out = timezone.now()
        attendance.save(
            update_fields=("check_out",),
        )

        return Response(
            self.get_serializer(attendance).data,
            status=status.HTTP_200_OK,
        )