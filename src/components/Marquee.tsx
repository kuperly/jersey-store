const ITEMS = [
  '⭐ דירוג 4.9 מלקוחות',
  '🖨️ הדפסת שם ומספר',
  '🚚 משלוח חינם מעל ₪299',
  '🔄 החלפת מידה עד 14 יום',
  '🔒 תשלום מאובטח',
  '💳 אפשרות לתשלומים',
];

/** Endless scrolling trust bar. The list is rendered twice so the loop is seamless. */
export function Marquee() {
  return (
    <div className="overflow-hidden bg-ink-soft text-sm text-white" aria-label="יתרונות החנות">
      <div className="flex w-max animate-marquee gap-10 py-2.5 hover:[animation-play-state:paused]">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap" aria-hidden={i >= ITEMS.length}>
            {item}
            <span className="size-1.5 rounded-full bg-brand" />
          </span>
        ))}
      </div>
    </div>
  );
}
