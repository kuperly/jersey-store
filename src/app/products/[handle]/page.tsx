import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Gallery } from '@/components/Gallery';
import { ProductCard } from '@/components/ProductCard';
import { ProductForm } from '@/components/ProductForm';
import { getProduct, getRecommendations } from '@/lib/shopify/catalog';

async function Recommendations({ productId }: { productId: string }) {
  const products = await getRecommendations(productId);
  if (!products.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="mb-5 text-2xl font-black">אולי תאהבו גם</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

async function ProductContent({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  return (
    <>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-2 lg:gap-14">
        <Gallery images={product.gallery.nodes} title={product.title} />
        <div className="lg:sticky lg:top-24 lg:self-start">
          {product.vendor && <p className="mb-1 text-sm font-bold tracking-wide text-zinc-500 uppercase">{product.vendor}</p>}
          <h1 className="mb-4 text-3xl font-black md:text-4xl">{product.title}</h1>
          <ProductForm product={product} />
          {product.descriptionHtml && (
            <details className="mt-6 border-t border-zinc-200 pt-4" open>
              <summary className="cursor-pointer font-bold">פרטי המוצר</summary>
              <div className="rte mt-2 text-zinc-700" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
            </details>
          )}
        </div>
      </div>
      <Recommendations productId={product.id} />
    </>
  );
}

export default function ProductPage({ params }: PageProps<'/products/[handle]'>) {
  return (
    <Suspense fallback={<div className="mx-auto h-[70vh] max-w-7xl animate-pulse px-4 py-8"><div className="h-full rounded-3xl bg-surface" /></div>}>
      <ProductContent params={params} />
    </Suspense>
  );
}
