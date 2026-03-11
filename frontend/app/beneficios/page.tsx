import { MarketingLayout } from '@/components/marketing-layout';

export default function BeneficiosPage() {
  return (
    <MarketingLayout>
      <section className="relative mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Beneficios</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Resultados visibles desde el primer día</h1>
            </div>
            <p className="text-sm text-slate-500">AgendaFlow mejora la experiencia de clientes y equipos.</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
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
              <div key={item.title} className="rounded-3xl border border-slate-100 bg-slate-50/60 p-6 shadow-sm">
                <h1 className="text-lg font-semibold text-slate-900">{item.title}</h1>
                <p className="mt-2 text-sm text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
