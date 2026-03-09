import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Manrope, Playfair_Display } from 'next/font/google';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export default function HomePage() {
  const appMode = process.env.NEXT_PUBLIC_APP_MODE;
  if (appMode === 'reservas') {
    redirect('/reservas');
  }
  if (appMode === 'manager') {
    redirect('/login');
  }

  return (
    <div className={`${manrope.variable} ${playfair.variable} min-h-screen bg-[#f6f7fb] text-[#0f172a]`}>
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#eef2ff_0%,#f6f7fb_45%,#f8fafc_100%)]" />
        <div className="absolute -left-40 top-20 h-72 w-72 rounded-full bg-emerald-200/40 blur-[110px]" />
        <div className="absolute right-0 top-32 h-96 w-96 rounded-full bg-sky-200/45 blur-[130px]" />

        <section className="relative mx-auto max-w-6xl px-6 pb-12 pt-10 md:pt-14">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0f172a] text-sm font-semibold text-white">
                AF
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-500">AgendaFlow</p>
                <p className="text-xs text-slate-500">Gestión inteligente de citas</p>
              </div>
            </div>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <a href="#beneficios" className="transition hover:text-slate-900">
                Beneficios
              </a>
              <a href="#soluciones" className="transition hover:text-slate-900">
                Soluciones
              </a>
              <a href="#precios" className="transition hover:text-slate-900">
                Planes
              </a>
              <a href="#faq" className="transition hover:text-slate-900">
                FAQ
              </a>
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
                className="rounded-full bg-[#0f172a] px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-900"
              >
                Ver demo
              </Link>
            </div>
          </header>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
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

        <section id="beneficios" className="relative mx-auto max-w-6xl px-6 pb-16 pt-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Agenda inteligente',
                text: 'Elige servicio y profesional; AgendaFlow propone los mejores horarios disponibles.',
              },
              {
                title: 'Reservas por WhatsApp',
                text: 'Bot automatizado con confirmaciones, reprogramaciones y recordatorios.',
              },
              {
                title: 'Ventas y comisiones',
                text: 'Controla pagos, estados y comisiones por profesional en tiempo real.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="soluciones" className="relative mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">Industrias</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Pensado para negocios de servicios</h2>
              <div className="mt-6 grid gap-3 text-sm text-slate-600">
                {[
                  'Estética y belleza: salones, barberías, manicure.',
                  'Salud: clínicas, kinesiología, psicología.',
                  'Bienestar: yoga, pilates, nutrición.',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">Resultados</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Menos vacíos, más ventas y mejor experiencia</h2>
              <p className="mt-4 text-sm text-slate-600">
                Automatiza confirmaciones, bloquea horarios ocupados y da visibilidad completa del equipo. El cliente
                ve disponibilidad real y paga en línea cuando el negocio lo necesita.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  { label: 'Recordatorios automáticos', value: 'WhatsApp + email personalizados' },
                  { label: 'Agenda multi-sucursal', value: 'Horarios y equipos independientes' },
                  { label: 'Bot de reservas', value: 'Disponibilidad, confirmación y cancelación' },
                  { label: 'Pagos integrados', value: 'MercadoPago o cobro manual' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="precios" className="relative mx-auto max-w-6xl px-6 pb-16">
          <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">Planes</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">Elige el plan para tu negocio</h2>
              </div>
              <p className="text-sm text-slate-500">Sin comisiones ocultas. Soporte local.</p>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                {
                  name: 'Starter',
                  price: '$19.990',
                  desc: 'Agenda básica + reservas online.',
                  perks: ['1 sucursal', 'Recordatorios WhatsApp', 'Clientes ilimitados'],
                },
                {
                  name: 'Growth',
                  price: '$39.990',
                  desc: 'Ventas, comisiones y equipos.',
                  perks: ['3 sucursales', 'Pagos integrados', 'Reportes avanzados'],
                  highlight: true,
                },
                {
                  name: 'Pro',
                  price: 'Custom',
                  desc: 'Operaciones multi-sede.',
                  perks: ['Sucursales ilimitadas', 'Soporte prioritario', 'Integraciones a medida'],
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-3xl border p-6 shadow-sm ${
                    plan.highlight ? 'border-emerald-200 bg-emerald-50' : 'border-white/70 bg-white'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{plan.name}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{plan.price}</p>
                  <p className="mt-2 text-sm text-slate-500">{plan.desc}</p>
                  <div className="mt-4 grid gap-2 text-xs text-slate-600">
                    {plan.perks.map((perk) => (
                      <span key={perk} className="rounded-full border border-slate-100 bg-white px-3 py-2">
                        {perk}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/login"
                    className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                      plan.highlight
                        ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                        : 'border border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {plan.highlight ? 'Elegir plan' : 'Hablar con ventas'}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="relative mx-auto max-w-6xl px-6 pb-20">
          <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-3xl font-semibold text-slate-900">Preguntas frecuentes</h2>
              <Link href="/login" className="text-sm font-semibold text-emerald-600">
                Hablar con soporte
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                {
                  q: 'Puedo usar AgendaFlow sin pagos online?',
                  a: 'Si, puedes activar modo manual y cobrar en efectivo o transferencia.',
                },
                {
                  q: 'Se integra con WhatsApp?',
                  a: 'Si, incluye bot de reservas, recordatorios y respuestas automáticas.',
                },
                {
                  q: 'Cuanto demora la implementación?',
                  a: 'En minutos puedes tener tus servicios y profesionales configurados.',
                },
                {
                  q: 'Puedo tener varias sucursales?',
                  a: 'Si, cada sucursal tiene horarios y equipos independientes.',
                },
              ].map((item) => (
                <div key={item.q} className="rounded-2xl border border-slate-100 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">{item.q}</p>
                  <p className="mt-2 text-xs text-slate-500">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative border-t border-white/70 bg-white/90">
          <div className="mx-auto max-w-6xl px-6 py-16 text-center">
            <h2 className="text-3xl font-semibold text-slate-900">AgendaFlow listo para tu negocio</h2>
            <p className="mt-3 text-sm text-slate-500">
              Empieza con el panel de manager o comparte la página de reservas con tus clientes.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/login"
                className="rounded-full bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
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
