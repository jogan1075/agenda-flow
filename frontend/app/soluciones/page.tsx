import { MarketingLayout } from '@/components/marketing-layout';

export default function SolucionesPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Soluciones</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Escala tu operación sin fricción</h1>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div id="sucursales" className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
              <p className="text-sm font-semibold text-slate-900">Multi-sucursal</p>
              <p className="mt-2 text-sm text-slate-500">
                Configura horarios, servicios y equipos por cada sede.
              </p>
            </div>
            <div id="profesionales" className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
              <p className="text-sm font-semibold text-slate-900">Profesionales</p>
              <p className="mt-2 text-sm text-slate-500">
                Gestiona disponibilidad, comisiones y rendimiento del equipo.
              </p>
            </div>
            <div id="reportes" className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
              <p className="text-sm font-semibold text-slate-900">Reportes</p>
              <p className="mt-2 text-sm text-slate-500">
                Ventas, ocupación y estado de pagos en tiempo real.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
