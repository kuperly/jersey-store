import Link from 'next/link';
import { Suspense } from 'react';
import { getMenu } from '@/lib/shopify/catalog';
import { getCart } from '@/lib/shopify/cart';
import { CartDrawer } from './CartDrawer';
import { MobileMenu } from './MobileMenu';

async function CartSlot() {
  const cart = await getCart().catch(() => null);
  return <CartDrawer cart={cart} />;
}

export async function Header() {
  const menu = await getMenu('main-menu');

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 text-white backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <MobileMenu menu={menu} />

        <Link href="/" className="text-xl font-black tracking-tight">
          KIT<span className="text-brand">ROOM</span>
        </Link>

        <nav className="mx-auto hidden lg:block" aria-label="תפריט ראשי">
          <ul className="flex items-center gap-1">
            {menu.map((item) => (
              <li key={item.path + item.title} className="group relative">
                <Link
                  href={item.path}
                  className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition hover:bg-white/10"
                >
                  {item.title}
                  {item.items.length > 0 && <span className="text-[10px] opacity-60">▼</span>}
                </Link>
                {item.items.length > 0 && (
                  <div className="invisible absolute top-full right-0 min-w-56 translate-y-2 rounded-2xl bg-white p-3 text-ink opacity-0 shadow-xl transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.items.map((child) => (
                      <div key={child.path + child.title}>
                        <Link href={child.path} className="block rounded-lg px-3 py-2 font-semibold hover:bg-surface">
                          {child.title}
                        </Link>
                        {child.items.map((g) => (
                          <Link
                            key={g.path + g.title}
                            href={g.path}
                            className="block rounded-lg px-6 py-1.5 text-sm text-zinc-600 hover:bg-surface hover:text-ink"
                          >
                            {g.title}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-1 lg:ms-0">
          <Link href="/search" aria-label="חיפוש" className="rounded-full p-2 transition hover:bg-white/10">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </Link>
          <Suspense fallback={<CartDrawer cart={null} />}>
            <CartSlot />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
