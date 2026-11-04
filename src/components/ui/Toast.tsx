import { useEffect } from 'react';
import { CheckCircle, Info, Warning, WarningCircle, X } from '@phosphor-icons/react';
import type { ToastOptions } from './ToastContext';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastProps extends ToastOptions {
  onClose: () => void;
}

const variants: Record<ToastVariant, { icon: typeof CheckCircle; iconClass: string; borderClass: string; role: 'status' | 'alert' }> = {
  success: { icon: CheckCircle, iconClass: 'bg-emerald-50 text-emerald-600', borderClass: 'border-emerald-200', role: 'status' },
  error: { icon: WarningCircle, iconClass: 'bg-red-50 text-red-600', borderClass: 'border-red-200', role: 'alert' },
  warning: { icon: Warning, iconClass: 'bg-amber-50 text-amber-700', borderClass: 'border-amber-200', role: 'status' },
  info: { icon: Info, iconClass: 'bg-brand-50 text-brand-600', borderClass: 'border-brand-200', role: 'status' },
};

function Toast({ title, description, variant = 'info', duration = 5000, onClose }: ToastProps) {
  const style = variants[variant];
  const Icon = style.icon;

  useEffect(() => {
    if (duration <= 0) return;
    const timeout = setTimeout(onClose, duration);
    return () => clearTimeout(timeout);
  }, [duration, onClose]);

  return (
    <div
      role={style.role}
      className={`flex w-full max-w-sm items-start gap-3 rounded-xl border ${style.borderClass} bg-white p-3.5 text-sm shadow-popover`}
    >
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${style.iconClass}`}>
        <Icon size={16} weight="bold" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900">{title}</p>
        {description && <p className="mt-0.5 text-xs leading-5 text-slate-600">{description}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label={`Dispensar notificação: ${title}`}
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export default Toast;
