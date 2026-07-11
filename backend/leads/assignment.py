"""Round Robin lead assignment across active counselors."""

from .models import ActivityLog, Employee, Lead


def get_next_employee(exclude_lead_id=None):
    """Pick the next active employee after the most recently assigned lead."""
    employees = list(
        Employee.objects
        .filter(status='active')
        .order_by('id')
    )
    if not employees:
        return None

    recent = Lead.objects.filter(assigned_employee__isnull=False)
    if exclude_lead_id:
        recent = recent.exclude(pk=exclude_lead_id)

    last_lead = recent.order_by('-created_at', '-id').first()
    if not last_lead:
        return employees[0]

    employee_ids = [employee.id for employee in employees]

    try:
        last_index = employee_ids.index(last_lead.assigned_employee_id)
        next_index = (last_index + 1) % len(employees)
    except ValueError:
        next_index = 0

    return employees[next_index]


def assign_lead_round_robin(lead):
    """Assign a lead and write an activity log. Returns the employee or None."""
    employee = get_next_employee(exclude_lead_id=lead.pk)
    if not employee:
        return None

    lead.assigned_employee = employee
    lead.save(update_fields=['assigned_employee', 'updated_at'])

    ActivityLog.objects.create(
        lead=lead,
        activity=f'Round Robin Assignment — {employee.name}',
        created_by=None,
    )

    return employee
