'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { MenuItem } from '@/lib/shopify/types';

export function MobileMenu({ menu }: { menu: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button type="button" onClick={() => setOpen(true)} aria-label="פתיחת תפריט" className="rounded-full p-2 hover:bg-white/10">
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
            <motion.nav
              className="fixed inset-y-0 right-0 z-50 w-[85vw] max-w-sm overflow-y-auto bg-white p-5 text-ink"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              aria-label="תפריט"
            >
              <button type="button" onClick={close} className="mb-4 text-2xl" aria-label="סגירה">✕</button>
              <ul className="divide-y divide-zinc-100">
                {menu.map((item) => (
                  <li key={item.path + item.title} className="py-1">
                    {item.items.length ? (
                      <details>
                        <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-lg font-bold">
                          {item.title} <span className="text-xs">▼</span>
                        </summary>
                        <div className="pb-2 ps-3">
                          <Link href={item.path} onClick={close} className="block py-2 text-sm font-semibold text-zinc-500">הכל</Link>
                          {item.items.map((c) => (
                            <div key={c.path + c.title}>
                              <Link href={c.path} onClick={close} className="block py-2 font-semibold">{c.title}</Link>
                              {c.items.map((g) => (
                                <Link key={g.path + g.title} href={g.path} onClick={close} className="block py-1.5 ps-3 text-sm text-zinc-600">{g.title}</Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      </details>
                    ) : (
                      <Link href={item.path} onClick={close} className="block py-3 text-lg font-bold">{item.title}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
