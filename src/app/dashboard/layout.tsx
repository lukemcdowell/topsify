import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center">
      <div className="container">
        <div className="w-full flex justify-center pt-5">
          <Link href="/dashboard">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              <span className="text-primary">topS</span>
              ify
            </h1>
          </Link>
        </div>
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
