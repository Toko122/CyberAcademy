import Link from "next/link";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Link
        href="/"
        className="fixed left-4 top-4 z-[100] inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-500/50 bg-slate-950/85 px-4 py-2 text-sm font-bold text-cyan-300 shadow-lg backdrop-blur transition hover:bg-cyan-500 hover:text-white sm:left-6 sm:top-6"
      >
        Back to Home
      </Link>
      {children}
    </>
  );
}
