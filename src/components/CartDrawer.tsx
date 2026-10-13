'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { setLineQuantity } from '@/lib/cart-actions';
import { formatMoney } from '@/lib/format';
import type { Cart } from '@/lib/shopify/types';

/** Opens the drawer from anywhere (e.g. after add-to-cart). */
export const OPEN_CART_EVENT = 'cart:open';

export function CartDrawer({ cart }: { cart: Cart | null }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const count = cart?.totalQuantity ?? 0;

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_CART_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CART_EVENT, onOpen);
  }, []);

  const change = (lineId: string, quantity: number) =>
    startTransition(async () => {
      await setLineQuantity(lineId, quantity);
    });

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`עגלה, ${count} פריטים`} className="relative rounded-full p-2 hover:bg-white/10">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M6 6h15l-1.5 9h-12zM6 6 5 3H2" />
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -left-0.5 grid size-5 place-items-center rounded-full bg-brand text-[11px] font-bold text-ink"
          >
            {count}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="עגלת קניות"
              className="fixed inset-y-0 left-0 z-50 flex w-full max-w-md flex-col bg-white text-ink shadow-2xl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between border-b border-zinc-100 p-5">
                <h2 className="text-lg font-extrabold">העגלה שלי ({count})</h2>
                <button type="button" onClick={() => setOpen(false)} aria-label="סגירה" className="text-xl">✕</button>
              </div>

              <div className={`flex-1 overflow-y-auto p-5 transition ${pending ? 'opacity-50' : ''}`}>
                {!cart || cart.lines.nodes.length === 0 ? (
                  <div className="grid h-full place-items-center text-center">
                    <div>
                      <p className="mb-4 text-zinc-500">העגלה ריקה</p>
                      <Link href="/collections/shop-all" onClick={() => setOpen(false)} className="btn-brand rounded-full px-6 py-3 font-bold">
                        לכל החולצות
                      </Link>
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {cart.lines.nodes.map((line) => (
                      <li key={line.id} className="flex gap-3">
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface">
                          {line.merchandise.image && (
                            <Image src={line.merchandise.image.url} alt={line.merchandise.image.altText ?? ''} fill sizes="80px" className="object-cover" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link href={`/products/${line.merchandise.product.handle}`} onClick={() => setOpen(false)} className="line-clamp-2 font-semibold">
                            {line.merchandise.product.title}
                          </Link>
                          <p className="text-sm text-zinc-500">{line.merchandise.selectedOptions.map((o) => o.value).join(' · ')}</p>
                          {line.attributes.filter((a) => a.value).map((a) => (
                            <p key={a.key} className="text-sm text-zinc-500">{a.key}: {a.value}</p>
                          ))}
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-zinc-200">
                              <button type="button" className="px-3 py-1" aria-label="הפחתה" onClick={() => change(line.id, line.quantity - 1)}>−</button>
                              <span className="min-w-6 text-center text-sm">{line.quantity}</span>
                              <button type="button" className="px-3 py-1" aria-label="הוספה" onClick={() => change(line.id, line.quantity + 1)}>+</button>
                            </div>
                            <span className="font-bold">{formatMoney(line.cost.totalAmount)}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {cart && cart.lines.nodes.length > 0 && (
                <div className="space-y-3 border-t border-zinc-100 p-5">
                  <div className="flex justify-between text-lg font-extrabold">
                    <span>סה״כ</span>
                    <span>{formatMoney(cart.cost.subtotalAmount)}</span>
                  </div>
                  <p className="text-xs text-zinc-500">כולל מע״מ. משלוח והנחות מחושבים בקופה.</p>
                  <a href={cart.checkoutUrl} className="btn-brand block rounded-full py-4 text-center text-lg font-extrabold">
                    לתשלום מאובטח ←
                  </a>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
