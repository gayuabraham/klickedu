import Modal from './Modal';
import Avatar from './Avatar';
import { CURRENT_USER } from '../../constants/appUser';

function Detail({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}

export default function ProfileModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Profile" subtitle={CURRENT_USER.role}>
      <div className="flex flex-col items-center pb-4">
        <Avatar name={CURRENT_USER.name} size="xl" />
        <h3 className="mt-3 text-lg font-semibold text-slate-900">{CURRENT_USER.name}</h3>
        <p className="text-sm text-slate-500">{CURRENT_USER.department} Team</p>
      </div>

      <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-4">
        <Detail label="Email" value={CURRENT_USER.email} />
        <Detail label="Phone" value={CURRENT_USER.phone} />
        <Detail label="Role" value={CURRENT_USER.role} />
        <Detail label="Department" value={CURRENT_USER.department} />
      </div>
    </Modal>
  );
}
