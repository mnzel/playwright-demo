import { useToast } from '../../context/ToastContext.tsx';
import Toast from './Toast.tsx';

export default function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <div
      data-testid="toaster"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        zIndex: 800,
        pointerEvents: 'none',
      }}
    >
      <div style={{ pointerEvents: 'auto' }}>
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={dismiss} />
        ))}
      </div>
    </div>
  );
}
