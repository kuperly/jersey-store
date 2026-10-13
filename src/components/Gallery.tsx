'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Image as ShopifyImage } from '@/lib/shopify/types';

export function Gallery({ images, title }: { images: ShopifyImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface">
        {current ? (
          <Image key={current.url} src={current.url} alt={current.altText ?? title} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-8xl opacity-20">👕</div>
        )}
      </div>
      {images.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`תמונה ${i + 1}`}
              className={`relative size-20 shrink-0 overflow-hidden rounded-xl border-2 ${i === index ? 'border-ink' : 'border-transparent'}`}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
