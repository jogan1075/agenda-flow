import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

type MarketingLayoutProps = {
  children: ReactNode;
  className?: string;
};

export function MarketingLayout({ children, className }: MarketingLayoutProps) {
  return (
    <div
      className={`min-h-screen bg-[var(--af-bg)] text-[var(--af-text)] ${className ?? ''}`}
      style={
        {
          '--af-primary': '#4f46e5',
          '--af-secondary': '#7c3aed',
          '--af-bg': '#f8fafc',
          '--af-text': '#0f172a',
          '--af-action': '#2563eb',
        } as CSSProperties
      }
    >
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--af-primary)] text-xs font-semibold text-white">
              AF
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">AgendaFlow</p>
              <p className="text-xs text-slate-400">Gestión inteligente de citas</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <Link href="/negocios" className="transition hover:text-slate-900">
              Negocios
            </Link>
            <Link href="/beneficios" className="transition hover:text-slate-900">
              Beneficios
            </Link>
            <Link href="/planes" className="transition hover:text-slate-900">
              Planes
            </Link>
            <Link href="/faq" className="transition hover:text-slate-900">
              FAQ
            </Link>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Ingresar
            </Link>
            <Link
              href="/reservas"
              className="rounded-full bg-[var(--af-action)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110"
            >
              Ver demo
            </Link>
          </div>
        </div>
      </header>

      <main className="pb-16 pt-12">{children}</main>

      <footer className="border-t border-slate-200/70 bg-white/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <span>AgendaFlow · Gestión inteligente de citas</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/planes" className="transition hover:text-slate-700">
              Planes
            </Link>
            <Link href="/faq" className="transition hover:text-slate-700">
              Ayuda
            </Link>
            <Link href="/login" className="transition hover:text-slate-700">
              Ingresar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
