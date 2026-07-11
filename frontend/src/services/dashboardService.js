import api from './api';
import { getErrorMessage } from '../utils/errors';

export async function fetchDashboardData() {
  try {
    const [summaryRes, countryRes, sourceRes, intakeRes, monthlyRes] = await Promise.all([
      api.get('/dashboard/summary/'),
      api.get('/dashboard/applications-by-country/'),
      api.get('/dashboard/leads-by-source/'),
      api.get('/dashboard/students-by-intake/'),
      api.get('/dashboard/monthly-admissions/'),
    ]);

    const summary = summaryRes.data;

    return {
      stats: {
        totalStudents: summary.total_students,
        newEnquiries: summary.new_enquiries,
        applicationsInProgress: summary.applications_in_progress,
        offerLettersReceived: summary.offer_letters_received,
        visaProcessing: summary.visa_processing,
        visaApproved: summary.visa_approved,
        studentsEnrolled: summary.students_enrolled,
        pendingFollowups: summary.pending_followups,
        total: summary.total_students,
      },
      byCountry: countryRes.data,
      bySource: sourceRes.data,
      byIntake: intakeRes.data,
      monthlyAdmissions: monthlyRes.data,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to load dashboard data'));
  }
}
