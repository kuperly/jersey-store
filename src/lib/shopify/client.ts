const API_VERSION = '2026-01';

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

/** True once the store domain is set. The token is optional (see below). */
export const isShopifyConfigured = Boolean(domain);

/**
 * Without a token the Storefront API runs in "tokenless" mode: products, collections,
 * search, pages and cart work, but menus and product tags need a token.
 */
export const hasStorefrontToken = Boolean(token);

export class ShopifyError extends Error {}

/**
 * Calls the Shopify Storefront API. Prices and availability are requested in the
 * Israeli market and Hebrew via @inContext in each query.
 */
export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!isShopifyConfigured) throw new ShopifyError('Shopify Storefront API is not configured');

  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'X-Shopify-Storefront-Access-Token': token } : {}),
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const json = await res.json();
  if (!res.ok || json.errors) {
    throw new ShopifyError(json.errors?.map((e: { message: string }) => e.message).join('; ') || res.statusText);
  }
  return json.data as T;
}
