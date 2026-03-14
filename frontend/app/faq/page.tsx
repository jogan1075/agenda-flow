import { MarketingLayout } from '@/components/marketing-layout';

export default function FaqPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">FAQ</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Preguntas frecuentes</h1>
          <div className="mt-8 grid gap-4">
            {[
              {
                q: '¿Puedo ofrecer reservas online?',
                a: 'Sí, puedes compartir tu página de reservas y recibir citas 24/7.',
              },
              {
                q: '¿Se integra con WhatsApp?',
                a: 'Sí, enviamos recordatorios y confirmaciones automáticas.',
              },
              {
                q: '¿Puedo administrar comisiones?',
                a: 'Sí, cada profesional puede tener su porcentaje configurado.',
              },
            ].map((item) => (
              <div key={item.q} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
                <p className="text-sm font-semibold text-slate-900">{item.q}</p>
                <p className="mt-2 text-sm text-slate-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
