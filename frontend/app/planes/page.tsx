import Link from 'next/link';
import { MarketingLayout } from '@/components/marketing-layout';

export default function PlanesPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Planes</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Planes flexibles para cada tamaño</h1>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { title: 'Starter', price: '$29.990', desc: 'Ideal para un profesional.' },
              { title: 'Growth', price: '$49.990', desc: 'Equipos y agenda completa.' },
              { title: 'Pro', price: '$89.990', desc: 'Multi-sucursal y reportes avanzados.' },
            ].map((plan) => (
              <div key={plan.title} className="rounded-3xl border border-slate-100 bg-slate-50/70 p-6">
                <p className="text-sm font-semibold text-slate-900">{plan.title}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{plan.price}</p>
                <p className="mt-2 text-sm text-slate-500">{plan.desc}</p>
                <Link
                  href="/login"
                  className="mt-6 inline-flex rounded-full bg-[var(--af-action)] px-4 py-2 text-xs font-semibold text-white"
                >
                  Elegir plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
