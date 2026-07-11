from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    EmployeeViewSet,
    LeadViewSet,
    LeadNoteViewSet,
    ActivityLogViewSet,
    FollowUpViewSet,
    LeadFilterOptionsView,
)
from .dashboard_views import (
    DashboardSummaryView,
    ApplicationsByCountryView,
    LeadsBySourceView,
    StudentsByIntakeView,
    MonthlyAdmissionsView,
)
from .export_views import LeadExportView

router = DefaultRouter()
router.register('employees', EmployeeViewSet)
router.register('leads', LeadViewSet)
router.register('lead-notes', LeadNoteViewSet)
router.register('activity-logs', ActivityLogViewSet)
router.register('followups', FollowUpViewSet)

urlpatterns = [
    path('dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('dashboard/applications-by-country/', ApplicationsByCountryView.as_view(), name='applications-by-country'),
    path('dashboard/leads-by-source/', LeadsBySourceView.as_view(), name='leads-by-source'),
    path('dashboard/students-by-intake/', StudentsByIntakeView.as_view(), name='students-by-intake'),
    path('dashboard/monthly-admissions/', MonthlyAdmissionsView.as_view(), name='monthly-admissions'),
    path('leads/filter-options/', LeadFilterOptionsView.as_view(), name='lead-filter-options'),
    path('leads/export/', LeadExportView.as_view(), name='leads-export'),
    path('', include(router.urls)),
]
