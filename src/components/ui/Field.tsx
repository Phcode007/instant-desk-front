import { useId, forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { CaretDown } from '@phosphor-icons/react';

interface FieldProps {
  label?: string;
  labelAdornment?: ReactNode;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
  className?: string;
  id?: string;
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & FieldProps;
type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & FieldProps;
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps;

const controlClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500';

function FieldMessages({
  hint,
  error,
  hintId,
  errorId,
}: {
  hint?: string;
  error?: string;
  hintId: string;
  errorId: string;
}) {
  return (
    <>
      {error ? (
        <p id={errorId} className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, labelAdornment, hint, error, leadingIcon, className = '', id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy = [props['aria-describedby'], error ? errorId : hint ? hintId : undefined]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className="grid gap-1.5">
      {label && (
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-700">
            {label}
            {props.required && <span className="ml-1 text-red-600">*</span>}
          </label>
          {labelAdornment}
        </div>
      )}
      <div className="relative">
        {leadingIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400">
            {leadingIcon}
          </span>
        )}
        <input
          {...props}
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={[
            controlClass,
            leadingIcon ? 'pl-10' : '',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </div>
      <FieldMessages hint={hint} error={error} hintId={hintId} errorId={errorId} />
    </div>
  );
});

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, labelAdornment, hint, error, className = '', id, children, ...props },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const hintId = `${selectId}-hint`;
  const errorId = `${selectId}-error`;

  return (
    <div className="grid gap-1.5">
      {label && (
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={selectId} className="text-xs font-semibold text-slate-700">
            {label}
            {props.required && <span className="ml-1 text-red-600">*</span>}
          </label>
          {labelAdornment}
        </div>
      )}
      <div className="relative">
        <select
          {...props}
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={[props['aria-describedby'], error ? errorId : hint ? hintId : undefined].filter(Boolean).join(' ') || undefined}
          className={[
            controlClass,
            'appearance-none pr-10',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </select>
        <CaretDown
          aria-hidden="true"
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>
      <FieldMessages hint={hint} error={error} hintId={hintId} errorId={errorId} />
    </div>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, labelAdornment, hint, error, className = '', id, ...props },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const hintId = `${textareaId}-hint`;
  const errorId = `${textareaId}-error`;

  return (
    <div className="grid gap-1.5">
      {label && (
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={textareaId} className="text-xs font-semibold text-slate-700">
            {label}
            {props.required && <span className="ml-1 text-red-600">*</span>}
          </label>
          {labelAdornment}
        </div>
      )}
      <textarea
        {...props}
        ref={ref}
        id={textareaId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={[props['aria-describedby'], error ? errorId : hint ? hintId : undefined].filter(Boolean).join(' ') || undefined}
        className={[
          controlClass,
          'min-h-24 resize-y',
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
      <FieldMessages hint={hint} error={error} hintId={hintId} errorId={errorId} />
    </div>
  );
});
