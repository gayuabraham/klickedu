import { useState } from 'react';
import Button from '../common/Button';
import { formatDate } from '../../utils/dateUtils';
import { FOLLOWUP_TYPES } from '../../constants/options';

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700',
  completed: 'bg-emerald-50 text-emerald-700',
  missed: 'bg-rose-50 text-rose-700',
  cancelled: 'bg-slate-100 text-slate-500',
};

const EMPTY_FORM = {
  followupDate: '',
  followupType: 'call',
  remarks: '',
};

export default function FollowUpSection({
  followups = [],
  onSchedule,
  onComplete,
  loading = false,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSchedule(event) {
    event.preventDefault();
    if (!form.followupDate) {
      setError('Follow-up date is required');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSchedule({ ...form });
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message || 'Failed to schedule follow-up');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleComplete(id) {
    try {
      await onComplete(id);
    } catch (err) {
      setError(err.message || 'Failed to complete follow-up');
    }
  }

  return (
    <div className="mt-6 border-t border-slate-100 pt-6">
      <h3 className="text-sm font-semibold text-slate-900">Follow Ups</h3>
      <p className="mt-1 text-xs text-slate-500">Schedule and track student follow-ups</p>

      <form onSubmit={handleSchedule} className="mt-4 space-y-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Date</label>
            <input
              type="date"
              value={form.followupDate}
              onChange={(e) => setForm((prev) => ({ ...prev, followupDate: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Type</label>
            <select
              value={form.followupType}
              onChange={(e) => setForm((prev) => ({ ...prev, followupType: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            >
              {FOLLOWUP_TYPES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Remarks</label>
          <textarea
            rows={2}
            value={form.remarks}
            onChange={(e) => setForm((prev) => ({ ...prev, remarks: e.target.value }))}
            placeholder="What should be discussed?"
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={submitting}>
            {submitting ? 'Scheduling...' : 'Schedule Follow Up'}
          </Button>
        </div>
      </form>

      {loading ? (
        <p className="mt-4 text-sm text-slate-400">Loading follow-ups...</p>
      ) : followups.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-200 py-6 text-center text-sm text-slate-400">
          No follow-ups scheduled.
        </p>
      ) : (
        <div className="mt-4 space-y-2.5">
          {followups.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-slate-800">
                    {formatDate(item.followupDate)}
                  </p>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium capitalize text-slate-600">
                    {item.followupType}
                  </span>
                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLES[item.status] || STATUS_STYLES.pending}`}>
                    {item.status}
                  </span>
                </div>
                {item.remarks && (
                  <p className="mt-1 text-sm text-slate-500">{item.remarks}</p>
                )}
              </div>
              {item.status === 'pending' && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => handleComplete(item.id)}
                  className="shrink-0"
                >
                  Mark Completed
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
