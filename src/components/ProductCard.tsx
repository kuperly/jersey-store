import Image from 'next/image';
import Link from 'next/link';
import { discountPercent, formatMoney } from '@/lib/format';
import { isPersonalizable, type ProductCard as Product } from '@/lib/shopify/types';

export function ProductCard({ product }: { product: Product }) {
  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange.minVariantPrice;
  const off = discountPercent(price, compareAt);
  const [first, second] = product.images.nodes;
  const image = product.featuredImage ?? first;

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
        {image ? (
          <>
            <Image src={image.url} alt={image.altText ?? product.title} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
            {second && (
              <Image src={second.url} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover opacity-0 transition duration-500 group-hover:opacity-100" />
            )}
          </>
        ) : (
          <div className="grid h-full place-items-center text-5xl opacity-30">👕</div>
        )}
        <div className="absolute top-3 right-3 flex flex-col items-start gap-1.5">
          {off && <span className="rounded-full bg-sale px-2.5 py-1 text-xs font-bold text-white">-{off}%</span>}
          {product.tags?.includes('new') && <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-white">חדש</span>}
          {!product.availableForSale && <span className="rounded-full bg-zinc-500 px-2.5 py-1 text-xs font-bold text-white">אזל</span>}
        </div>
        {isPersonalizable(product) && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold backdrop-blur">🖨️ הדפסת שם</span>
        )}
      </div>
      <div className="mt-3 space-y-1 text-center">
        <h3 className="line-clamp-2 text-sm font-semibold">{product.title}</h3>
        <p className="flex items-center justify-center gap-2">
          <span className={`font-extrabold ${off ? 'text-sale' : ''}`}>{formatMoney(price)}</span>
          {off && <s className="text-sm text-zinc-400">{formatMoney(compareAt)}</s>}
        </p>
      </div>
    </Link>
  );
}
