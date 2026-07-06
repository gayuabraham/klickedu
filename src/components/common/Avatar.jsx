import { getInitials, getAvatarColor } from '../../utils/avatar';

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-xs',
  lg: 'h-11 w-11 text-sm',
  xl: 'h-14 w-14 text-base',
};

export default function Avatar({ name, size = 'sm', className = '' }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${sizes[size]} ${getAvatarColor(name)} ${className}`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}
