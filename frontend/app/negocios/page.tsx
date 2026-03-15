import Link from 'next/link';
import { MarketingLayout } from '@/components/marketing-layout';
import { BUSINESS_CATEGORIES, getBusinessLink } from '@/lib/marketing-data';

export default function NegociosPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Negocios</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">AgendaFlow se adapta a tu rubro</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-500">
              Explora los sectores que puedes configurar en minutos. Cada rubro incluye flujos, servicios y reportes
              listos para usar.
            </p>
          </div>
          <Link href="/" className="text-xs font-semibold text-[var(--af-primary)]">
            Volver al inicio
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {BUSINESS_CATEGORIES.map((section) => (
            <div key={section.title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{section.title}</p>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                {section.items.map((item) => (
                  <Link key={item.slug} href={getBusinessLink(item.slug)} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-200" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}
