interface SizeSelectorProps {
  sizes: string[] | null;
  value: string | null;
  onChange: (size: string) => void;
}

export default function SizeSelector({ sizes, value, onChange }: SizeSelectorProps) {
  if (!sizes || sizes.length === 0) return null;
  return (
    <div data-testid="size-selector">
      <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
        Size{value ? `: ${value}` : ''}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {sizes.map((size) => {
          const selected = value === size;
          return (
            <button
              key={size}
              type="button"
              data-testid={`size-option-${size}`}
              data-selected={selected ? 'true' : 'false'}
              onClick={() => onChange(size)}
              style={{
                minWidth: 44,
                padding: '8px 12px',
                border: '1px solid',
                borderColor: selected ? '#1e293b' : '#e2e8f0',
                borderRadius: 6,
                background: selected ? '#1e293b' : '#fff',
                color: selected ? '#fff' : '#0f172a',
                fontSize: '0.85rem',
                fontWeight: 500,
              }}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
