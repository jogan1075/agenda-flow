import { MarketingLayout } from '@/components/marketing-layout';

export default function FuncionalidadesPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Funcionalidades</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Todo lo que necesitas para operar</h1>

          <div id="agenda" className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
              <p className="text-sm font-semibold text-slate-900">Agenda y reservas</p>
              <p className="mt-2 text-sm text-slate-500">
                Slots en tiempo real, profesionales asociados y reservas online.
              </p>
            </div>
            <div id="pagos" className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
              <p className="text-sm font-semibold text-slate-900">Pagos y comisiones</p>
              <p className="mt-2 text-sm text-slate-500">
                Seguimiento de pagos, comisiones por profesional y reportes.
              </p>
            </div>
            <div id="whatsapp" className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
              <p className="text-sm font-semibold text-slate-900">WhatsApp y recordatorios</p>
              <p className="mt-2 text-sm text-slate-500">
                Bot de reservas, confirmaciones y recordatorios automáticos.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
