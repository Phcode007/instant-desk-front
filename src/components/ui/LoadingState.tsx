export interface LoadingStateProps {
  label?: string;
  variant?: 'spinner' | 'skeleton';
  lines?: number;
  className?: string;
}

function LoadingState({
  label = 'Carregando…',
  variant = 'spinner',
  lines = 3,
  className = '',
}: LoadingStateProps) {
  return variant === 'skeleton' ? (
    <div role="status" aria-busy="true" className={['animate-pulse space-y-3', className].filter(Boolean).join(' ')}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: Math.max(1, lines) }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className={`h-4 rounded-md bg-slate-200 ${index === 0 ? 'w-1/3' : index === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  ) : (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={['inline-flex items-center gap-2 text-sm text-slate-600', className].filter(Boolean).join(' ')}
    >
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-r-transparent"
      />
      {label}
    </div>
  );
}

export default LoadingState;
