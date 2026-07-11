import { getSubStages } from './leadStages';

export const SUMMARY_STAT_ITEMS = [
  {
    key: 'totalStudents',
    title: 'Total Students',
    previewTitle: 'All Students',
    iconBg: 'bg-slate-100 text-slate-700',
    activeRing: 'ring-violet-300 bg-violet-50/50',
    trendColor: 'text-emerald-600',
    iconName: 'users',
  },
  {
    key: 'newEnquiries',
    title: 'New Enquiries',
    previewTitle: 'New Enquiries',
    iconBg: 'bg-blue-100 text-blue-600',
    activeRing: 'ring-blue-300 bg-blue-50/50',
    trendColor: 'text-blue-600',
    iconName: 'userPlus',
  },
  {
    key: 'applicationsInProgress',
    title: 'Applications',
    previewTitle: 'Applications in Progress',
    iconBg: 'bg-orange-100 text-orange-600',
    activeRing: 'ring-orange-300 bg-orange-50/50',
    trendColor: 'text-orange-600',
    iconName: 'phone',
  },
  {
    key: 'offerLettersReceived',
    title: 'Offer Letters',
    previewTitle: 'Offer Letters Received',
    iconBg: 'bg-violet-100 text-violet-600',
    activeRing: 'ring-violet-300 bg-violet-50/60',
    trendColor: 'text-violet-600',
    iconName: 'badge',
  },
  {
    key: 'visaProcessing',
    title: 'Visa Processing',
    previewTitle: 'Visa Processing',
    iconBg: 'bg-amber-100 text-amber-700',
    activeRing: 'ring-amber-300 bg-amber-50/50',
    trendColor: 'text-amber-600',
    iconName: 'convert',
  },
  {
    key: 'visaApproved',
    title: 'Visa Approved',
    previewTitle: 'Visa Approved',
    iconBg: 'bg-teal-100 text-teal-600',
    activeRing: 'ring-teal-300 bg-teal-50/50',
    trendColor: 'text-teal-600',
    iconName: 'check',
  },
  {
    key: 'studentsEnrolled',
    title: 'Enrolled',
    previewTitle: 'Students Enrolled',
    iconBg: 'bg-emerald-100 text-emerald-600',
    activeRing: 'ring-emerald-300 bg-emerald-50/50',
    trendColor: 'text-emerald-600',
    iconName: 'check',
  },
  {
    key: 'pendingFollowups',
    title: 'Follow-ups',
    previewTitle: 'Pending Follow Ups',
    iconBg: 'bg-rose-100 text-rose-600',
    activeRing: 'ring-rose-300 bg-rose-50/50',
    trendColor: 'text-rose-600',
    iconName: 'phone',
  },
];

export function getLeadsExploreUrl() {
  return '/leads';
}

const APPLICATION_SUB_STAGES = getSubStages('Application');
const VISA_PROCESSING_SUB_STAGES = getSubStages('Visa').filter(
  (subStage) => subStage !== 'Visa Approved' && subStage !== 'Visa Rejected'
);

export function filterLeadsByStat(leads, statKey) {
  switch (statKey) {
    case 'totalStudents':
      return leads;
    case 'newEnquiries':
      return leads.filter((lead) => lead.stage === 'New Enquiry');
    case 'applicationsInProgress':
      return leads.filter(
        (lead) =>
          lead.stage === 'Application' &&
          APPLICATION_SUB_STAGES.includes(lead.subStage)
      );
    case 'offerLettersReceived':
      return leads.filter((lead) => lead.stage === 'Offer Letter');
    case 'visaProcessing':
      return leads.filter(
        (lead) =>
          lead.stage === 'Visa' &&
          VISA_PROCESSING_SUB_STAGES.includes(lead.subStage)
      );
    case 'visaApproved':
      return leads.filter(
        (lead) => lead.stage === 'Visa' && lead.subStage === 'Visa Approved'
      );
    case 'studentsEnrolled':
      return leads.filter((lead) => lead.stage === 'Enrolled');
    case 'pendingFollowups':
      return leads.filter((lead) => lead.subStage === 'Waiting for Documents');
    default:
      return leads;
  }
}
