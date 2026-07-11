// Demo trends until we store historical snapshots
const TRENDS = {
  totalStudents: '+12%',
  newEnquiries: '+8%',
  applicationsInProgress: '+5%',
  offerLettersReceived: '+10%',
  visaProcessing: '+4%',
  visaApproved: '+7%',
  studentsEnrolled: '+6%',
  pendingFollowups: '+3%',
};

export function getTrendLabel(type) {
  return TRENDS[type] || '+0%';
}
