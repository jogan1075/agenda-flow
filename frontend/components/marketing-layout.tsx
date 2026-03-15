import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

const businessMenu = [
  {
    title: 'Estética y Belleza',
    items: [
      'Centros de estética',
      'Spas',
      'Salones de belleza',
      'Barberías',
      'Peluquerías',
      'Manicure y pedicure',
      'Cejas y pestañas',
    ],
  },
  {
    title: 'Salud',
    items: [
      'Centros médicos',
      'Clínicas',
      'Fisioterapia',
      'Kinesiólogos',
      'Psicólogos',
      'Consultas médicas',
      'Medicina alternativa',
      'Centro de Podología',
    ],
  },
  {
    title: 'Salud y educación',
    items: [
      'Neurodesarrollo',
      'Inclusión social',
      'Fonoaudiología',
      'Terapia Ocupacional',
      'Psicopedagogía',
      'Refuerzo Escolar',
    ],
  },
  {
    title: 'Bienestar',
    items: [
      'Nutricionistas',
      'Centros deportivos',
      'Centros de Crossfit',
      'Estudios de pilates',
      'Estudios de yoga',
    ],
  },
];

const featureMenu = [
  {
    title: 'Capta',
    items: [
      'Agenda online',
      'Reservas online',
      'Recordatorios automáticos',
      'Ficha clínica',
      'Agenda médica',
      'Historia clínica',
    ],
  },
  {
    title: 'Gestiona',
    items: [
      'Pago online',
      'Control de inventarios',
      'Integraciones API',
      'Reportes de gestión',
      'Reporte de comisiones',
      'Sistema de caja',
      'Facturación electrónica',
      'Máquina POS',
      'Boleta de honorarios',
    ],
  },
  {
    title: 'Crece',
    items: [
      'Email marketing',
      'Encuestas de satisfacción',
      'Fidelización de clientes',
      'Gift cards',
      'Charly',
    ],
  },
];

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
              <Link href="/negocios" className="flex items-center gap-1 transition hover:text-slate-900">
                Negocios
                <svg className="h-3 w-3 text-slate-400" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <div className="pointer-events-none absolute left-0 top-full z-30 hidden w-[760px] translate-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl group-hover:pointer-events-auto group-hover:block">
                <div className="grid gap-6 md:grid-cols-3">
                  {businessMenu.map((section) => (
                    <div key={section.title}>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{section.title}</p>
                      <div className="mt-4 space-y-3 text-sm text-slate-700">
                        {section.items.map((item) => (
                          <Link key={item} href="/negocios" className="flex items-center gap-2 transition hover:text-slate-900">
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

            <div className="group relative">
              <Link href="/funcionalidades" className="flex items-center gap-1 transition hover:text-slate-900">
                Funcionalidades
                <svg className="h-3 w-3 text-slate-400" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <div className="pointer-events-none absolute left-1/2 top-full z-30 hidden w-[820px] -translate-x-1/2 translate-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl group-hover:pointer-events-auto group-hover:block">
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
