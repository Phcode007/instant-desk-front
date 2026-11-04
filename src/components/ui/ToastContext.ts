import { createContext } from 'react';
import type { ToastVariant } from './Toast';

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastEntry extends ToastOptions {
  id: number;
}

export interface ToastContextValue {
  showToast: (toast: ToastOptions) => number;
  dismissToast: (id: number) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
