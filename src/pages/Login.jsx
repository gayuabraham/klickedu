import { Navigate } from 'react-router-dom';
import { useLeadsContext } from '../context/LeadsContext';
import KlickEduLogo from '../components/common/KlickEduLogo';
import Button from '../components/common/Button';
import { CURRENT_USER } from '../constants/appUser';

export default function Login() {
  const { signIn, isSignedIn } = useLeadsContext();

  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex justify-center">
          <KlickEduLogo />
        </div>

        <h1 className="text-center text-lg font-semibold text-slate-900">Sign in to KlickEdu</h1>
        <p className="mt-1 text-center text-xs text-slate-500">Lead Management System</p>

        <div className="mt-6 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Email</label>
            <input
              type="email"
              readOnly
              value={CURRENT_USER.email}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Password</label>
            <input
              type="password"
              readOnly
              value="••••••••"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            />
          </div>
        </div>

        <Button className="mt-6 w-full" onClick={signIn}>
          Sign in
        </Button>
      </div>
    </div>
  );
}
