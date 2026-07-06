import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import Avatar from '../common/Avatar';
import NotesSection from './NotesSection';
import { useLeadsContext } from '../../context/LeadsContext';
import { formatDate } from '../../utils/dateUtils';

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-slate-50 py-3.5 last:border-0 sm:grid-cols-3 sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="text-sm text-slate-900 sm:col-span-2">{value || '—'}</dd>
    </div>
  );
}

export default function LeadDetailsModal({ lead, isOpen, onClose, onAddNote, onUpdateNote, onDeleteNote }) {
  const { currentUser } = useLeadsContext();

  if (!lead) return null;

  function handleAddNote(text) {
    onAddNote(lead.id, {
      id: `n${lead.id}-${Date.now()}`,
      text,
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: currentUser.name,
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details" subtitle={lead.name} size="xl">
      <div className="mb-6 flex items-center gap-4 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
        <Avatar name={lead.name} size="xl" />
        <div>
          <h3 className="text-xl font-bold text-slate-900">{lead.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{lead.email}</p>
          <div className="mt-2">
            <StatusBadge status={lead.status} />
          </div>
        </div>
      </div>

      <dl className="rounded-xl border border-slate-100 bg-slate-50/50 px-5">
        <DetailRow label="Mobile" value={lead.mobile} />
        <DetailRow label="Address" value={lead.address} />
        <DetailRow label="Interested Course" value={lead.courseInterested} />
        <DetailRow label="Lead Source" value={lead.leadSource} />
        <DetailRow
          label="Assigned Employee"
          value={
            <span className="inline-flex items-center gap-2">
              <Avatar name={lead.assignedEmployee} size="xs" />
              {lead.assignedEmployee}
            </span>
          }
        />
        <DetailRow label="Created Date" value={formatDate(lead.createdDate)} />
      </dl>

      <NotesSection
        notes={lead.notes || []}
        onAdd={handleAddNote}
        onUpdate={(noteId, text) => onUpdateNote(lead.id, noteId, { text })}
        onDelete={(noteId) => onDeleteNote(lead.id, noteId)}
      />
    </Modal>
  );
}
