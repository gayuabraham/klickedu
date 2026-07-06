export default function KlickEduLogo({ size = 36, showText = true }) {
  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect width="40" height="40" rx="10" fill="url(#klickedu-gradient)" />
        <path
          d="M12 10h5.5l4 6.5 4-6.5H31L23 22v8h-6v-8L12 10z"
          fill="white"
        />
        <circle cx="30" cy="30" r="5" fill="#F97316" />
        <defs>
          <linearGradient id="klickedu-gradient" x1="0" y1="0" x2="40" y2="40">
            <stop stopColor="#6366F1" />
            <stop offset="1" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <div className="min-w-0">
          <p className="text-[15px] font-bold tracking-tight text-gray-900 leading-tight">
            KlickEdu
          </p>
          <p className="text-[11px] text-gray-400 leading-tight">Empowering Your Future</p>
        </div>
      )}
    </div>
  );
}
