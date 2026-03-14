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
      <section className="relative mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">
              AgendaFlow
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
              Agenda, pagos y comunicación en un solo lugar para tu negocio.
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-600 md:text-lg">
              La plataforma que centraliza reservas, recordatorios y comisiones. Reduce ausencias y ofrece una experiencia
              profesional para tus clientes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-full bg-[var(--af-action)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Probar gratis
              </Link>
              <Link
                href="/reservas"
                className="rounded-full border border-slate-200 px-6 py-3 text-sm text-slate-700 transition hover:border-slate-300"
              >
                Ver reserva online
              </Link>
              <Link
                href="/privacy"
                className="rounded-full border border-slate-200 px-6 py-3 text-sm text-slate-700 transition hover:border-slate-300"
              >
                Política de privacidad
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { value: '+35%', label: 'Más ocupación' },
                { value: '3x', label: 'Menos no-show' },
                { value: '24/7', label: 'Reservas online' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Panel de ventas</p>
                <span className="rounded-full bg-[var(--af-primary)]/10 px-3 py-1 text-[11px] font-semibold text-[var(--af-primary)]">
                  En tiempo real
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Resumen diario</h2>
              <div className="mt-6 grid gap-3">
                {[
                  { label: 'Reservas confirmadas', value: '12 citas' },
                  { label: 'Ventas del día', value: '$ 185.000' },
                  { label: 'Comisiones', value: '$ 62.000' },
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
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Negocios</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">AgendaFlow se adapta a tu industria</h2>
            </div>
            <Link href="/negocios" className="text-sm font-semibold text-[var(--af-primary)]">
              Ver todas las categorías
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { title: 'Estética y belleza', items: ['Salones', 'Barberías', 'Spas'] },
              { title: 'Salud', items: ['Clínicas', 'Fisioterapia', 'Psicología'] },
              { title: 'Bienestar', items: ['Yoga', 'Pilates', 'Nutrición'] },
            ].map((group) => (
              <div key={group.title} className="rounded-3xl border border-slate-100 bg-slate-50/80 p-6">
                <p className="text-sm font-semibold text-slate-900">{group.title}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-full border border-slate-100 bg-white px-3 py-2">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'Agenda inteligente', text: 'Disponibilidad en tiempo real y reservas automatizadas.' },
            { title: 'Recordatorios WhatsApp', text: 'Reduce ausencias con mensajes personalizados.' },
            { title: 'Pagos y comisiones', text: 'Controla ingresos y comisiones por profesional.' },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="mt-2 text-sm text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 p-10 text-white shadow-lg">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">Listo para comenzar</p>
              <h2 className="mt-3 text-3xl font-semibold">Empieza hoy con AgendaFlow</h2>
              <p className="mt-3 text-sm text-white/70">
                Configura tu negocio en minutos y habilita reservas online desde el primer día.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/planes"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900"
              >
                Ver planes
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white"
              >
                Probar el manager
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
