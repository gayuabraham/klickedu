export default function EducationIllustration({ className = '' }) {
  return (
    <svg
      viewBox="0 0 360 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="illus-bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#EDE9FE" />
          <stop offset="1" stopColor="#FCE7F3" />
        </linearGradient>
        <linearGradient id="bar-grad" x1="0" y1="1" x2="0" y2="0">
          <stop stopColor="#6D28D9" />
          <stop offset="1" stopColor="#A78BFA" />
        </linearGradient>
        <linearGradient id="shirt-grad" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#7C3AED" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
      </defs>

      {/* scene background */}
      <rect x="8" y="12" width="344" height="196" rx="14" fill="url(#illus-bg)" />
      <rect x="8" y="12" width="344" height="196" rx="14" stroke="#DDD6FE" strokeWidth="1.5" />

      {/* CRM dashboard screen */}
      <rect x="24" y="28" width="200" height="132" rx="10" fill="#FFFFFF" stroke="#C4B5FD" strokeWidth="2" />
      <rect x="24" y="28" width="200" height="24" rx="10" fill="#7C3AED" />
      <rect x="24" y="44" width="200" height="8" fill="#7C3AED" />
      <circle cx="40" cy="40" r="3.5" fill="#FCA5A5" />
      <circle cx="52" cy="40" r="3.5" fill="#FDE047" />
      <circle cx="64" cy="40" r="3.5" fill="#86EFAC" />
      <rect x="36" y="58" width="56" height="7" rx="3" fill="#7C3AED" />
      <rect x="36" y="70" width="80" height="4" rx="2" fill="#E2E8F0" />

      {/* mini KPI cards on screen */}
      <rect x="36" y="82" width="52" height="34" rx="6" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
      <rect x="44" y="90" width="22" height="3" rx="1.5" fill="#93C5FD" />
      <rect x="44" y="98" width="30" height="8" rx="3" fill="#3B82F6" />

      <rect x="96" y="82" width="52" height="34" rx="6" fill="#F5F3FF" stroke="#DDD6FE" strokeWidth="1" />
      <rect x="104" y="90" width="22" height="3" rx="1.5" fill="#C4B5FD" />
      <rect x="104" y="98" width="30" height="8" rx="3" fill="#7C3AED" />

      <rect x="156" y="82" width="52" height="34" rx="6" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
      <rect x="164" y="90" width="22" height="3" rx="1.5" fill="#6EE7B7" />
      <rect x="164" y="98" width="30" height="8" rx="3" fill="#10B981" />

      {/* bar chart */}
      <rect x="40" y="130" width="9" height="20" rx="2" fill="#A78BFA" />
      <rect x="55" y="122" width="9" height="28" rx="2" fill="#8B5CF6" />
      <rect x="70" y="126" width="9" height="24" rx="2" fill="#A78BFA" />
      <rect x="85" y="116" width="9" height="34" rx="2" fill="url(#bar-grad)" />
      <rect x="100" y="124" width="9" height="26" rx="2" fill="#8B5CF6" />
      <rect x="115" y="112" width="9" height="38" rx="2" fill="url(#bar-grad)" />
      <line x1="36" y1="150" x2="180" y2="150" stroke="#E2E8F0" strokeWidth="1.5" />

      {/* pie chart */}
      <circle cx="188" cy="136" r="20" fill="#E2E8F0" />
      <path d="M188 116 A20 20 0 0 1 206 146 L188 136 Z" fill="#7C3AED" />
      <path d="M188 136 L206 146 A20 20 0 0 1 172 154 Z" fill="#3B82F6" />
      <path d="M188 136 L172 154 A20 20 0 0 1 170 120 Z" fill="#F97316" />
      <path d="M188 136 L170 120 A20 20 0 0 1 188 116 Z" fill="#10B981" />
      <circle cx="188" cy="136" r="8" fill="white" />

      {/* desk */}
      <rect x="232" y="148" width="108" height="7" rx="3" fill="#A78BFA" />
      <rect x="240" y="155" width="5" height="24" rx="2" fill="#7C3AED" />
      <rect x="327" y="155" width="5" height="24" rx="2" fill="#7C3AED" />

      {/* team member 1 */}
      <circle cx="268" cy="118" r="15" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
      <path d="M253 108 C253 94 283 94 283 108 C283 99 276 93 268 93 C260 93 253 99 253 108" fill="#4C1D95" />
      <rect x="254" y="130" width="28" height="24" rx="7" fill="url(#shirt-grad)" />
      {/* headset */}
      <path d="M254 112 Q268 104 282 112" stroke="#475569" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="251" y="110" width="5" height="10" rx="2.5" fill="#475569" />
      <rect x="280" y="110" width="5" height="10" rx="2.5" fill="#475569" />

      {/* team member 2 */}
      <circle cx="310" cy="124" r="13" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
      <path d="M297 116 C297 105 319 105 319 116 C319 110 315 105 310 105 C305 105 301 110 301 116" fill="#312E81" />
      <rect x="300" y="135" width="22" height="20" rx="6" fill="#3B82F6" />

      {/* laptop */}
      <rect x="284" y="136" width="38" height="24" rx="4" fill="#475569" />
      <rect x="288" y="140" width="30" height="16" rx="2" fill="#EDE9FE" />
      <rect x="292" y="144" width="12" height="3" rx="1" fill="#7C3AED" />
      <rect x="292" y="149" width="20" height="2" rx="1" fill="#C4B5FD" />
      <rect x="278" y="160" width="46" height="4" rx="2" fill="#64748B" />

      {/* leads folder */}
      <rect x="236" y="130" width="24" height="18" rx="3" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="1.5" />
      <rect x="241" y="135" width="14" height="2.5" rx="1" fill="#F97316" />
      <rect x="241" y="140" width="10" height="2" rx="1" fill="#FDBA74" />
      <rect x="241" y="144" width="12" height="2" rx="1" fill="#FDBA74" />

      {/* graduation cap */}
      <path d="M44 178 L56 172 L68 178 L56 184 Z" fill="#7C3AED" />
      <rect x="54" y="172" width="4" height="8" fill="#6D28D9" />
      <circle cx="60" cy="174" r="2" fill="#FBBF24" />

      {/* classroom seats */}
      <rect x="24" y="172" width="40" height="26" rx="5" fill="#FFFFFF" stroke="#C4B5FD" strokeWidth="1.5" />
      <rect x="32" y="180" width="24" height="4" rx="2" fill="#7C3AED" />
      <rect x="72" y="172" width="40" height="26" rx="5" fill="#FFFFFF" stroke="#C4B5FD" strokeWidth="1.5" />
      <rect x="80" y="180" width="24" height="4" rx="2" fill="#3B82F6" />
      <rect x="120" y="172" width="40" height="26" rx="5" fill="#FFFFFF" stroke="#C4B5FD" strokeWidth="1.5" />
      <rect x="128" y="180" width="24" height="4" rx="2" fill="#10B981" />

      {/* floating accent dots */}
      <circle cx="300" cy="48" r="6" fill="#F97316" opacity="0.8" />
      <circle cx="318" cy="68" r="4" fill="#3B82F6" opacity="0.7" />
      <circle cx="290" cy="80" r="3" fill="#10B981" />
    </svg>
  );
}
