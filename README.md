# KIT ROOM – Headless jersey store

Next.js 16 storefront (Hebrew, RTL) on top of Shopify. Next.js renders every page;
Shopify keeps products, inventory, checkout, payments and order management.

## Stack
- Next.js 16 (App Router, Cache Components) · React 19 · Tailwind CSS 4 · Motion
- Shopify Storefront API `2026-01` (catalog, menus, pages, cart) · Shopify Checkout

## Setup
1. In Shopify admin install the **Headless** sales channel and create a storefront.
   Copy its **public access token**.
2. Set environment variables (locally in `.env.local`, in production in Vercel):
   ```
   SHOPIFY_STORE_DOMAIN=sa7efa-th.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=<public token>
   ```
3. `npm install && npm run dev`

Without the token the site still builds and shows a setup notice.

## How the pieces fit
| Area | Where |
|---|---|
| Storefront API client | `src/lib/shopify/client.ts` |
| Catalog queries (cached with `use cache`, tag `shopify`) | `src/lib/shopify/catalog.ts` |
| Cart (cookie `cartId`) + Server Functions | `src/lib/shopify/cart.ts`, `src/lib/cart-actions.ts` |
| Menus | Shopify menus `main-menu`, `footer`, `footer-help` |
| Collections on the homepage | handles in `src/app/page.tsx` / `CategoryRail.tsx` |

Name / number personalization is stored as cart line attributes (`שם`, `מספר`) and
appears on the order in the Shopify admin. Products tagged `personalizable` show the fields.
