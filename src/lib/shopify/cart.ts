import { cookies } from 'next/headers';
import { isShopifyConfigured, shopifyFetch } from './client';
import { CART, IMAGE } from './fragments';
import type { Cart } from './types';

export const CART_COOKIE = 'cartId';

type CartPayload = { cart: Cart | null; userErrors: { field: string[] | null; message: string }[] };

function unwrap(payload: CartPayload): Cart {
  if (payload.userErrors.length) throw new Error(payload.userErrors.map((e) => e.message).join('; '));
  if (!payload.cart) throw new Error('Cart not returned');
  return payload.cart;
}

/** Reads the visitor's cart from the cart cookie. Request-time only (uses cookies). */
export async function getCart(): Promise<Cart | null> {
  if (!isShopifyConfigured) return null;
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  if (!cartId) return null;

  const data = await shopifyFetch<{ cart: Cart | null }>(
    /* GraphQL */ `
      query Cart($cartId: ID!) @inContext(country: IL, language: HE) { cart(id: $cartId) { ...CartFields } }
      ${IMAGE}
      ${CART}
    `,
    { cartId },
  );
  return data.cart;
}

export type LineInput = {
  merchandiseId: string;
  quantity: number;
  attributes?: { key: string; value: string }[];
};

export async function createCart(lines: LineInput[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: CartPayload }>(
    /* GraphQL */ `
      mutation CartCreate($lines: [CartLineInput!]) @inContext(country: IL, language: HE) {
        cartCreate(input: { lines: $lines }) { cart { ...CartFields } userErrors { field message } }
      }
      ${IMAGE}
      ${CART}
    `,
    { lines },
  );
  return unwrap(data.cartCreate);
}

export async function addLines(cartId: string, lines: LineInput[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: CartPayload }>(
    /* GraphQL */ `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) @inContext(country: IL, language: HE) {
        cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message } }
      }
      ${IMAGE}
      ${CART}
    `,
    { cartId, lines },
  );
  return unwrap(data.cartLinesAdd);
}

export async function updateLines(cartId: string, lines: { id: string; quantity: number }[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: CartPayload }>(
    /* GraphQL */ `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) @inContext(country: IL, language: HE) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message } }
      }
      ${IMAGE}
      ${CART}
    `,
    { cartId, lines },
  );
  return unwrap(data.cartLinesUpdate);
}

export async function removeLines(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: CartPayload }>(
    /* GraphQL */ `
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) @inContext(country: IL, language: HE) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } userErrors { field message } }
      }
      ${IMAGE}
      ${CART}
    `,
    { cartId, lineIds },
  );
  return unwrap(data.cartLinesRemove);
}
