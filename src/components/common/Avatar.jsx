import { getInitials, getAvatarColor } from '../../utils/avatar';

const sizes = {
  xs: 'h-5 w-5 text-[8px]',
  sm: 'h-7 w-7 text-[9px]',
  md: 'h-8 w-8 text-[10px]',
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
