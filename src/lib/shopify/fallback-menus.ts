import type { MenuItem } from './types';

// Mirror of the Shopify menus, used when no Storefront token is configured
// (menus are not available in tokenless mode). Keep in sync with Shopify admin → Navigation.
const c = (title: string, handle: string, items: MenuItem[] = []): MenuItem => ({ title, path: `/collections/${handle}`, items });
const p = (title: string, handle: string): MenuItem => ({ title, path: `/pages/${handle}`, items: [] });

export const FALLBACK_MENUS: Record<string, MenuItem[]> = {
  'main-menu': [
    c('מונדיאל 2026', 'world-cup-2026'),
    c('כדורגל', 'shop-all', [
      c('ליגות', 'shop-all', [
        c('פרמייר ליג', 'premier-league'),
        c('לה ליגה', 'la-liga'),
        c('סרייה A', 'serie-a'),
        c('בונדסליגה', 'bundesliga'),
        c('ליג 1', 'ligue-1'),
        c('ליגת העל', 'israeli-league'),
        c('שאר העולם', 'rest-of-world'),
      ]),
      c('נבחרות', 'national-teams'),
      c('ילדים', 'kids'),
      c('אימון וחימום', 'training', [c('חולצות אימון', 'training'), c('חולצות חימום', 'pre-match'), c('אימוניות חורף', 'tracksuits')]),
      c('טישרטים', 'casual-tees'),
      c('כדורי משחק', 'balls'),
    ]),
    c('רטרו', 'retro', [
      c('פרמייר ליג', 'retro-premier-league'),
      c('לה ליגה', 'retro-la-liga'),
      c('סרייה A', 'retro-serie-a'),
      c('בונדסליגה', 'retro-bundesliga'),
      c('נבחרות', 'retro-national-teams'),
      c('שאר העולם', 'retro-rest-of-world'),
    ]),
    c('כדורסל', 'basketball', [c('גופיות NBA', 'nba-jerseys'), c('מכנסי NBA', 'nba-shorts'), c('טישרטים NBA', 'nba-tees')]),
    c('מבצעים', 'sale'),
    p('מעקב הזמנה', 'order-tracking'),
  ],
  footer: [
    c('מונדיאל 2026', 'world-cup-2026'),
    c('נבחרות', 'national-teams'),
    c('רטרו', 'retro'),
    c('ילדים', 'kids'),
    c('כדורסל', 'basketball'),
  ],
  'footer-help': [
    p('מעקב הזמנה', 'order-tracking'),
    p('משלוחים והחזרות', 'shipping-returns'),
    p('טבלת מידות', 'size-chart'),
    p('צור קשר', 'contact'),
  ],
};
