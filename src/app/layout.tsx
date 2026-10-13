import type { Metadata } from 'next';
import { Heebo } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Marquee } from '@/components/Marquee';
import { SetupNotice } from '@/components/SetupNotice';
import './globals.css';

const heebo = Heebo({ subsets: ['hebrew', 'latin'], variable: '--font-heebo', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'KIT ROOM – חולצות כדורגל וכדורסל', template: '%s | KIT ROOM' },
  description: 'חולצות כדורגל וכדורסל לעונה החדשה, רטרו, נבחרות וילדים – עם הדפסת שם ומספר.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="font-sans antialiased">
        <SetupNotice />
        <Marquee />
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
