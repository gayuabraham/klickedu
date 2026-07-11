// Study Abroad workflow — mirrors backend stage_config

export const LEAD_STAGES = [
  'New Enquiry',
  'Counselling',
  'Course Selection',
  'Application',
  'Offer Letter',
  'Financial',
  'Visa',
  'Travel',
  'Enrolled',
  'Closed',
];

const STAGE_SUB_STAGES = {
  'New Enquiry': [
    'Fresh Lead',
    'Contact Attempted',
    'Interested',
    'Not Interested',
  ],
  Counselling: [
    'Session Scheduled',
    'Session Completed',
    'Waiting for Documents',
  ],
  'Course Selection': [
    'Country Selected',
    'University Shortlisted',
    'Course Finalized',
  ],
  Application: [
    'Documents Pending',
    'Documents Received',
    'Application Submitted',
    'Under Review',
  ],
  'Offer Letter': [
    'Conditional Offer',
    'Unconditional Offer',
    'Offer Accepted',
  ],
  Financial: [
    'Fee Structure Shared',
    'Loan In Progress',
    'Payment Completed',
  ],
  Visa: [
    'Visa Documents Pending',
    'Visa Applied',
    'Visa Interview',
    'Visa Approved',
    'Visa Rejected',
  ],
  Travel: [
    'Flight Booked',
    'Accommodation Booked',
    'Travel Completed',
  ],
  Enrolled: [
    'University Joined',
    'Orientation Completed',
  ],
  Closed: [
    'Converted',
    'Lost',
  ],
};

export const DEFAULT_STAGE = 'New Enquiry';

export function getSubStages(stage) {
  return STAGE_SUB_STAGES[stage] || [];
}

export function getDefaultSubStage(stage) {
  const options = getSubStages(stage);
  return options[0] || '';
}
