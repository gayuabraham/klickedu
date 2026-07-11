import Modal from './Modal';
import Avatar from './Avatar';
import { useLeadsContext } from '../../context/LeadsContext';

function Detail({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}

export default function ProfileModal({ isOpen, onClose }) {
  const { currentUser } = useLeadsContext();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Profile" subtitle={currentUser.role}>
      <div className="flex flex-col items-center pb-4">
        <Avatar name={currentUser.name} size="xl" />
        <h3 className="mt-3 text-lg font-semibold text-slate-900">{currentUser.name}</h3>
        <p className="text-sm text-slate-500">{currentUser.department} Team</p>
      </div>

      <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-4">
        <Detail label="Email" value={currentUser.email} />
        <Detail label="Phone" value={currentUser.phone} />
        <Detail label="Role" value={currentUser.role} />
        <Detail label="Department" value={currentUser.department} />
      </div>
    </Modal>
  );
}
