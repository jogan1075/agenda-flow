import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { BUSINESS_CATEGORIES, FEATURE_SECTIONS, getBusinessLink } from '@/lib/marketing-data';

const businessMenu = BUSINESS_CATEGORIES;
const featureMenu = FEATURE_SECTIONS;

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
            <div className="group relative">
              <Link href="/negocios" className="-mx-2 -my-2 flex items-center gap-1 rounded-lg px-2 py-2 transition hover:text-slate-900">
                Negocios
                <svg className="h-3 w-3 text-slate-400" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <div className="pointer-events-none absolute left-0 top-full z-30 mt-2 w-[760px] translate-y-2 rounded-3xl border border-slate-200 bg-white p-6 opacity-0 shadow-xl transition group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                <div className="grid gap-6 md:grid-cols-3">
                  {businessMenu.map((section) => (
                    <div key={section.title}>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{section.title}</p>
                      <div className="mt-4 space-y-3 text-sm text-slate-700">
                        {section.items.map((item) => (
                          <Link
                            key={item.slug}
                            href={getBusinessLink(item.slug)}
                            className="flex items-center gap-2 transition hover:text-slate-900"
                          >
                            <span className="h-2 w-2 rounded-full bg-slate-200" />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="group relative">
              <Link href="/funcionalidades" className="-mx-2 -my-2 flex items-center gap-1 rounded-lg px-2 py-2 transition hover:text-slate-900">
                Funcionalidades
                <svg className="h-3 w-3 text-slate-400" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-[820px] -translate-x-1/2 translate-y-2 rounded-3xl border border-slate-200 bg-white p-6 opacity-0 shadow-xl transition group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                <div className="grid gap-6 md:grid-cols-3">
                  {featureMenu.map((section) => (
                    <div key={section.title}>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{section.title}</p>
                      <div className="mt-4 space-y-3 text-sm text-slate-700">
                        {section.items.map((item) => (
                          <Link key={item} href="/funcionalidades" className="flex items-center gap-2 transition hover:text-slate-900">
                            <span className="h-2 w-2 rounded-full bg-slate-200" />
                            {item}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/planes" className="transition hover:text-slate-900">
              Precios
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
