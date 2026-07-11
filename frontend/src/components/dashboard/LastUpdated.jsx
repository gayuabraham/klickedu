import { useState, useEffect } from 'react';

function formatRelativeTime(date) {
  if (!date) return '—';

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return '1 min ago';
  if (minutes < 60) return `${minutes} mins ago`;

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hour ago';
  return `${hours} hours ago`;
}

export default function LastUpdated({ updatedAt }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="shrink-0 text-right">
      <p className="text-[10px] text-slate-400">Last updated</p>
      <p className="text-[11px] font-medium text-slate-600">{formatRelativeTime(updatedAt)}</p>
    </div>
  );
}
