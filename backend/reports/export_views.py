import csv

from django.http import HttpResponse
from django.utils import timezone
from django.utils.dateparse import parse_date
from rest_framework import serializers
from rest_framework.views import APIView

from attendances.models import Attendance
from members.models import Member, Payment
from members.permissions import IsSuperAdminOrCoordinator


def parse_date_parameter(
    request,
    parameter_name,
):
    value = request.query_params.get(
        parameter_name,
    )

    if not value:
        return None

    parsed_date = parse_date(value)

    if parsed_date is None:
        raise serializers.ValidationError(
            {
                parameter_name: (
                    "La date doit utiliser le format "
                    "AAAA-MM-JJ."
                ),
            }
        )

    return parsed_date


def format_datetime(value):
    if value is None:
        return ""

    if timezone.is_aware(value):
        value = timezone.localtime(value)

    return value.strftime(
        "%Y-%m-%d %H:%M:%S",
    )


class MembersCSVExportView(APIView):
    permission_classes = (
        IsSuperAdminOrCoordinator,
    )

    def get(self, request):
        members = Member.objects.select_related(
            "user",
        ).order_by(
            "user__username",
        )

        response = HttpResponse(
            content_type="text/csv; charset=utf-8",
        )
        response[
            "Content-Disposition"
        ] = 'attachment; filename="membres.csv"'

        response.write("\ufeff")

        writer = csv.writer(response)

        writer.writerow(
            [
                "ID",
                "Nom d’utilisateur",
                "Nom complet",
                "Email",
                "Téléphone",
                "Date de naissance",
                "Adresse",
                "Téléphone d’urgence",
                "Date d’inscription",
                "Actif",
                "QR code",
            ]
        )

        for member in members:
            writer.writerow(
                [
                    member.id,
                    member.user.username,
                    (
                        member.user.get_full_name()
                        or member.user.username
                    ),
                    member.user.email,
                    member.user.phone,
                    member.birth_date or "",
                    member.address,
                    member.emergency_phone,
                    format_datetime(
                        member.joined_at,
                    ),
                    (
                        "Oui"
                        if member.is_active
                        else "Non"
                    ),
                    str(member.qr_code),
                ]
            )

        return response


class PaymentsCSVExportView(APIView):
    permission_classes = (
        IsSuperAdminOrCoordinator,
    )

    def get(self, request):
        start_date = parse_date_parameter(
            request,
            "start_date",
        )
        end_date = parse_date_parameter(
            request,
            "end_date",
        )

        if (
            start_date
            and end_date
            and start_date > end_date
        ):
            raise serializers.ValidationError(
                {
                    "end_date": (
                        "La date de fin doit être égale "
                        "ou postérieure à la date de début."
                    ),
                }
            )

        payments = Payment.objects.select_related(
            "subscription__member__user",
            "subscription__plan",
        ).order_by(
            "-paid_at",
        )

        if start_date:
            payments = payments.filter(
                paid_at__date__gte=start_date,
            )

        if end_date:
            payments = payments.filter(
                paid_at__date__lte=end_date,
            )

        response = HttpResponse(
            content_type="text/csv; charset=utf-8",
        )
        response[
            "Content-Disposition"
        ] = 'attachment; filename="paiements.csv"'

        response.write("\ufeff")

        writer = csv.writer(response)

        writer.writerow(
            [
                "ID",
                "Membre",
                "Formule",
                "Montant",
                "Méthode",
                "Date du paiement",
                "Référence",
                "Notes",
            ]
        )

        for payment in payments:
            writer.writerow(
                [
                    payment.id,
                    (
                        payment.subscription.member.user
                        .get_full_name()
                        or payment.subscription.member.user
                        .username
                    ),
                    payment.subscription.plan.name,
                    str(payment.amount),
                    payment.get_method_display(),
                    format_datetime(
                        payment.paid_at,
                    ),
                    payment.reference,
                    payment.notes,
                ]
            )

        return response


class AttendancesCSVExportView(APIView):
    permission_classes = (
        IsSuperAdminOrCoordinator,
    )

    def get(self, request):
        start_date = parse_date_parameter(
            request,
            "start_date",
        )
        end_date = parse_date_parameter(
            request,
            "end_date",
        )

        if (
            start_date
            and end_date
            and start_date > end_date
        ):
            raise serializers.ValidationError(
                {
                    "end_date": (
                        "La date de fin doit être égale "
                        "ou postérieure à la date de début."
                    ),
                }
            )

        attendances = Attendance.objects.select_related(
            "member__user",
            "recorded_by",
        ).order_by(
            "-check_in",
        )

        if start_date:
            attendances = attendances.filter(
                check_in__date__gte=start_date,
            )

        if end_date:
            attendances = attendances.filter(
                check_in__date__lte=end_date,
            )

        response = HttpResponse(
            content_type="text/csv; charset=utf-8",
        )
        response[
            "Content-Disposition"
        ] = 'attachment; filename="presences.csv"'

        response.write("\ufeff")

        writer = csv.writer(response)

        writer.writerow(
            [
                "ID",
                "Membre",
                "Entrée",
                "Sortie",
                "Durée en minutes",
                "Méthode",
                "Enregistré par",
                "Notes",
            ]
        )

        for attendance in attendances:
            end_time = (
                attendance.check_out
                or timezone.now()
            )
            duration = (
                end_time
                - attendance.check_in
            )
            duration_minutes = max(
                int(
                    duration.total_seconds()
                    // 60
                ),
                0,
            )

            writer.writerow(
                [
                    attendance.id,
                    (
                        attendance.member.user
                        .get_full_name()
                        or attendance.member.user.username
                    ),
                    format_datetime(
                        attendance.check_in,
                    ),
                    format_datetime(
                        attendance.check_out,
                    ),
                    duration_minutes,
                    attendance.get_entry_method_display(),
                    (
                        str(attendance.recorded_by)
                        if attendance.recorded_by
                        else ""
                    ),
                    attendance.notes,
                ]
            )

        return response