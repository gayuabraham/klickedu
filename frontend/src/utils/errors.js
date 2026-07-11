/**
 * Turn Axios / DRF error responses into a readable message.
 */
export function getErrorMessage(error, fallback = 'Something went wrong') {
  if (!error) return fallback;

  const data = error.response?.data;
  if (data) {
    if (typeof data === 'string') return data;
    if (data.detail) return String(data.detail);

    if (typeof data === 'object' && !(data instanceof Blob)) {
      const parts = Object.entries(data).map(([field, messages]) => {
        const text = Array.isArray(messages) ? messages.join(' ') : String(messages);
        return `${field}: ${text}`;
      });
      if (parts.length) return parts.join(', ');
    }
  }

  return error.message || fallback;
}
