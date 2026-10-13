'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } } };

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      {/* Placeholder backdrop until a real hero photo is added */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,#3f3f46_0%,transparent_55%),radial-gradient(ellipse_at_bottom_right,#1e3a8a_0%,transparent_50%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

      <motion.div
        className="mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end gap-5 px-4 pb-16 pt-24"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.span variants={item} className="w-fit rounded-full border border-brand/60 bg-brand/10 px-4 py-1.5 text-sm font-bold text-brand">
          ⚡ עונת 26/27 כבר כאן
        </motion.span>
        <motion.h1 variants={item} className="max-w-3xl text-5xl leading-[1.05] font-black md:text-7xl">
          החולצה של הקבוצה שלך.
          <span className="block text-brand">עם השם שלך.</span>
        </motion.h1>
        <motion.p variants={item} className="max-w-xl text-lg text-zinc-300">
          כדורגל, כדורסל, רטרו, נבחרות וילדים · הדפסת שם ומספר על כל חולצה
        </motion.p>
        <motion.div variants={item} className="flex flex-wrap gap-3">
          <Link href="/collections/shop-all" className="btn-brand rounded-full px-8 py-4 text-lg font-extrabold text-ink shadow-[0_0_40px_-8px] shadow-brand transition hover:scale-[1.03]">
            לכל החולצות ←
          </Link>
          <Link href="/collections/world-cup-2026" className="rounded-full border border-white/40 px-8 py-4 text-lg font-bold transition hover:bg-white hover:text-ink">
            מונדיאל 2026
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
