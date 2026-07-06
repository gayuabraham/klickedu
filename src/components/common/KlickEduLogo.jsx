const PURPLE = '#7C3AED';
const MAGENTA = '#DB2777';
const PINK = '#E957A3';

function LogoIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={PURPLE} />
          <stop offset="1" stopColor={MAGENTA} />
        </linearGradient>
      </defs>
      <rect x="3" y="5" width="26" height="22" rx="5" fill="url(#logo-grad)" />
      <path
        d="M11 21 L17 13 L17 16.5 L21 16.5 L21 20.5 L17 20.5 L17 24 Z"
        fill="white"
      />
    </svg>
  );
}

export default function KlickEduLogo({ variant = 'sidebar' }) {
  if (variant === 'sidebar') {
    return (
      <div className="flex items-center gap-2.5 min-w-0">
        <LogoIcon size={32} />
        <div className="hidden lg:block min-w-0">
          <p className="leading-tight">
            <span className="text-[16px] font-bold text-slate-900">klick</span>
            <span className="text-[16px] font-bold" style={{ color: PINK }}>E</span>
            <span className="text-[16px] font-bold text-slate-900">du</span>
          </p>
          <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Lead Management</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <LogoIcon size={34} />
      <span className="font-bold tracking-tight leading-none">
        <span className="text-sm text-slate-900">klick</span>
        <span className="text-sm" style={{ color: PINK }}>E</span>
        <span className="text-sm text-slate-900">du</span>
      </span>
    </div>
  );
}
