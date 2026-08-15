from django.utils import timezone
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from members.models import Member
from members.permissions import IsSuperAdminOrCoordinator

from .models import Attendance
from .serializers import (
    AttendanceSerializer,
    QRCodeCheckInSerializer,
)


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
        detail=False,
        methods=("post",),
        url_path="qr-checkin",
    )
    def qr_checkin(self, request):
        qr_serializer = QRCodeCheckInSerializer(
            data=request.data,
        )
        qr_serializer.is_valid(
            raise_exception=True,
        )

        qr_code = qr_serializer.validated_data["qr_code"]

        try:
            member = Member.objects.get(
                qr_code=qr_code,
            )
        except Member.DoesNotExist:
            return Response(
                {
                    "qr_code": (
                        "Ce QR code ne correspond "
                        "à aucun membre."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        attendance_serializer = AttendanceSerializer(
            data={
                "member": member.id,
                "entry_method": Attendance.EntryMethod.QR_CODE,
            },
            context=self.get_serializer_context(),
        )
        attendance_serializer.is_valid(
            raise_exception=True,
        )
        attendance_serializer.save(
            recorded_by=request.user,
        )

        return Response(
            attendance_serializer.data,
            status=status.HTTP_201_CREATED,
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