from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .activity import log_activity, log_lead_stage_events
from .assignment import assign_lead_round_robin
from .filters import apply_lead_filters, apply_lead_sort, get_filter_options
from .models import Employee, Lead, LeadNote, ActivityLog, FollowUp
from .serializers import (
    EmployeeSerializer,
    LeadSerializer,
    LeadNoteSerializer,
    ActivityLogSerializer,
    FollowUpSerializer,
)


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer

    def get_queryset(self):
        queryset = Lead.objects.select_related('assigned_employee').all()
        queryset = apply_lead_filters(queryset, self.request.query_params)
        return apply_lead_sort(queryset, self.request.query_params)

    def perform_create(self, serializer):
        # Clear any client-sent assignee — Round Robin decides
        lead = serializer.save(assigned_employee=None)
        log_activity(lead, 'Lead Created')
        assign_lead_round_robin(lead)
        log_lead_stage_events(lead, previous_sub_stage=None)

    def perform_update(self, serializer):
        previous = self.get_object()
        previous_sub_stage = previous.sub_stage
        lead = serializer.save()
        log_activity(lead, 'Lead Updated')
        log_lead_stage_events(lead, previous_sub_stage=previous_sub_stage)


class LeadNoteViewSet(viewsets.ModelViewSet):
    queryset = LeadNote.objects.all()
    serializer_class = LeadNoteSerializer

    def get_queryset(self):
        queryset = LeadNote.objects.select_related('created_by', 'lead').all()
        lead_id = self.request.query_params.get('lead')
        if lead_id:
            queryset = queryset.filter(lead_id=lead_id)
        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        note = serializer.save()
        log_activity(note.lead, 'Note Added', created_by=note.created_by)

    def perform_update(self, serializer):
        note = serializer.save()
        log_activity(note.lead, 'Note Updated', created_by=note.created_by)

    def perform_destroy(self, instance):
        lead = instance.lead
        created_by = instance.created_by
        instance.delete()
        log_activity(lead, 'Note Deleted', created_by=created_by)


class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer

    def get_queryset(self):
        queryset = ActivityLog.objects.select_related('created_by', 'lead').all()
        lead_id = self.request.query_params.get('lead')
        if lead_id:
            queryset = queryset.filter(lead_id=lead_id)
        return queryset.order_by('-created_at')


class FollowUpViewSet(viewsets.ModelViewSet):
    queryset = FollowUp.objects.all()
    serializer_class = FollowUpSerializer

    def get_queryset(self):
        queryset = FollowUp.objects.select_related('created_by', 'lead').all()
        lead_id = self.request.query_params.get('lead')
        if lead_id:
            queryset = queryset.filter(lead_id=lead_id)
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        return queryset.order_by('followup_date', '-created_at')

    def perform_create(self, serializer):
        followup = serializer.save()
        log_activity(followup.lead, 'Follow Up Added', created_by=followup.created_by)

        if followup.status == 'pending':
            Lead.objects.filter(pk=followup.lead_id).update(
                next_followup_date=followup.followup_date
            )

    def perform_update(self, serializer):
        previous = self.get_object()
        followup = serializer.save()

        if previous.status != 'completed' and followup.status == 'completed':
            log_activity(
                followup.lead,
                'Follow Up Completed',
                created_by=followup.created_by,
            )
        elif previous.status != followup.status:
            log_activity(
                followup.lead,
                f'Follow Up Updated — {followup.status.title()}',
                created_by=followup.created_by,
            )


class LeadFilterOptionsView(APIView):
    """Dropdown options for the leads filter bar."""

    def get(self, request):
        return Response(get_filter_options())
