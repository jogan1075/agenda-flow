import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MarketingLayout } from '@/components/marketing-layout';

export default function HomePage() {
  const appMode = process.env.NEXT_PUBLIC_APP_MODE;
  if (appMode === 'reservas') {
    redirect('/reservas');
  }
  if (appMode === 'manager') {
    redirect('/login');
  }

  return (
    <MarketingLayout>
      <section className="relative mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-[36px] border border-white/80 bg-[linear-gradient(120deg,rgba(37,99,235,0.08),rgba(15,23,42,0.02))] p-8 shadow-sm">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">
                AgendaFlow
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
                Gestión inteligente de citas y reservas para negocios de servicios.
              </h1>
              <p className="mt-5 max-w-xl text-base text-slate-600 md:text-lg">
                AgendaFlow combina agenda, pagos y comunicación con clientes en un solo panel. Reduce no-show y
                aumenta tu ocupación con recordatorios automáticos.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="rounded-full bg-[var(--af-action)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Probar el manager
                </Link>
                <Link
                  href="/reservas"
                  className="rounded-full border border-slate-200 px-6 py-3 text-sm text-slate-700 transition hover:border-slate-300"
                >
                  Ver página de reservas
                </Link>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { value: '+35%', label: 'Más ocupación' },
                  { value: '3x', label: 'Menos no-show' },
                  { value: '24/7', label: 'Reservas online' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm">
                    <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/80 bg-white p-6 shadow-xl">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Resumen</p>
                  <span className="rounded-full bg-[var(--af-primary)]/10 px-3 py-1 text-[11px] font-semibold text-[var(--af-primary)]">
                    Hoy
                  </span>
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Panel de control</h2>
                <div className="mt-6 grid gap-3">
                  {[
                    { label: 'Agenda completa', value: '12 citas confirmadas' },
                    { label: 'Pagos del día', value: '$ 185.000' },
                    { label: 'Recordatorios', value: '8 WhatsApp enviados' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                      <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 grid gap-3 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Integraciones</span>
                  <span>WhatsApp · MercadoPago · Email</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Multi-sucursal</span>
                  <span>Horarios y equipos independientes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Rubros</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">AgendaFlow se adapta a tu negocio</h2>
            <p className="mt-3 text-sm text-slate-500">
              Configura catálogos de servicios, profesionales y horarios según tu rubro.
            </p>
            <div className="mt-5 grid gap-3">
              {[
                'Estética y belleza',
                'Salud',
                'Bienestar',
                'Centros deportivos',
                'Educación y terapias',
              ].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                  <span className="text-sm font-semibold text-slate-800">{item}</span>
                  <span className="text-xs text-slate-400">Listo para usar</span>
                </div>
              ))}
            </div>
            <Link href="/negocios" className="mt-6 inline-flex text-xs font-semibold text-[var(--af-primary)]">
              Ver todos los rubros
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Beneficios</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Más reservas, menos fricción</h2>
            <div className="mt-5 grid gap-4">
              {[
                { title: 'Reservas online', text: 'Clientes reservan en segundos desde cualquier dispositivo.' },
                { title: 'Recordatorios automáticos', text: 'WhatsApp y correo para reducir inasistencias.' },
                { title: 'Pagos integrados', text: 'Cobra con MercadoPago o transferencias.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
