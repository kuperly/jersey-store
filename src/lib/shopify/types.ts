export type Money = { amount: string; currencyCode: string };

export type Image = { url: string; altText: string | null; width: number; height: number };

export type ProductCard = {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  productType: string;
  /** Only present when a Storefront token is configured. */
  tags?: string[];
  featuredImage: Image | null;
  images: { nodes: Image[] };
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money };
};

export type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: Money;
  compareAtPrice: Money | null;
  image: Image | null;
};

export type Product = ProductCard & {
  descriptionHtml: string;
  vendor: string;
  options: { name: string; optionValues: { name: string }[] }[];
  variants: { nodes: Variant[] };
  gallery: { nodes: Image[] };
  seo: { title: string | null; description: string | null };
};

export type Filter = {
  id: string;
  label: string;
  type: string;
  values: { id: string; label: string; count: number; input: string }[];
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  image: Image | null;
};

export type MenuItem = { title: string; path: string; items: MenuItem[] };

export type CartLine = {
  id: string;
  quantity: number;
  attributes: { key: string; value: string | null }[];
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    image: Image | null;
    selectedOptions: { name: string; value: string }[];
    product: { title: string; handle: string };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: { nodes: CartLine[] };
};

export type Page = { title: string; body: string; seo: { title: string | null; description: string | null } };

/** Jerseys and kits can carry a printed name and number. */
export function isPersonalizable(product: Pick<ProductCard, 'tags' | 'productType'>): boolean {
  if (product.tags?.includes('personalizable')) return true;
  return /jersey|kit/i.test(product.productType);
}
