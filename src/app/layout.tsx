import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
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
        <div className="w-full flex justify-center pt-5">
          <Link href="/">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Top
              <span className="bg-gradient-to-r from-white  to-primary bg-clip-text text-transparent">
                s
              </span>
              <span className="text-primary">ify</span>
            </h1>
          </Link>
        </div>

        <main className="container w-full h-full m-auto">{children}</main>
      </body>
    </html>
  );
}
