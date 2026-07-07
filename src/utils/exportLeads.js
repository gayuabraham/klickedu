function escapeCsvValue(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

export function exportLeadsToCsv(leads, filename = 'klickedu-leads.csv') {
  const headers = ['Name', 'Mobile', 'Email', 'Course', 'Status', 'Assigned Employee', 'Created Date'];
  const rows = leads.map((lead) => [
    lead.name,
    lead.mobile,
    lead.email,
    lead.courseInterested,
    lead.status,
    lead.assignedEmployee,
    lead.createdDate,
  ]);

  const csv = [headers, ...rows].map((row) => row.map(escapeCsvValue).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
