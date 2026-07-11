export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Closed'];

export const STATUS_COLORS = {
  New: '#3B82F6',
  Contacted: '#F97316',
  Qualified: '#7C3AED',
  Closed: '#10B981',
};

export const STATUS_BADGE_CLASS = {
  New: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/60',
  Contacted: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200/60',
  Qualified: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200/60',
  Closed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60',
};

/** Status shown in the UI from the real Stage / Sub Stage. */
export function getStatusFromStage(stage, subStage = '') {
  if (stage === 'Closed' || stage === 'Enrolled') return 'Closed';

  if (['Application', 'Offer Letter', 'Financial', 'Visa', 'Travel'].includes(stage)) {
    return 'Qualified';
  }

  if (
    stage === 'Counselling' ||
    stage === 'Course Selection' ||
    subStage === 'Waiting for Documents'
  ) {
    return 'Contacted';
  }

  return 'New';
}

/** When Status is changed, pick a matching Stage / Sub Stage to save. */
export function getStageFromStatus(status) {
  if (status === 'Closed') {
    return { stage: 'Closed', subStage: 'Converted' };
  }
  if (status === 'Qualified') {
    return { stage: 'Application', subStage: 'Documents Pending' };
  }
  if (status === 'Contacted') {
    return { stage: 'Counselling', subStage: 'Waiting for Documents' };
  }
  return { stage: 'New Enquiry', subStage: 'Fresh Lead' };
}
