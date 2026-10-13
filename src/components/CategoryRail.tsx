import Image from 'next/image';
import Link from 'next/link';
import { getCollections } from '@/lib/shopify/catalog';
import { Reveal } from './Reveal';

const HANDLES = ['world-cup-2026', 'premier-league', 'la-liga', 'national-teams', 'retro', 'kids', 'nba-jerseys', 'training'];

export async function CategoryRail() {
  const collections = await getCollections(HANDLES);
  if (collections.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <Reveal>
        <h2 className="mb-5 text-2xl font-black md:text-3xl">קנו לפי קטגוריה</h2>
      </Reveal>
      <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
        {collections.map((c, i) => (
          <Reveal key={c.handle} delay={i * 0.05} className="w-[42%] shrink-0 snap-start sm:w-[28%] lg:w-[18%]">
            <Link href={`/collections/${c.handle}`} className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-ink">
              {c.image ? (
                <Image src={c.image.url} alt={c.image.altText ?? c.title} fill sizes="20vw" className="object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-ink" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="absolute inset-x-3 bottom-3 text-lg font-extrabold text-white">{c.title}</span>
              <span className="absolute bottom-3 left-3 grid size-8 place-items-center rounded-full bg-brand text-ink transition group-hover:-translate-x-1">←</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
