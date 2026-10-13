import { Reveal } from './Reveal';

const INFO = [
  { icon: '👕', title: 'גרסת אוהד או גרסת שחקן?', text: 'גרסת אוהד נוחה ורחבה יותר ליום-יום. גרסת שחקן צמודה וקלה – מומלץ לעלות מידה אחת.' },
  { icon: '🖨️', title: 'הדפסת שם ומספר', text: 'בוחרים שם ומספר בעמוד המוצר, והם מודפסים על החולצה לפני המשלוח.' },
  { icon: '🚚', title: 'משלוח והחלפה', text: 'משלוח עד הבית עם מספר מעקב. לא מתאים? מחליפים מידה תוך 14 יום.' },
];

export function InfoCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <Reveal>
        <h2 className="mb-8 text-center text-2xl font-black md:text-3xl">כל מה שצריך לדעת לפני שמזמינים</h2>
      </Reveal>
      <div className="grid gap-4 md:grid-cols-3">
        {INFO.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.1}>
            <div className="h-full rounded-3xl bg-surface p-7 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-ink text-2xl">{c.icon}</div>
              <h3 className="mb-2 text-xl font-extrabold">{c.title}</h3>
              <p className="text-zinc-600">{c.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const REVIEWS = [
  { text: 'הגיע מהר, האיכות מעולה וההדפסה יצאה בדיוק כמו שרציתי.', name: 'דניאל, תל אביב' },
  { text: 'הזמנתי סט לילד – המידה מדויקת והשירות בוואטסאפ זמין.', name: 'מיכל, חיפה' },
  { text: 'החלפתי מידה בלי שום בעיה. כבר הזמנתי שוב.', name: 'אור, באר שבע' },
];

/** Placeholder reviews until Judge.me reviews are wired in. */
export function Reviews() {
  return (
    <section className="bg-ink py-16 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <h2 className="mb-2 text-center text-2xl font-black md:text-3xl">מה הלקוחות אומרים</h2>
          <p className="mb-8 text-center text-brand">★★★★★ 4.9</p>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.1}>
              <figure className="h-full rounded-3xl bg-ink-soft p-6">
                <p className="mb-3 text-brand">★★★★★</p>
                <blockquote className="mb-4 text-lg">{r.text}</blockquote>
                <figcaption className="text-sm text-zinc-400">{r.name}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQ = [
  { q: 'כמה עולה הדפסת שם ומספר?', a: 'המחיר מופיע בעמוד המוצר ליד שדות ההדפסה.' },
  { q: 'מה ההבדל בין חולצת אוהד לחולצת שחקן?', a: 'חולצת אוהד רחבה ונוחה יותר; חולצת שחקן צמודה, קלה ונושמת יותר.' },
  { q: 'תוך כמה זמן ההזמנה מגיעה?', a: 'זמן האספקה מופיע בעמוד המשלוחים. עם יציאת ההזמנה נשלח מספר מעקב.' },
  { q: 'אפשר להחליף מידה?', a: 'כן, תוך 14 יום מקבלת המוצר, כשהוא חדש ובאריזתו. חולצות עם הדפסה אישית אינן ניתנות להחזרה.' },
];

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <Reveal>
        <h2 className="mb-8 text-center text-2xl font-black md:text-3xl">שאלות נפוצות</h2>
      </Reveal>
      <div className="space-y-3">
        {FAQ.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.05}>
            <details className="group rounded-2xl bg-surface px-5 open:bg-white open:shadow-md open:ring-1 open:ring-zinc-200">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-lg font-bold">
                {f.q}
                <span className="grid size-8 place-items-center rounded-full bg-ink text-white transition group-open:rotate-45 group-open:bg-brand group-open:text-ink">+</span>
              </summary>
              <p className="pb-5 text-zinc-600">{f.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
