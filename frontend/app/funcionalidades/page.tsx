import { MarketingLayout } from '@/components/marketing-layout';

export default function FuncionalidadesPage() {
  return (
    <MarketingLayout>
      <section className="relative mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Funcionalidades</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              Todo lo que tu equipo necesita para agendar y cobrar
            </h1>
            <p className="mt-4 text-sm text-slate-600">
              Configura profesionales, servicios, horarios, y automatiza mensajes para no perder reservas.
            </p>
            <div className="mt-6 grid gap-3 text-xs text-slate-600">
              {[
                'Registro de negocio y sucursales',
                'Creación de servicios y profesionales',
                'Agenda calendario con horarios disponibles',
                'Reservas web y por WhatsApp',
                'Recordatorios automáticos y mensajes personalizados',
                'Gestión de clientes y reportes básicos',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { title: 'Agenda en línea', text: 'Disponibilidad en tiempo real y bloqueo automático de horarios.' },
              { title: 'Bot WhatsApp', text: 'Confirmaciones, cancelaciones y reprogramaciones.' },
              { title: 'Pagos flexibles', text: 'Cobro manual o integración con MercadoPago.' },
              { title: 'Clientes recurrentes', text: 'Historial, notas y preferencias por cliente.' },
              { title: 'Comisiones', text: 'Control por profesional para negocios de estética.' },
              { title: 'Reportes', text: 'Ventas, estados y ocupación por periodo.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
