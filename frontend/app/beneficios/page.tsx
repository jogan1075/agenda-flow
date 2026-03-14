import { MarketingLayout } from '@/components/marketing-layout';

export default function BeneficiosPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Beneficios</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Resultados visibles desde la primera semana</h1>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { title: 'Más reservas', text: 'Disponibilidad online y confirmaciones automáticas.' },
              { title: 'Menos ausencias', text: 'Recordatorios por WhatsApp y correo.' },
              { title: 'Control financiero', text: 'Ventas, pagos y comisiones centralizadas.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-2 text-sm text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
