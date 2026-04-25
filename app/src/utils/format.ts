// Currency / date formatting helpers.

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatCurrency(amount: number | null | undefined): string {
  return currencyFormatter.format(amount ?? 0);
}

export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
