import { isShopifyConfigured } from '@/lib/shopify/client';

/** Shown until the Storefront API env vars are set, so an unconfigured deploy explains itself. */
export function SetupNotice() {
  if (isShopifyConfigured) return null;
  return (
    <div className="bg-brand px-4 py-3 text-center text-sm font-semibold text-ink">
      החנות עדיין לא מחוברת ל-Shopify: חסר SHOPIFY_STOREFRONT_ACCESS_TOKEN בהגדרות הסביבה.
    </div>
  );
}
