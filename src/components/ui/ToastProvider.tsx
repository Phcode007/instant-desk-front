import { useCallback, useRef, useState, type ReactNode } from 'react';
import { ToastContext, type ToastEntry, type ToastOptions } from './ToastContext';
import Toast from './Toast';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const nextId = useRef(0);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: ToastOptions) => {
    const id = ++nextId.current;
    setToasts((current) => [...current, { ...toast, id }]);
    return id;
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div
        role="region"
        aria-label="Notificações"
        aria-live="polite"
        aria-relevant="additions text"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-2 sm:left-auto sm:w-[min(24rem,calc(100vw-2rem))]"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full">
            <Toast
              title={toast.title}
              description={toast.description}
              variant={toast.variant}
              duration={toast.duration}
              onClose={() => dismissToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
