import type { HTMLAttributes } from 'react';

export type BadgeVariant =
  | 'neutral'
  | 'brand'
  | 'open'
  | 'inProgress'
  | 'pending'
  | 'resolved'
  | 'closed'
  | 'low'
  | 'medium'
  | 'high'
  | 'success'
  | 'warning'
  | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  neutral: 'border-slate-200 bg-slate-100 text-slate-700',
  brand: 'border-brand-200 bg-brand-50 text-brand-700',
  open: 'border-brand-200 bg-status-aberto-bg text-brand-700',
  inProgress: 'border-amber-200 bg-status-andamento-bg text-amber-800',
  pending: 'border-purple-200 bg-status-pendente-bg text-purple-800',
  resolved: 'border-emerald-200 bg-status-resolvido-bg text-emerald-800',
  closed: 'border-slate-200 bg-status-fechado-bg text-slate-700',
  low: 'border-emerald-200 bg-priority-baixa-bg text-emerald-800',
  medium: 'border-amber-200 bg-priority-media-bg text-amber-800',
  high: 'border-red-200 bg-priority-alta-bg text-red-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  danger: 'border-red-200 bg-red-50 text-red-700',
};

const dots: Record<BadgeVariant, string> = {
  neutral: 'bg-slate-500',
  brand: 'bg-brand-500',
  open: 'bg-brand-500',
  inProgress: 'bg-amber-500',
  pending: 'bg-purple-500',
  resolved: 'bg-emerald-500',
  closed: 'bg-slate-500',
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

function Badge({ variant = 'neutral', size = 'sm', dot = false, className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex w-fit items-center gap-1.5 rounded-full border font-semibold',
        size === 'sm' ? 'px-2 py-0.5 text-[11px] leading-4' : 'px-2.5 py-1 text-xs',
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {dot && <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dots[variant]}`} />}
      {children}
    </span>
  );
}

export default Badge;
