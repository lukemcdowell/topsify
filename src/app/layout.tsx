import Navigation from '@/components/Navigation';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Top Spotify',
  description: 'View your top Spotify tracks & artists',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark flex justify-center">
      <body className={cn(inter.className, 'container')}>
        <Navigation />

        <main className="max-w-max min-h-screen m-auto">{children}</main>
      </body>
    </html>
  );
}
