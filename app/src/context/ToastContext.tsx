import { createContext, useContext, useCallback, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import type { ToastMessage, ToastOptions } from '../types.ts';

interface ToastContextValue {
  toasts: ToastMessage[];
  push: (message: string, options?: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DISMISS_MS = 3000;

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (message: string, options: ToastOptions = {}): number => {
      const id = nextId++;
      const toast: ToastMessage = {
        id,
        message,
        variant: options.variant ?? 'info',
      };
      setToasts((current) => [...current, toast]);
      const timer = setTimeout(() => dismiss(id), options.duration ?? DEFAULT_DISMISS_MS);
      timersRef.current.set(id, timer);
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toasts, push, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
