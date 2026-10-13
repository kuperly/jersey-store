import Link from 'next/link';
import { getCollectionProducts } from '@/lib/shopify/catalog';
import { ProductCard } from './ProductCard';
import { Reveal } from './Reveal';

/** Horizontal, swipeable row of products from one collection. */
export async function ProductRail({ handle, title, emoji }: { handle: string; title?: string; emoji?: string }) {
  const data = await getCollectionProducts(handle, { first: 12 });
  if (!data || data.products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <Reveal className="mb-5 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-black md:text-3xl">
          {emoji && <span className="me-2">{emoji}</span>}
          {title ?? data.collection.title}
        </h2>
        <Link href={`/collections/${handle}`} className="shrink-0 text-sm font-bold underline-offset-4 hover:underline">
          לכל המוצרים ←
        </Link>
      </Reveal>
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
        {data.products.map((product, i) => (
          <Reveal key={product.id} delay={Math.min(i, 6) * 0.05} className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-[23%]">
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
