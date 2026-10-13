import type { Money } from './shopify/types';

export function formatMoney({ amount, currencyCode }: Money): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: Number(amount) % 1 === 0 ? 0 : 2,
  }).format(Number(amount));
}

/** Percentage off, or null when there is no real discount. */
export function discountPercent(price: Money, compareAt: Money | null | undefined): number | null {
  const p = Number(price.amount);
  const c = Number(compareAt?.amount ?? 0);
  return c > p ? Math.round(((c - p) / c) * 100) : null;
}
