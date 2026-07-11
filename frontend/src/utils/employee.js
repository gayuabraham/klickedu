export const EMPLOYEE_ROLE = 'Sales Counselor';
export const EMPLOYEE_DEPARTMENT = 'Sales';

export function getEmployeeEmail(name) {
  const slug = name.toLowerCase().replace(/\s+/g, '.');
  return `${slug}@klickedu.com`;
}

export function getEmployeePhone(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const digits = String(Math.abs(hash)).padStart(10, '9').slice(0, 10);
  return digits;
}

export function getEmployeeLeadStats(leads, employeeName) {
  const assigned = leads.filter((lead) => lead.assignedEmployee === employeeName);
  const byStatus = assigned.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  return {
    total: assigned.length,
    byStatus,
    recent: [...assigned]
      .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
      .slice(0, 5),
  };
}
