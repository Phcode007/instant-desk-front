import { useState, type ImgHTMLAttributes } from 'react';

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'src'> {
  name: string;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-12 w-12 text-sm',
} as const;

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase())
    .join('');
}

function Avatar({ name, src, size = 'md', className = '', ...props }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  return src && failedSrc !== src ? (
    <img
      {...props}
      src={src}
      alt={name}
      onError={() => setFailedSrc(src)}
      className={[
        'inline-flex shrink-0 rounded-full border border-slate-200 bg-white object-cover',
        sizes[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  ) : (
    <span
      role="img"
      aria-label={name}
      className={[
        'inline-flex shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-100 font-semibold text-brand-700',
        sizes[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {getInitials(name) || '?'}
    </span>
  );
}

export default Avatar;
