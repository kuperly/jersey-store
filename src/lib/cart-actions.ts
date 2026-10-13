'use server';

import { cookies } from 'next/headers';
import { refresh } from 'next/cache';
import { CART_COOKIE, addLines, createCart, removeLines, updateLines, type LineInput } from './shopify/cart';

export type ActionResult = { ok: true } | { ok: false; error: string };

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 14,
};

/**
 * Adds a variant to the cart. Personalization (name / number) travels as line
 * attributes, so it shows on the order in the Shopify admin.
 */
export async function addToCart(input: {
  variantId: string;
  quantity?: number;
  name?: string;
  number?: string;
}): Promise<ActionResult> {
  const attributes: { key: string; value: string }[] = [];
  const name = input.name?.trim().toUpperCase();
  const number = input.number?.trim();
  if (name) attributes.push({ key: 'שם', value: name.slice(0, 14) });
  if (number) {
    if (!/^\d{1,2}$/.test(number)) return { ok: false, error: 'מספר חייב להיות 1–2 ספרות' };
    attributes.push({ key: 'מספר', value: number });
  }

  const line: LineInput = { merchandiseId: input.variantId, quantity: Math.max(1, input.quantity ?? 1), attributes };

  try {
    const store = await cookies();
    const cartId = store.get(CART_COOKIE)?.value;
    if (cartId) {
      await addLines(cartId, [line]);
    } else {
      const cart = await createCart([line]);
      store.set(CART_COOKIE, cart.id, COOKIE_OPTIONS);
    }
  } catch (error) {
    // An expired or completed cart can't take new lines: start a fresh one.
    try {
      const cart = await createCart([line]);
      (await cookies()).set(CART_COOKIE, cart.id, COOKIE_OPTIONS);
    } catch {
      return { ok: false, error: error instanceof Error ? error.message : 'שגיאה בהוספה לעגלה' };
    }
  }

  refresh();
  return { ok: true };
}

export async function setLineQuantity(lineId: string, quantity: number): Promise<ActionResult> {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  if (!cartId) return { ok: false, error: 'העגלה לא נמצאה' };
  try {
    if (quantity <= 0) await removeLines(cartId, [lineId]);
    else await updateLines(cartId, [{ id: lineId, quantity }]);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'שגיאה בעדכון העגלה' };
  }
  refresh();
  return { ok: true };
}
