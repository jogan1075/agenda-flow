import { MarketingLayout } from '@/components/marketing-layout';

export default function BeneficiosPage() {
  return (
    <MarketingLayout>
      <section className="relative mx-auto max-w-6xl px-6 pb-16">
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
              <h1 className="text-lg font-semibold text-slate-900">{item.title}</h1>
              <p className="mt-2 text-sm text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}
