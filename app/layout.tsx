import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plateau Lawyers Bar Forum',
  description: 'A modern Next.js TypeScript version of the PLBF website.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
