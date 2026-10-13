import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';
import { getCollectionProducts, type SortKey } from '@/lib/shopify/catalog';

const SORT_LABELS: Record<SortKey, string> = {
  featured: 'מומלץ',
  best: 'הנמכרים ביותר',
  new: 'חדש ביותר',
  'price-asc': 'מחיר: מהנמוך',
  'price-desc': 'מחיר: מהגבוה',
};

type Search = Record<string, string | string[] | undefined>;

/** Builds a collection URL keeping the other query params. */
function hrefWith(handle: string, search: Search, change: { sort?: string; toggleFilter?: string }) {
  const params = new URLSearchParams();
  const filters = [search.filter ?? []].flat();
  const nextFilters = change.toggleFilter
    ? filters.includes(change.toggleFilter)
      ? filters.filter((f) => f !== change.toggleFilter)
      : [...filters, change.toggleFilter]
    : filters;
  nextFilters.forEach((f) => params.append('filter', f));
  const sort = change.sort ?? (typeof search.sort === 'string' ? search.sort : undefined);
  if (sort && sort !== 'featured') params.set('sort', sort);
  const qs = params.toString();
  return `/collections/${handle}${qs ? `?${qs}` : ''}`;
}

async function CollectionContent({ params, searchParams }: { params: Promise<{ handle: string }>; searchParams: Promise<Search> }) {
  const [{ handle }, search] = await Promise.all([params, searchParams]);
  const sort = (typeof search.sort === 'string' && search.sort in SORT_LABELS ? search.sort : 'featured') as SortKey;
  const activeFilters = [search.filter ?? []].flat();

  const data = await getCollectionProducts(handle, { sort, filters: activeFilters });
  if (!data) notFound();
  const { collection, products, filters } = data;
  const listFilters = filters.filter((f) => f.type === 'LIST' && f.values.length > 1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Reveal>
        <h1 className="text-4xl font-black md:text-5xl">{collection.title}</h1>
        {collection.description && <p className="mt-2 max-w-2xl text-zinc-600">{collection.description}</p>}
      </Reveal>

      <div className="my-6 space-y-3">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <Link
              key={key}
              href={hrefWith(handle, search, { sort: key })}
              scroll={false}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${sort === key ? 'border-ink bg-ink text-white' : 'border-zinc-300 hover:border-ink'}`}
            >
              {SORT_LABELS[key]}
            </Link>
          ))}
        </div>
        {listFilters.map((filter) => (
          <div key={filter.id} className="no-scrollbar flex items-center gap-2 overflow-x-auto">
            <span className="shrink-0 text-sm font-bold">{filter.label}:</span>
            {filter.values.map((v) => {
              const active = activeFilters.includes(v.input);
              return (
                <Link
                  key={v.id}
                  href={hrefWith(handle, search, { toggleFilter: v.input })}
                  scroll={false}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition ${active ? 'bg-brand font-bold text-ink' : 'bg-surface hover:bg-zinc-200'}`}
                >
                  {v.label} <span className="opacity-50">({v.count})</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {products.length ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 8) * 0.04}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-zinc-500">לא נמצאו מוצרים.</p>
      )}
    </div>
  );
}

export default function CollectionPage({ params, searchParams }: PageProps<'/collections/[handle]'>) {
  return (
    <Suspense fallback={<div className="mx-auto h-96 max-w-7xl animate-pulse px-4 py-10"><div className="h-full rounded-3xl bg-surface" /></div>}>
      <CollectionContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
