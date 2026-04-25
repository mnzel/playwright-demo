import type { ToastVariant } from '../../types.ts';

interface ToastProps {
  id: number;
  message: string;
  variant?: ToastVariant;
  onDismiss: (id: number) => void;
}

const PALETTE: Record<ToastVariant, { bg: string; fg: string }> = {
  info: { bg: '#1e293b', fg: '#fff' },
  success: { bg: '#10b981', fg: '#fff' },
  error: { bg: '#dc2626', fg: '#fff' },
  warning: { bg: '#f59e0b', fg: '#0f172a' },
};

export default function Toast({ id, message, variant = 'info', onDismiss }: ToastProps) {
  const palette = PALETTE[variant];

  return (
    <div
      role="status"
      data-testid="toast"
      data-variant={variant}
      style={{
        background: palette.bg,
        color: palette.fg,
        padding: '12px 16px',
        borderRadius: 8,
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.18)',
        marginTop: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minWidth: 240,
        maxWidth: 360,
      }}
    >
      <span style={{ flex: 1, fontSize: '0.9rem' }}>{message}</span>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => onDismiss(id)}
        style={{ color: palette.fg, opacity: 0.8, fontSize: '1.25rem', lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  );
}
