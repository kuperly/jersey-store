import { CategoryRail } from '@/components/CategoryRail';
import { Hero } from '@/components/Hero';
import { Faq, InfoCards, Reviews } from '@/components/InfoSections';
import { ProductRail } from '@/components/ProductRail';

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryRail />
      <ProductRail handle="world-cup-2026" emoji="🌍" />
      <ProductRail handle="new-arrivals" emoji="⚡" />
      <InfoCards />
      <ProductRail handle="retro" emoji="🕰️" />
      <ProductRail handle="kids" emoji="🧒" />
      <ProductRail handle="nba-jerseys" emoji="🏀" />
      <ProductRail handle="sale" emoji="🔥" />
      <Reviews />
      <Faq />
    </>
  );
}
