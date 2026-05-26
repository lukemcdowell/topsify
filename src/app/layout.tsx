import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "topSify",
  description: "Discover my top Spotify tracks, artists, and genres",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className)}>
        <div className="flex justify-center">
          <div className="container">
            <div className="w-full flex justify-center pt-5">
              <Link href="/">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  <span className="text-primary">topS</span>
                  ify
                </h1>
              </Link>
            </div>
            <main className="w-full">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
