import csv
from datetime import datetime

from django.http import HttpResponse
from rest_framework.views import APIView

from .models import Lead

CSV_COLUMNS = [
    ('lead_id', 'Lead ID'),
    ('first_name', 'First Name'),
    ('last_name', 'Last Name'),
    ('gender', 'Gender'),
    ('date_of_birth', 'Date of Birth'),
    ('mobile', 'Mobile'),
    ('alternate_mobile', 'Alternate Mobile'),
    ('email', 'Email'),
    ('address', 'Address'),
    ('city', 'City'),
    ('district', 'District'),
    ('state', 'State'),
    ('country', 'Home Country'),
    ('highest_qualification', 'Highest Qualification'),
    ('graduation_year', 'Graduation Year'),
    ('cgpa_percentage', 'CGPA / Percentage'),
    ('current_college', 'Current College'),
    ('work_experience', 'Work Experience'),
    ('preferred_country', 'Preferred Country'),
    ('preferred_city', 'Preferred City'),
    ('preferred_course', 'Preferred Course'),
    ('preferred_university', 'Preferred University'),
    ('preferred_intake', 'Preferred Intake'),
    ('english_test', 'English Test'),
    ('english_score', 'English Score'),
    ('budget', 'Budget'),
    ('loan_required', 'Loan Required'),
    ('passport_available', 'Passport Available'),
    ('passport_number', 'Passport Number'),
    ('lead_source', 'Lead Source'),
    ('priority', 'Priority'),
    ('stage', 'Stage'),
    ('sub_stage', 'Sub Stage'),
    ('assigned_employee', 'Assigned Employee'),
    ('next_followup_date', 'Next Follow-up Date'),
    ('remarks', 'Remarks'),
    ('created_at', 'Created At'),
    ('updated_at', 'Updated At'),
]


def format_cell(lead, field_name):
    if field_name == 'assigned_employee':
        employee = lead.assigned_employee
        return employee.name if employee else ''

    value = getattr(lead, field_name, '')
    if value is None:
        return ''
    if isinstance(value, bool):
        return 'Yes' if value else 'No'
    if isinstance(value, datetime):
        return value.strftime('%Y-%m-%d %H:%M:%S')
    if hasattr(value, 'isoformat'):
        return value.isoformat()
    return str(value)


class LeadExportView(APIView):
    """GET /api/leads/export/ — download all students as CSV."""

    def get(self, request):
        leads = (
            Lead.objects
            .select_related('assigned_employee')
            .order_by('-created_at', '-id')
        )

        filename = f'students_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        response.write('\ufeff')  # Excel-friendly UTF-8

        writer = csv.writer(response)
        writer.writerow([label for _field, label in CSV_COLUMNS])

        for lead in leads:
            writer.writerow([format_cell(lead, field) for field, _label in CSV_COLUMNS])

        return response
