import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import {
  BadgeDollarSign,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Gift,
  HeartPulse,
  Mail,
  Scissors,
  Smile,
  Stethoscope,
  Store,
  UserRound,
} from 'lucide-react';

type MarketingLayoutProps = {
  children: ReactNode;
  className?: string;
};

export function MarketingLayout({ children, className }: MarketingLayoutProps) {
  const negociosSections = [
    {
      title: 'Estética y belleza',
      items: [
        { label: 'Centros de estética', icon: Scissors, href: '/negocios?categoria=estetica' },
        { label: 'Spas', icon: Store, href: '/negocios?categoria=estetica' },
        { label: 'Salones de belleza', icon: Scissors, href: '/negocios?categoria=estetica' },
        { label: 'Barberías', icon: Scissors, href: '/negocios?categoria=estetica' },
        { label: 'Peluquerías', icon: Scissors, href: '/negocios?categoria=estetica' },
        { label: 'Manicure y pedicure', icon: UserRound, href: '/negocios?categoria=estetica' },
        { label: 'Cejas y pestañas', icon: Smile, href: '/negocios?categoria=estetica' },
      ],
    },
    {
      title: 'Salud',
      items: [
        { label: 'Centros médicos', icon: Stethoscope, href: '/negocios?categoria=salud' },
        { label: 'Clínicas', icon: HeartPulse, href: '/negocios?categoria=salud' },
        { label: 'Fisioterapia', icon: HeartPulse, href: '/negocios?categoria=salud' },
        { label: 'Kinesiólogos', icon: HeartPulse, href: '/negocios?categoria=salud' },
        { label: 'Psicólogos', icon: UserRound, href: '/negocios?categoria=salud' },
        { label: 'Consultas médicas', icon: Stethoscope, href: '/negocios?categoria=salud' },
        { label: 'Medicina alternativa', icon: HeartPulse, href: '/negocios?categoria=salud' },
        { label: 'Centro de podología', icon: UserRound, href: '/negocios?categoria=salud' },
      ],
    },
    {
      title: 'Bienestar',
      items: [
        { label: 'Nutricionistas', icon: HeartPulse, href: '/negocios?categoria=bienestar' },
        { label: 'Centros deportivos', icon: UserRound, href: '/negocios?categoria=bienestar' },
        { label: 'Centros de Crossfit', icon: UserRound, href: '/negocios?categoria=bienestar' },
        { label: 'Estudios de pilates', icon: UserRound, href: '/negocios?categoria=bienestar' },
        { label: 'Estudios de yoga', icon: UserRound, href: '/negocios?categoria=bienestar' },
      ],
    },
  ];

  const funcionalidadesSections = [
    {
      title: 'Capta',
      items: [
        { label: 'Agenda online', icon: CalendarDays, href: '/funcionalidades' },
        { label: 'Reservas online', icon: CalendarDays, href: '/funcionalidades' },
        { label: 'Recordatorios automáticos', icon: Mail, href: '/funcionalidades' },
        { label: 'Ficha clínica', icon: ClipboardList, href: '/funcionalidades' },
        { label: 'Agenda médica', icon: CalendarDays, href: '/funcionalidades' },
        { label: 'Historia clínica', icon: ClipboardList, href: '/funcionalidades' },
      ],
    },
    {
      title: 'Gestiona',
      items: [
        { label: 'Pago online', icon: CreditCard, href: '/funcionalidades#pagos' },
        { label: 'Control de inventarios', icon: Store, href: '/funcionalidades' },
        { label: 'Integraciones API', icon: BadgeDollarSign, href: '/funcionalidades' },
        { label: 'Reportes de gestión', icon: ClipboardList, href: '/funcionalidades' },
        { label: 'Reporte de comisiones', icon: BadgeDollarSign, href: '/funcionalidades#pagos' },
        { label: 'Sistema de caja', icon: BadgeDollarSign, href: '/funcionalidades#pagos' },
        { label: 'Facturación electrónica', icon: BadgeDollarSign, href: '/funcionalidades' },
        { label: 'Máquina POS', icon: CreditCard, href: '/funcionalidades' },
        { label: 'Boleta de honorarios', icon: BadgeDollarSign, href: '/funcionalidades' },
      ],
    },
    {
      title: 'Crece',
      items: [
        { label: 'Email marketing', icon: Mail, href: '/funcionalidades' },
        { label: 'Encuestas de satisfacción', icon: Smile, href: '/funcionalidades' },
        { label: 'Fidelización de clientes', icon: UserRound, href: '/funcionalidades' },
        { label: 'Gift cards', icon: Gift, href: '/funcionalidades' },
        { label: 'Charly', icon: Smile, href: '/funcionalidades' },
      ],
    },
  ];
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
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-900"
              >
                Negocios
                <span className="text-xs text-slate-400">▾</span>
              </button>
              <div className="absolute left-1/2 top-full z-40 mt-4 hidden w-[940px] -translate-x-1/2 rounded-3xl border border-slate-100 bg-white p-8 shadow-2xl group-hover:block">
                <div className="grid gap-8 lg:grid-cols-3">
                  {negociosSections.map((section) => (
                    <div key={section.title}>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                        {section.title}
                      </p>
                      <div className="mt-5 grid gap-3">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={`${section.title}-${item.label}`}
                              href={item.href}
                              className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                            >
                              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-500">
                                <Icon className="h-4 w-4" />
                              </span>
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-900"
              >
                Funcionalidades
                <span className="text-xs text-slate-400">▾</span>
              </button>
              <div className="absolute left-1/2 top-full z-40 mt-4 hidden w-[980px] -translate-x-1/2 rounded-3xl border border-slate-100 bg-white p-8 shadow-2xl group-hover:block">
                <div className="grid gap-8 lg:grid-cols-3">
                  {funcionalidadesSections.map((section) => (
                    <div key={section.title}>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                        {section.title}
                      </p>
                      <div className="mt-5 grid gap-3">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={`${section.title}-${item.label}`}
                              href={item.href}
                              className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                            >
                              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-500">
                                <Icon className="h-4 w-4" />
                              </span>
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/soluciones" className="text-sm font-medium text-slate-700 transition hover:text-slate-900">
              Soluciones
            </Link>
            <Link href="/planes" className="text-sm font-medium text-slate-700 transition hover:text-slate-900">
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
