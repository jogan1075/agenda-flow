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
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-500/80">AgendaFlow</p>
            <h1
              className="mt-4 text-4xl font-semibold leading-tight text-slate-900 md:text-5xl lg:text-6xl"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Gestión inteligente de citas y reservas para negocios de servicios.
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-600 md:text-lg">
              Controla disponibilidad, recordatorios y pagos en un solo lugar. AgendaFlow automatiza reservas
              presenciales y online con un diseño simple y confiable.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                Probar el manager
              </Link>
              <Link
                href="/reservas"
                className="rounded-full border border-slate-200 px-6 py-3 text-sm text-slate-700 transition hover:border-slate-300"
              >
                Ver pagina de reservas
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { value: '+35%', label: 'Más ocupación' },
                { value: '3x', label: 'Menos no-show' },
                { value: '24/7', label: 'Reservas online' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                  <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-xl">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-500">Vista rápida</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Panel de control</h2>
              <div className="mt-6 grid gap-4">
                {[
                  { label: 'Agenda en tiempo real', value: 'Bloques disponibles y reservas confirmadas.' },
                  { label: 'Ventas + comisiones', value: 'Seguimiento de pagos y comisiones por profesional.' },
                  { label: 'Clientes recurrentes', value: 'Historial, preferencias y automatizaciones.' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 grid gap-3 text-xs text-slate-500">
              <div className="flex items-center justify-between">
                <span>Integraciones</span>
                <span>WhatsApp · MercadoPago · Email</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Multisucursal</span>
                <span>Horarios y equipos independientes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'Negocios', text: 'Rubros y subcategorías listos para configurar.', href: '/negocios' },
            { title: 'Funcionalidades', text: 'Todo lo que necesitas para agendar y cobrar.', href: '/funcionalidades' },
            { title: 'Planes', text: 'Compara planes y elige el ideal.', href: '/planes' },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1"
            >
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="mt-2 text-sm text-slate-500">{item.text}</p>
              <span className="mt-4 inline-flex text-xs font-semibold text-emerald-600">Ver más</span>
            </Link>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}
