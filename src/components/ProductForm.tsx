'use client';

import { useMemo, useState, useTransition } from 'react';
import { motion } from 'motion/react';
import { addToCart } from '@/lib/cart-actions';
import { discountPercent, formatMoney } from '@/lib/format';
import { isPersonalizable, type Product } from '@/lib/shopify/types';
import { OPEN_CART_EVENT } from './CartDrawer';

export function ProductForm({ product }: { product: Product }) {
  const variants = product.variants.nodes;
  const firstAvailable = variants.find((v) => v.availableForSale) ?? variants[0];
  const [selected, setSelected] = useState<Record<string, string>>(
    Object.fromEntries(firstAvailable?.selectedOptions.map((o) => [o.name, o.value]) ?? []),
  );
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const variant = useMemo(
    () => variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)),
    [variants, selected],
  );
  const personalizable = isPersonalizable(product);
  const hasOptions = !(product.options.length === 1 && product.options[0].optionValues.length === 1);
  const off = variant ? discountPercent(variant.price, variant.compareAtPrice) : null;

  /** Whether choosing `value` for `option` (keeping other choices) leads to a buyable variant. */
  const isAvailable = (option: string, value: string) =>
    variants.some(
      (v) => v.availableForSale && v.selectedOptions.every((o) => (o.name === option ? o.value === value : selected[o.name] === o.value)),
    );

  const submit = () => {
    if (!variant) return;
    setError(null);
    startTransition(async () => {
      const result = await addToCart({ variantId: variant.id, name, number });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setName('');
      setNumber('');
      window.dispatchEvent(new Event(OPEN_CART_EVENT));
    });
  };

  return (
    <div className="space-y-6">
      {variant && (
        <p className="flex items-center gap-3 text-2xl">
          <span className={`font-black ${off ? 'text-sale' : ''}`}>{formatMoney(variant.price)}</span>
          {off && variant.compareAtPrice && (
            <>
              <s className="text-lg text-zinc-400">{formatMoney(variant.compareAtPrice)}</s>
              <span className="rounded-full bg-sale px-2.5 py-0.5 text-sm font-bold text-white">-{off}%</span>
            </>
          )}
        </p>
      )}

      {hasOptions &&
        product.options.map((option) => (
          <fieldset key={option.name}>
            <legend className="mb-2 flex w-full items-center justify-between font-bold">
              <span>
                {option.name}: <span className="font-normal">{selected[option.name]}</span>
              </span>
              {['מידה', 'size'].includes(option.name.toLowerCase()) && (
                <a href="/pages/size-chart" target="_blank" className="text-sm font-normal underline underline-offset-4">
                  📏 טבלת מידות
                </a>
              )}
            </legend>
            <div className="flex flex-wrap gap-2">
              {option.optionValues.map(({ name: value }) => {
                const active = selected[option.name] === value;
                const available = isAvailable(option.name, value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelected((s) => ({ ...s, [option.name]: value }))}
                    aria-pressed={active}
                    className={`min-w-14 rounded-full border px-4 py-2.5 font-semibold transition ${
                      active ? 'border-ink bg-ink text-white' : 'border-zinc-300 hover:border-ink'
                    } ${available ? '' : 'text-zinc-400 line-through'}`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

      {personalizable && (
        <div className="rounded-2xl border-2 border-dashed border-zinc-300 p-4">
          <p className="mb-3 font-bold">🖨️ הדפסת שם ומספר</p>
          <div className="grid grid-cols-[2fr_1fr] gap-3">
            <label className="text-sm">
              שם (באנגלית)
              <input
                value={name}
                onChange={(e) => setName(e.target.value.replace(/[^A-Za-z .'-]/g, '').toUpperCase())}
                maxLength={14}
                className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 uppercase"
                placeholder="COHEN"
              />
            </label>
            <label className="text-sm">
              מספר
              <input
                value={number}
                onChange={(e) => setNumber(e.target.value.replace(/\D/g, '').slice(0, 2))}
                inputMode="numeric"
                className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5"
                placeholder="10"
              />
            </label>
          </div>
          {(name || number) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mt-4 flex w-40 flex-col items-center rounded-2xl bg-ink py-4 text-white"
              aria-label="תצוגה מקדימה של ההדפסה"
            >
              <span className="text-sm font-bold tracking-widest">{name || ' '}</span>
              <span className="text-5xl font-black text-brand">{number || ' '}</span>
            </motion.div>
          )}
          <p className="mt-3 text-xs text-zinc-500">חולצה עם הדפסה אישית אינה ניתנת להחזרה.</p>
        </div>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={!variant?.availableForSale || pending}
        className="btn-brand w-full rounded-full py-4 text-lg font-extrabold text-ink transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'מוסיף…' : variant?.availableForSale ? 'הוספה לעגלה' : 'אזל מהמלאי'}
      </button>
      {error && <p className="text-sm text-sale">{error}</p>}

      <ul className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
        <li className="rounded-xl bg-surface p-3">🚚<br />משלוח חינם מעל ₪299</li>
        <li className="rounded-xl bg-surface p-3">🔄<br />החלפה עד 14 יום</li>
        <li className="rounded-xl bg-surface p-3">🔒<br />תשלום מאובטח</li>
      </ul>
    </div>
  );
}
