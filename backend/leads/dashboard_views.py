from django.db.models import Count, Q
from django.db.models.functions import TruncMonth
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import FollowUp, Lead
from .stage_config import (
    APPLICATION_IN_PROGRESS_SUB_STAGES,
    STAGE_APPLICATION,
    STAGE_ENROLLED,
    STAGE_NEW_ENQUIRY,
    STAGE_OFFER_LETTER,
    STAGE_VISA,
    SUB_STAGE_NEEDS_FOLLOWUP,
    SUB_STAGE_VISA_APPROVED,
    VISA_PROCESSING_SUB_STAGES,
)

MONTH_LABELS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]


class DashboardSummaryView(APIView):
    """Summary cards for the Study Abroad dashboard."""

    def get(self, request):
        lead_stats = Lead.objects.aggregate(
            total_students=Count('id'),
            new_enquiries=Count('id', filter=Q(stage=STAGE_NEW_ENQUIRY)),
            applications_in_progress=Count(
                'id',
                filter=Q(
                    stage=STAGE_APPLICATION,
                    sub_stage__in=APPLICATION_IN_PROGRESS_SUB_STAGES,
                ),
            ),
            offer_letters_received=Count(
                'id',
                filter=Q(stage=STAGE_OFFER_LETTER),
            ),
            visa_processing=Count(
                'id',
                filter=Q(
                    stage=STAGE_VISA,
                    sub_stage__in=VISA_PROCESSING_SUB_STAGES,
                ),
            ),
            visa_approved=Count(
                'id',
                filter=Q(stage=STAGE_VISA, sub_stage=SUB_STAGE_VISA_APPROVED),
            ),
            students_enrolled=Count('id', filter=Q(stage=STAGE_ENROLLED)),
        )

        pending_followups = FollowUp.objects.filter(status='pending').count()
        if pending_followups == 0:
            pending_followups = Lead.objects.filter(
                sub_stage=SUB_STAGE_NEEDS_FOLLOWUP
            ).count()

        return Response({
            **lead_stats,
            'pending_followups': pending_followups,
        })


class ApplicationsByCountryView(APIView):
    """Chart: students grouped by preferred country (live mock data)."""

    def get(self, request):
        rows = (
            Lead.objects
            .exclude(preferred_country='')
            .values('preferred_country')
            .annotate(count=Count('id'))
            .order_by('-count', 'preferred_country')
        )

        data = [
            {
                'country': row['preferred_country'],
                'count': row['count'],
            }
            for row in rows
        ]
        return Response(data)


class LeadsBySourceView(APIView):
    """Chart: lead source distribution from student records."""

    def get(self, request):
        rows = (
            Lead.objects
            .exclude(lead_source='')
            .values('lead_source')
            .annotate(count=Count('id'))
            .order_by('-count', 'lead_source')
        )

        data = [
            {
                'source': row['lead_source'],
                'count': row['count'],
            }
            for row in rows
        ]
        return Response(data)


# Preferred intake display order (matches mock data)
INTAKE_ORDER = [
    'January 2026',
    'May 2026',
    'September 2026',
    'January 2027',
]


class StudentsByIntakeView(APIView):
    """Chart: students grouped by preferred intake."""

    def get(self, request):
        rows = (
            Lead.objects
            .exclude(preferred_intake='')
            .values('preferred_intake')
            .annotate(count=Count('id'))
        )

        counts = {row['preferred_intake']: row['count'] for row in rows}

        # Keep a stable intake order so the chart matches the mock data set
        ordered = []
        for intake in INTAKE_ORDER:
            if intake in counts:
                ordered.append({'intake': intake, 'count': counts.pop(intake)})

        for intake, count in sorted(counts.items()):
            ordered.append({'intake': intake, 'count': count})

        return Response(ordered)


class MonthlyAdmissionsView(APIView):
    """Chart: monthly student volume from live records (created_at)."""

    def get(self, request):
        rows = (
            Lead.objects
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        data = []
        for row in rows:
            if not row['month']:
                continue
            data.append({
                'month': MONTH_LABELS[row['month'].month - 1],
                'year': row['month'].year,
                'count': row['count'],
            })

        return Response(data)
