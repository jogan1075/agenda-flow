import Link from 'next/link';
import { MarketingLayout } from '@/components/marketing-layout';

export default function FaqPage() {
  return (
    <MarketingLayout>
      <section className="relative mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-semibold text-slate-900">Preguntas frecuentes</h1>
            <Link href="/login" className="text-sm font-semibold text-[var(--af-primary)]">
              Hablar con soporte
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              {
                q: 'Puedo usar AgendaFlow sin pagos online?',
                a: 'Sí, puedes activar modo manual y cobrar en efectivo o transferencia.',
              },
              {
                q: 'Se integra con WhatsApp?',
                a: 'Sí, incluye bot de reservas, recordatorios y respuestas automáticas.',
              },
              {
                q: 'Cuánto demora la implementación?',
                a: 'En minutos puedes tener tus servicios y profesionales configurados.',
              },
              {
                q: 'Puedo tener varias sucursales?',
                a: 'Sí, cada sucursal tiene horarios y equipos independientes.',
              },
            ].map((item) => (
              <div key={item.q} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-sm font-semibold text-slate-900">{item.q}</p>
                <p className="mt-2 text-xs text-slate-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
