interface StockBadgeProps {
  inStock: boolean;
  testId?: string;
}

export default function StockBadge({ inStock, testId = 'stock-badge' }: StockBadgeProps) {
  return (
    <span
      data-testid={testId}
      data-stock={inStock ? 'in' : 'out'}
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 999,
        fontSize: '0.75rem',
        fontWeight: 600,
        background: inStock ? '#dcfce7' : '#fee2e2',
        color: inStock ? '#166534' : '#991b1b',
      }}
    >
      {inStock ? 'In stock' : 'Out of stock'}
    </span>
  );
}
