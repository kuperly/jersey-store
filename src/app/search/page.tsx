import { Suspense } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { searchProducts } from '@/lib/shopify/catalog';

async function Results({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { q } = await searchParams;
  const query = typeof q === 'string' ? q.trim() : '';

  return (
    <>
      <form action="/search" className="mx-auto mb-10 flex max-w-xl gap-2">
        <input
          name="q"
          defaultValue={query}
          placeholder="קבוצה, שחקן או נבחרת…"
          className="flex-1 rounded-full border border-zinc-300 px-5 py-3"
          aria-label="חיפוש"
        />
        <button className="btn-brand rounded-full px-6 font-bold">חיפוש</button>
      </form>
      {query && <Products query={query} />}
    </>
  );
}

async function Products({ query }: { query: string }) {
  const products = await searchProducts(query);
  if (!products.length) return <p className="text-center text-zinc-500">לא נמצאו תוצאות עבור “{query}”.</p>;
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-6 text-center text-4xl font-black">חיפוש</h1>
      <Suspense fallback={null}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
