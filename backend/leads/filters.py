"""
Query-param filtering for Study Abroad leads.
Used by LeadViewSet — keep logic simple and explicit.
"""

from django.db.models import Q

from .models import Employee, Lead
from .stage_config import LEAD_STAGES_LIST, STAGE_SUB_STAGES


# UI "Status" → stage groups (keeps existing Status filter working)
STATUS_STAGE_MAP = {
    'New': ['New Enquiry'],
    'Contacted': ['Counselling', 'Course Selection'],
    'Qualified': ['Application', 'Offer Letter', 'Financial', 'Visa', 'Travel'],
    'Closed': ['Enrolled', 'Closed'],
}

SORT_FIELDS = {
    'created_date': 'created_at',
    'name': 'first_name',
    'priority': 'priority',
    'stage': 'stage',
}


def apply_lead_filters(queryset, params):
    """
    Apply all active filters together (AND).
    Each non-empty query param narrows the result set further.
    """
    search = (params.get('search') or '').strip()
    if search:
        queryset = queryset.filter(
            Q(first_name__icontains=search)
            | Q(last_name__icontains=search)
            | Q(email__icontains=search)
            | Q(mobile__icontains=search)
            | Q(alternate_mobile__icontains=search)
        )

    preferred_country = params.get('preferred_country') or params.get('country')
    if preferred_country:
        queryset = queryset.filter(preferred_country__iexact=preferred_country)

    preferred_course = params.get('preferred_course') or params.get('course')
    if preferred_course:
        queryset = queryset.filter(preferred_course__iexact=preferred_course)

    preferred_intake = params.get('preferred_intake') or params.get('intake')
    if preferred_intake:
        queryset = queryset.filter(preferred_intake__iexact=preferred_intake)

    lead_source = params.get('lead_source') or params.get('leadSource')
    if lead_source:
        queryset = queryset.filter(lead_source__iexact=lead_source)

    priority = params.get('priority')
    if priority:
        queryset = queryset.filter(priority__iexact=priority)

    stage = params.get('stage')
    if stage:
        queryset = queryset.filter(stage=stage)

    sub_stage = params.get('sub_stage') or params.get('subStage')
    if sub_stage:
        queryset = queryset.filter(sub_stage=sub_stage)

    # Legacy Status filter (dashboard deep-links)
    status = params.get('status')
    if status and status in STATUS_STAGE_MAP:
        queryset = queryset.filter(stage__in=STATUS_STAGE_MAP[status])

    employee = params.get('employee') or params.get('assigned_employee')
    if employee:
        if str(employee).isdigit():
            queryset = queryset.filter(assigned_employee_id=int(employee))
        else:
            queryset = queryset.filter(assigned_employee__name__iexact=employee)

    start_date = params.get('start_date') or params.get('startDate')
    if start_date:
        try:
            queryset = queryset.filter(created_at__date__gte=start_date)
        except (ValueError, TypeError):
            pass

    end_date = params.get('end_date') or params.get('endDate')
    if end_date:
        try:
            queryset = queryset.filter(created_at__date__lte=end_date)
        except (ValueError, TypeError):
            pass

    return queryset


def apply_lead_sort(queryset, params):
    """Sort leads. Default: newest first."""
    sort_key = params.get('sort') or 'created_date'
    order = (params.get('order') or 'desc').lower()
    field = SORT_FIELDS.get(sort_key, 'created_at')

    if order == 'asc':
        return queryset.order_by(field, 'id')
    return queryset.order_by(f'-{field}', '-id')


def _distinct_values(field_name):
    return sorted(
        Lead.objects
        .exclude(**{field_name: ''})
        .values_list(field_name, flat=True)
        .distinct()
    )


def get_filter_options():
    """Distinct values for filter dropdowns."""
    countries = _distinct_values('preferred_country')
    courses = _distinct_values('preferred_course')

    employees = list(
        Employee.objects
        .exclude(status='inactive')
        .order_by('name')
        .values('id', 'name')
    )

    return {
        'preferred_countries': countries,
        'preferred_courses': courses,
        'preferred_intakes': _distinct_values('preferred_intake'),
        'lead_sources': _distinct_values('lead_source'),
        'priorities': [
            {'value': 'low', 'label': 'Low'},
            {'value': 'medium', 'label': 'Medium'},
            {'value': 'high', 'label': 'High'},
        ],
        'stages': LEAD_STAGES_LIST,
        'sub_stages': STAGE_SUB_STAGES,
        'employees': employees,
        # Aliases for existing frontend keys
        'countries': countries,
        'courses': courses,
    }
