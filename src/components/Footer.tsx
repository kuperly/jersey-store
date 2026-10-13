import Link from 'next/link';
import { getMenu } from '@/lib/shopify/catalog';

export async function Footer() {
  const [shop, help] = await Promise.all([getMenu('footer'), getMenu('footer-help')]);

  return (
    <footer className="bg-ink pt-14 pb-8 text-zinc-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="mb-2 text-2xl font-black text-white">
            KIT<span className="text-brand">ROOM</span>
          </p>
          <p className="max-w-sm">חולצות כדורגל וכדורסל עם הדפסת שם ומספר. משלוח לכל הארץ.</p>
        </div>
        {[
          { title: 'קטגוריות', items: shop },
          { title: 'מידע ושירות', items: help },
        ].map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 font-bold text-white">{col.title}</h3>
            <ul className="space-y-2">
              {col.items.map((i) => (
                <li key={i.path + i.title}>
                  <Link href={i.path} className="transition hover:text-brand">{i.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-12 max-w-7xl border-t border-white/10 px-4 pt-6 text-sm text-zinc-500">
        © KIT ROOM · כל הזכויות שמורות
      </p>
    </footer>
  );
}
