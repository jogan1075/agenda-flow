'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Manrope, Playfair_Display } from 'next/font/google';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  const themes = [
    {
      id: 'paleta-1',
      name: 'Paleta 1',
      colors: {
        primary: '#4F46E5',
        secondary: '#7C3AED',
        bg: '#F8FAFC',
        text: '#1F2937',
        action: '#2563EB',
        primarySoft: '#EEF2FF',
        secondarySoft: '#F3E8FF',
      },
    },
    {
      id: 'paleta-2',
      name: 'Paleta 2',
      colors: {
        primary: '#0F172A',
        secondary: '#14B8A6',
        bg: '#F1F5F9',
        text: '#334155',
        action: '#10B981',
        primarySoft: '#E2E8F0',
        secondarySoft: '#CCFBF1',
      },
    },
    {
      id: 'paleta-3',
      name: 'Paleta 3',
      colors: {
        primary: '#0F172A',
        secondary: '#14B8A6',
        bg: '#F1F5F9',
        text: '#334155',
        action: '#10B981',
        primarySoft: '#E2E8F0',
        secondarySoft: '#CCFBF1',
      },
    },
  ];

  const [themeId, setThemeId] = useState(themes[0].id);
  const activeTheme = useMemo(() => themes.find((theme) => theme.id === themeId) ?? themes[0], [themeId]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--af-primary', activeTheme.colors.primary);
    root.style.setProperty('--af-secondary', activeTheme.colors.secondary);
    root.style.setProperty('--af-bg', activeTheme.colors.bg);
    root.style.setProperty('--af-text', activeTheme.colors.text);
    root.style.setProperty('--af-action', activeTheme.colors.action);
    root.style.setProperty('--af-primary-soft', activeTheme.colors.primarySoft);
    root.style.setProperty('--af-secondary-soft', activeTheme.colors.secondarySoft);
  }, [activeTheme]);

  return (
    <div
      className={`${manrope.variable} ${playfair.variable} min-h-screen`}
      style={{
        backgroundColor: activeTheme.colors.bg,
        color: activeTheme.colors.text,
        ['--af-primary' as string]: activeTheme.colors.primary,
        ['--af-secondary' as string]: activeTheme.colors.secondary,
        ['--af-bg' as string]: activeTheme.colors.bg,
        ['--af-text' as string]: activeTheme.colors.text,
        ['--af-action' as string]: activeTheme.colors.action,
        ['--af-primary-soft' as string]: activeTheme.colors.primarySoft,
        ['--af-secondary-soft' as string]: activeTheme.colors.secondarySoft,
      }}
    >
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--af-primary-soft)_0%,var(--af-bg)_45%,var(--af-bg)_100%)]" />
        <div className="absolute -left-40 top-20 h-72 w-72 rounded-full bg-[var(--af-secondary-soft)]/60 blur-[110px]" />
        <div className="absolute right-0 top-32 h-96 w-96 rounded-full bg-[var(--af-primary-soft)]/80 blur-[130px]" />

        <section className="relative mx-auto max-w-6xl px-6 pb-8 pt-10 md:pt-14">
          <header className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--af-primary)] text-sm font-semibold text-white">
                AF
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--af-secondary)]">AgendaFlow</p>
                <p className="text-xs text-slate-500">Gestión inteligente de citas</p>
              </div>
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <Link href="/negocios" className="transition hover:text-slate-900">
                Negocios
              </Link>
              <Link href="/beneficios" className="transition hover:text-slate-900">
                Beneficios
              </Link>
              <Link href="/funcionalidades" className="transition hover:text-slate-900">
                Funcionalidades
              </Link>
              <Link href="/soluciones" className="transition hover:text-slate-900">
                Soluciones
              </Link>
              <Link href="/planes" className="transition hover:text-slate-900">
                Planes
              </Link>
              <Link href="/faq" className="transition hover:text-slate-900">
                FAQ
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 text-[11px] font-semibold text-slate-600">
                <span className="px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">Paleta</span>
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setThemeId(theme.id)}
                    className={`flex items-center gap-2 rounded-full px-3 py-1 transition ${
                      theme.id === themeId ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {theme.name}
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.colors.action }} />
                  </button>
                ))}
              </div>
              <Link
                href="/login"
                className="hidden rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 md:inline-flex"
              >
                Ingresar
              </Link>
              <Link
                href="/reservas"
                className="hidden rounded-full bg-[var(--af-action)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110 md:inline-flex"
              >
                Ver demo
              </Link>
            </div>
          </header>
        </section>

        {children}

        <section className="relative border-t border-white/70 bg-white/90">
          <div className="mx-auto max-w-6xl px-6 py-16 text-center">
            <h2 className="text-3xl font-semibold text-slate-900">AgendaFlow listo para tu negocio</h2>
            <p className="mt-3 text-sm text-slate-500">
              Empieza con el panel de manager o comparte la página de reservas con tus clientes.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/login"
                className="rounded-full bg-[var(--af-action)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Crear mi cuenta
              </Link>
              <Link
                href="/reservas"
                className="rounded-full border border-slate-200 px-6 py-3 text-sm text-slate-700 transition hover:border-slate-300"
              >
                Ver demo reservas
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
