import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Fraunces, Sora } from 'next/font/google';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' });

export default function HomePage() {
  const appMode = process.env.NEXT_PUBLIC_APP_MODE;
  if (appMode === 'reservas') {
    redirect('/reservas');
  }
  if (appMode === 'manager') {
    redirect('/login');
  }

  return (
    <div className={`${sora.variable} ${fraunces.variable} min-h-screen bg-[#0f172a] text-white`}>
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1f2937_0%,#0f172a_55%,#0b1022_100%)]" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-400/20 blur-[120px]" />
        <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-[140px]" />

        <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-12 md:pt-20">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-lg font-semibold">AF</span>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">AgendaFlow</p>
                <p className="text-xs text-zinc-400">Gestión inteligente de citas</p>
              </div>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/reservas"
                className="rounded-full border border-white/20 px-5 py-2 text-sm text-white/80 transition hover:border-white/60 hover:text-white"
              >
                Ver demo reservas
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-[#0f172a] transition hover:bg-emerald-300"
              >
                Ingresar al manager
              </Link>
            </div>
          </header>

          <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-200/70">AgendaFlow</p>
              <h1
                className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl"
                style={{ fontFamily: 'var(--font-fraunces)' }}
              >
                Gestiona reservas, profesionales y pagos con una agenda que trabaja sola.
              </h1>
              <p className="mt-5 max-w-xl text-base text-zinc-300 md:text-lg">
                AgendaFlow centraliza disponibilidad, recordatorios por WhatsApp, clientes y ventas en un panel simple.
                Optimiza tu tiempo y reduce inasistencias con flujos automatizados.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-[#0f172a] transition hover:bg-emerald-300"
                >
                  Probar el manager
                </Link>
                <Link
                  href="/reservas"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 transition hover:border-white/60 hover:text-white"
                >
                  Ver pagina de reservas
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-zinc-300">
                <div>
                  <p className="text-2xl font-semibold text-white">+35%</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Más ocupación</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">3x</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Menos no-show</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">24/7</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Reservas online</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">Vista rapida</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Panel de control</h2>
                <div className="mt-6 grid gap-4">
                  {[
                    { label: 'Agenda en tiempo real', value: 'Bloques disponibles y reservas confirmadas.' },
                    { label: 'Ventas + comisiones', value: 'Seguimiento de pagos y comisiones por profesional.' },
                    { label: 'Clientes recurrentes', value: 'Historial, preferencias y automatizaciones.' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="mt-1 text-xs text-zinc-300">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Integraciones</span>
                  <span>WhatsApp · MercadoPago · Email</span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Multisucursal</span>
                  <span>Horarios y profesionales independientes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-6 pb-20">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Agenda inteligente',
                text: 'Selecciona servicio y profesional; AgendaFlow propone los mejores horarios disponibles.',
              },
              {
                title: 'Reservas por WhatsApp',
                text: 'Bot automatizado con confirmaciones, reprogramaciones y recordatorios.',
              },
              {
                title: 'Ventas y comisiones',
                text: 'Control de pagos, estados y comisiones por profesional en tiempo real.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-300">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Industrias</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Pensado para negocios de servicios</h2>
              <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                {[
                  'Estetica y belleza: salones, barberias, manicure.',
                  'Salud: clinicas, kinesiologia, psicologia.',
                  'Bienestar: yoga, pilates, nutricion.',
                ].map((item) => (
                  <li key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Resultados</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Menos vacios, mas ventas y mejor experiencia</h2>
              <p className="mt-4 text-sm text-zinc-300">
                Automatiza confirmaciones, bloquea horarios ocupados y da visibilidad completa del equipo. El cliente
                ve disponibilidad real y paga en linea cuando el negocio lo necesita.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  { label: 'Recordatorios automaticos', value: 'WhatsApp + email personalizados' },
                  { label: 'Agenda multi-sucursal', value: 'Horarios y equipos independientes' },
                  { label: 'Bot de reservas', value: 'Disponibilidad, confirmacion y cancelacion' },
                  { label: 'Pagos integrados', value: 'MercadoPago o cobro manual' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="mt-1 text-xs text-zinc-300">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-t border-white/10 bg-white/5">
          <div className="mx-auto max-w-6xl px-6 py-16 text-center">
            <h2 className="text-3xl font-semibold text-white">Listo para probar AgendaFlow</h2>
            <p className="mt-3 text-sm text-zinc-300">
              Inicia con el panel de manager o comparte la pagina de reservas con tus clientes.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/login"
                className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-[#0f172a] transition hover:bg-emerald-300"
              >
                Crear mi cuenta
              </Link>
              <Link
                href="/reservas"
                className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 transition hover:border-white/60 hover:text-white"
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
