import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getPage } from '@/lib/shopify/catalog';

async function PageContent({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const page = await getPage(handle);
  if (!page) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-black">{page.title}</h1>
      <div className="rte text-lg text-zinc-700" dangerouslySetInnerHTML={{ __html: page.body }} />
    </article>
  );
}

export default function ContentPage({ params }: PageProps<'/pages/[handle]'>) {
  return (
    <Suspense fallback={<div className="mx-auto h-96 max-w-3xl px-4 py-12" />}>
      <PageContent params={params} />
    </Suspense>
  );
}
