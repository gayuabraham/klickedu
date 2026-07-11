import api from '../services/api';
import { getErrorMessage } from './errors';

/** Download all students as CSV from the Django export API. */
export async function exportLeadsToCsv() {
  try {
    const response = await api.get('/leads/export/', {
      responseType: 'blob',
    });

    const disposition = response.headers['content-disposition'] || '';
    const match = disposition.match(/filename="?([^"]+)"?/i);
    const filename = match?.[1] || `students_export_${Date.now()}.csv`;

    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to export students'));
  }
}
