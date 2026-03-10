import { MarketingLayout } from '@/components/marketing-layout';

export default function NegociosPage() {
  return (
    <MarketingLayout>
      <section className="relative mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">Negocios</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                AgendaFlow se adapta a tu industria
              </h1>
            </div>
            <p className="text-sm text-slate-500">Selecciona tu rubro y configura servicios en minutos.</p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {[
              {
                title: 'Estética y belleza',
                items: [
                  'Centros de estética',
                  'Spas',
                  'Salones de belleza',
                  'Barberías',
                  'Peluquerías',
                  'Manicure y pedicure',
                  'Cejas y pestañas',
                ],
              },
              {
                title: 'Salud',
                items: [
                  'Centros médicos',
                  'Clínicas',
                  'Fisioterapia',
                  'Kinesiólogos',
                  'Psicólogos',
                  'Consultas médicas',
                  'Medicina alternativa',
                  'Centro de podología',
                ],
              },
              {
                title: 'Bienestar',
                items: [
                  'Nutricionistas',
                  'Centros deportivos',
                  'Centros de Crossfit',
                  'Estudios de pilates',
                  'Estudios de yoga',
                ],
              },
              {
                title: 'Salud y educación',
                items: [
                  'Neurodesarrollo',
                  'Inclusión social',
                  'Fonoaudiología',
                  'Terapia Ocupacional',
                  'Psicopedagogía',
                  'Refuerzo Escolar',
                ],
              },
            ].map((group) => (
              <div key={group.title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{group.title}</p>
                <div className="mt-4 grid gap-2 text-xs text-slate-600">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-full border border-slate-100 bg-slate-50 px-3 py-2">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
