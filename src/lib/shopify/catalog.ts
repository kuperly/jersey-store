import { cacheLife, cacheTag } from 'next/cache';
import { isShopifyConfigured, shopifyFetch } from './client';
import { IMAGE, PRODUCT_CARD } from './fragments';
import type { Collection, Filter, MenuItem, Page, Product, ProductCard } from './types';

// Catalog data changes rarely, so it is cached for minutes and tagged so a
// Shopify webhook can revalidate it on demand later.
function cacheCatalog() {
  cacheLife('minutes');
  cacheTag('shopify');
}

/** Turns an absolute Shopify URL into a path on this storefront. */
function toPath(url: string): string {
  try {
    const { pathname } = new URL(url);
    return pathname === '' ? '/' : pathname;
  } catch {
    return url;
  }
}

type RawMenuItem = { title: string; url: string; items?: RawMenuItem[] };

export async function getMenu(handle: string): Promise<MenuItem[]> {
  'use cache';
  cacheCatalog();
  if (!isShopifyConfigured) return [];

  const data = await shopifyFetch<{ menu: { items: RawMenuItem[] } | null }>(
    /* GraphQL */ `
      query Menu($handle: String!) @inContext(country: IL, language: HE) {
        menu(handle: $handle) {
          items { title url items { title url items { title url } } }
        }
      }
    `,
    { handle },
  );

  const map = (items: RawMenuItem[] = []): MenuItem[] =>
    items.map((i) => ({ title: i.title, path: toPath(i.url), items: map(i.items) }));
  return map(data.menu?.items);
}

export type SortKey = 'featured' | 'best' | 'new' | 'price-asc' | 'price-desc';

const SORTS: Record<SortKey, { sortKey: string; reverse: boolean }> = {
  featured: { sortKey: 'COLLECTION_DEFAULT', reverse: false },
  best: { sortKey: 'BEST_SELLING', reverse: false },
  new: { sortKey: 'CREATED', reverse: true },
  'price-asc': { sortKey: 'PRICE', reverse: false },
  'price-desc': { sortKey: 'PRICE', reverse: true },
};

export async function getCollectionProducts(
  handle: string,
  options: { sort?: SortKey; filters?: string[]; first?: number } = {},
): Promise<{ collection: Collection; products: ProductCard[]; filters: Filter[] } | null> {
  'use cache';
  cacheCatalog();
  if (!isShopifyConfigured) return null;

  const { sortKey, reverse } = SORTS[options.sort ?? 'featured'] ?? SORTS.featured;
  const filters = (options.filters ?? []).flatMap((f) => {
    try {
      return [JSON.parse(f)];
    } catch {
      return [];
    }
  });

  const data = await shopifyFetch<{
    collection:
      | (Collection & { products: { filters: Filter[]; nodes: ProductCard[] } })
      | null;
  }>(
    /* GraphQL */ `
      query CollectionProducts(
        $handle: String!
        $first: Int!
        $sortKey: ProductCollectionSortKeys!
        $reverse: Boolean!
        $filters: [ProductFilter!]
      ) @inContext(country: IL, language: HE) {
        collection(handle: $handle) {
          handle
          title
          description
          image { ...ImageFields }
          products(first: $first, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
            filters { id label type values { id label count input } }
            nodes { ...ProductCardFields }
          }
        }
      }
      ${IMAGE}
      ${PRODUCT_CARD}
    `,
    { handle, first: options.first ?? 48, sortKey, reverse, filters },
  );

  if (!data.collection) return null;
  const { products, ...collection } = data.collection;
  return { collection, products: products.nodes, filters: products.filters };
}

export async function getCollections(handles: string[]): Promise<Collection[]> {
  'use cache';
  cacheCatalog();
  if (!isShopifyConfigured) return [];

  const results = await Promise.all(
    handles.map((handle) =>
      shopifyFetch<{ collection: Collection | null }>(
        /* GraphQL */ `
          query CollectionCard($handle: String!) @inContext(country: IL, language: HE) {
            collection(handle: $handle) { handle title description image { ...ImageFields } }
          }
          ${IMAGE}
        `,
        { handle },
      ).then((d) => d.collection),
    ),
  );
  return results.filter((c): c is Collection => c !== null);
}

export async function getProduct(handle: string): Promise<Product | null> {
  'use cache';
  cacheCatalog();
  if (!isShopifyConfigured) return null;

  const data = await shopifyFetch<{ product: Product | null }>(
    /* GraphQL */ `
      query Product($handle: String!) @inContext(country: IL, language: HE) {
        product(handle: $handle) {
          ...ProductCardFields
          descriptionHtml
          vendor
          options { name optionValues { name } }
          variants(first: 100) {
            nodes {
              id
              title
              availableForSale
              selectedOptions { name value }
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              image { ...ImageFields }
            }
          }
          gallery: images(first: 10) { nodes { ...ImageFields } }
          seo { title description }
        }
      }
      ${IMAGE}
      ${PRODUCT_CARD}
    `,
    { handle },
  );
  return data.product;
}

export async function getRecommendations(productId: string): Promise<ProductCard[]> {
  'use cache';
  cacheCatalog();
  if (!isShopifyConfigured) return [];

  const data = await shopifyFetch<{ productRecommendations: ProductCard[] | null }>(
    /* GraphQL */ `
      query Recommendations($productId: ID!) @inContext(country: IL, language: HE) {
        productRecommendations(productId: $productId) { ...ProductCardFields }
      }
      ${IMAGE}
      ${PRODUCT_CARD}
    `,
    { productId },
  );
  return (data.productRecommendations ?? []).slice(0, 8);
}

export async function searchProducts(query: string): Promise<ProductCard[]> {
  'use cache';
  cacheCatalog();
  if (!isShopifyConfigured || !query) return [];

  const data = await shopifyFetch<{ search: { nodes: ProductCard[] } }>(
    /* GraphQL */ `
      query Search($query: String!) @inContext(country: IL, language: HE) {
        search(query: $query, first: 48, types: PRODUCT, prefix: LAST) {
          nodes { ... on Product { ...ProductCardFields } }
        }
      }
      ${IMAGE}
      ${PRODUCT_CARD}
    `,
    { query },
  );
  return data.search.nodes;
}

export async function getPage(handle: string): Promise<Page | null> {
  'use cache';
  cacheCatalog();
  if (!isShopifyConfigured) return null;

  const data = await shopifyFetch<{ page: Page | null }>(
    /* GraphQL */ `
      query Page($handle: String!) @inContext(country: IL, language: HE) {
        page(handle: $handle) { title body seo { title description } }
      }
    `,
    { handle },
  );
  return data.page;
}
