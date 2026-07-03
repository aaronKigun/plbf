import './globals.css';
import './plbf-site.css';
import './plbf-admin.css';
import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic']
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'Plateau Lawyers Bar Forum',
  description: 'A modern Next.js TypeScript version of the PLBF website.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
