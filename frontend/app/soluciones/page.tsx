import { MarketingLayout } from '@/components/marketing-layout';

export default function SolucionesPage() {
  return (
    <MarketingLayout>
      <section className="relative mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">Industrias</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Pensado para negocios de servicios</h1>
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
              Automatiza confirmaciones, bloquea horarios ocupados y da visibilidad completa del equipo. El cliente ve
              disponibilidad real y paga en línea cuando el negocio lo necesita.
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
    </MarketingLayout>
  );
}
