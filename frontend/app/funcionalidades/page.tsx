import Link from 'next/link';
import { MarketingLayout } from '@/components/marketing-layout';

const featureSections = [
  {
    title: 'Capta',
    items: ['Agenda online', 'Reservas online', 'Recordatorios automáticos', 'Ficha clínica', 'Agenda médica', 'Historia clínica'],
  },
  {
    title: 'Gestiona',
    items: [
      'Pago online',
      'Control de inventarios',
      'Integraciones API',
      'Reportes de gestión',
      'Reporte de comisiones',
      'Sistema de caja',
      'Facturación electrónica',
      'Máquina POS',
      'Boleta de honorarios',
    ],
  },
  {
    title: 'Crece',
    items: ['Email marketing', 'Encuestas de satisfacción', 'Fidelización de clientes', 'Gift cards', 'Charly'],
  },
];

export default function FuncionalidadesPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Funcionalidades</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Todo lo que tu negocio necesita</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-500">
              Automatiza reservas, gestiona pagos y acelera el crecimiento con herramientas pensadas para equipos de
              servicios.
            </p>
          </div>
          <Link href="/" className="text-xs font-semibold text-[var(--af-primary)]">
            Volver al inicio
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featureSections.map((section) => (
            <div key={section.title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{section.title}</p>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                {section.items.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-200" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}
