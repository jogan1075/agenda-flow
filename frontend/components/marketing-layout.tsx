import Link from 'next/link';
import { Manrope, Playfair_Display } from 'next/font/google';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${manrope.variable} ${playfair.variable} min-h-screen bg-[#f6f7fb] text-[#0f172a]`}>
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#eef2ff_0%,#f6f7fb_45%,#f8fafc_100%)]" />
        <div className="absolute -left-40 top-20 h-72 w-72 rounded-full bg-emerald-200/40 blur-[110px]" />
        <div className="absolute right-0 top-32 h-96 w-96 rounded-full bg-sky-200/45 blur-[130px]" />

        <section className="relative mx-auto max-w-6xl px-6 pb-8 pt-10 md:pt-14">
          <header className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0f172a] text-sm font-semibold text-white">
                AF
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-500">AgendaFlow</p>
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
