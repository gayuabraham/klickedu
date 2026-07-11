"""
Simple activity logging for the Student Timeline.
"""

from .models import ActivityLog


def log_activity(lead, activity, created_by=None):
    """Create one ActivityLog row for a lead."""
    if lead is None:
        return None

    return ActivityLog.objects.create(
        lead=lead,
        activity=activity,
        created_by=created_by,
    )


def log_lead_stage_events(lead, previous_sub_stage=None, created_by=None):
    """
    Log milestone events when sub stage changes.
    Application Submitted / Visa Approved.
    """
    sub_stage = lead.sub_stage or ''

    if sub_stage == previous_sub_stage:
        return

    if sub_stage == 'Application Submitted':
        log_activity(lead, 'Application Submitted', created_by=created_by)
    elif sub_stage == 'Visa Approved':
        log_activity(lead, 'Visa Approved', created_by=created_by)
