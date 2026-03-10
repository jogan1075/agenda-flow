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
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">
              AgendaFlow
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
              Agenda y reservas con una experiencia premium para tus clientes.
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-600 md:text-lg">
              Unifica agenda, pagos, comunicaciones y reportes en un sistema pensado para negocios con altos
              estándares de atención.
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
                <div key={item.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-12 top-10 h-40 w-40 rounded-full bg-[var(--af-secondary)]/15 blur-[70px]" />
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Control central</p>
                  <span className="rounded-full bg-[var(--af-primary)]/10 px-3 py-1 text-[11px] font-semibold text-[var(--af-primary)]">
                    Premium
                  </span>
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Panel en vivo</h2>
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
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Beneficios</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Todo lo que necesitas para un servicio premium</h2>
            </div>
            <Link
              href="/beneficios"
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Ver detalle
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { title: 'Reservas online', text: 'Clientes reservan en segundos desde cualquier dispositivo.' },
              { title: 'Recordatorios automáticos', text: 'WhatsApp y correo para reducir inasistencias.' },
              { title: 'Pagos integrados', text: 'Cobra con MercadoPago o transferencias.' },
              { title: 'Ventas + comisiones', text: 'Control por profesional y reportes al día.' },
              { title: 'Multi-sucursal', text: 'Horarios y equipos independientes por sede.' },
              { title: 'Atención 24/7', text: 'Reservas disponibles incluso fuera de horario.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
