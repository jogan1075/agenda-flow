import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { MarketingLayout } from '@/components/marketing-layout';
import { BUSINESS_ITEMS, getBusinessBySlug, getBusinessLink } from '@/lib/marketing-data';

type PageProps = {
  params: Promise<{ slug: string; page: string }>;
};

const sectionImages = {
  agenda: 'https://images.pexels.com/photos/19675470/pexels-photo-19675470.jpeg?auto=compress&cs=tinysrgb&w=1200',
  pagos: 'https://images.pexels.com/photos/9304565/pexels-photo-9304565.jpeg?auto=compress&cs=tinysrgb&w=1200',
  recordatorios: 'https://images.pexels.com/photos/3183161/pexels-photo-3183161.jpeg?auto=compress&cs=tinysrgb&w=1200',
  clientes: 'https://images.pexels.com/photos/8844553/pexels-photo-8844553.jpeg?auto=compress&cs=tinysrgb&w=1200',
  marketing: 'https://images.pexels.com/photos/7005295/pexels-photo-7005295.jpeg?auto=compress&cs=tinysrgb&w=1200',
  reportes: 'https://images.pexels.com/photos/3183198/pexels-photo-3183198.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

const featureBlocks = [
  {
    title: 'Agenda online que se llena sola',
    description:
      'Tus clientes reservan 24/7 desde web o WhatsApp. Tú mantienes el control de horarios y disponibilidad.',
    image: sectionImages.agenda,
    bullets: ['Reserva online', 'Agenda por profesional', 'Bloqueos inteligentes'],
  },
  {
    title: 'Pagos integrados y caja ordenada',
    description: 'Acepta pagos, controla comisiones y centraliza tu flujo de caja sin planillas.',
    image: sectionImages.pagos,
    bullets: ['Pagos online', 'Comisiones automáticas', 'Cierres de caja'],
  },
  {
    title: 'Recordatorios automáticos',
    description: 'Reduce no-show con notificaciones por WhatsApp, email y SMS en el momento preciso.',
    image: sectionImages.recordatorios,
    bullets: ['Plantillas personalizadas', 'Confirmación con un clic', 'Menos cancelaciones'],
  },
  {
    title: 'Clientes y fichas al día',
    description: 'Centraliza historial, notas clínicas y preferencias para un servicio más personalizado.',
    image: sectionImages.clientes,
    bullets: ['Ficha completa', 'Notas internas', 'Historial de visitas'],
  },
  {
    title: 'Marketing que impulsa la demanda',
    description: 'Crea campañas segmentadas y promociones para fidelizar y vender más.',
    image: sectionImages.marketing,
    bullets: ['Campañas por segmentación', 'Gift cards', 'Promociones automáticas'],
  },
  {
    title: 'Reportes claros para decidir',
    description: 'Mide ventas, ocupación y crecimiento con dashboards en tiempo real.',
    image: sectionImages.reportes,
    bullets: ['Reportes de gestión', 'Indicadores clave', 'Exportación rápida'],
  },
];

const highlightStats = [
  { value: '+20.000', label: 'Negocios' },
  { value: '+135.000', label: 'Profesionales' },
  { value: '150M', label: 'Citas agendadas' },
  { value: '+20', label: 'Países' },
];

const valueColumns = [
  {
    title: 'Capta',
    items: ['Agenda online', 'Reservas 24/7', 'Sitio web propio', 'WhatsApp integrado', 'Google Reserve'],
  },
  {
    title: 'Gestiona',
    items: ['Control de horarios', 'Pagos y comisiones', 'Reportes de gestión', 'Cierres de caja', 'Multi-sucursal'],
  },
  {
    title: 'Crece',
    items: ['Marketing y campañas', 'Fidelización', 'Gift cards', 'Promociones', 'Encuestas'],
  },
];

export function generateStaticParams() {
  return BUSINESS_ITEMS.map((item) => ({
    slug: item.slug,
    page: `software-para-${item.slug}`,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);
  if (!business) return {};
  return {
    title: `Software para ${business.name} | AgendaFlow`,
    description: `Optimiza la agenda, pagos y comunicación en ${business.name.toLowerCase()} con AgendaFlow.`,
  };
}

export default async function BusinessSoftwarePage({ params }: PageProps) {
  const { slug, page } = await params;
  const business = getBusinessBySlug(slug);
  const expected = business ? `software-para-${business.slug}` : `software-para-${slug}`;

  if (!business) {
    notFound();
  }

  if (page !== expected) {
    redirect(getBusinessLink(business.slug));
  }

  return (
    <MarketingLayout>
      <section className="bg-[linear-gradient(135deg,#f5f3ff,rgba(255,255,255,0.7))]">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-8">
          <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            <Link href="/" className="transition hover:text-slate-600">
              AgendaFlow
            </Link>
            <span>/</span>
            <Link href="/negocios" className="transition hover:text-slate-600">
              Negocios
            </Link>
            <span>/</span>
            <span className="text-slate-500">{business.name}</span>
          </div>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Software especializado</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900 md:text-5xl">
                Software para {business.name.toLowerCase()}
              </h1>
              <p className="mt-4 max-w-xl text-sm text-slate-600 md:text-base">
                AgendaFlow reúne reservas, pagos, recordatorios y clientes en una plataforma moderna. Optimiza la
                ocupación de tu equipo y ofrece una experiencia premium desde el primer clic.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="rounded-full bg-[var(--af-action)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Probar gratis
                </Link>
                <Link
                  href="/reservas"
                  className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm text-slate-700 transition hover:border-slate-300"
                >
                  Ver demo de reservas
                </Link>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-4">
                {highlightStats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm">
                    <p className="text-xl font-semibold text-slate-900">{item.value}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[32px] border border-white/60 bg-white/80 p-5 shadow-2xl">
              <img src={business.heroImage} alt={business.name} className="h-full w-full rounded-2xl object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-4">
        <div className="grid gap-8 lg:grid-cols-3">
          {valueColumns.map((column) => (
            <div key={column.title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{column.title}</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">
                Todo lo que tu {business.name.toLowerCase()} necesita
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {column.items.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[var(--af-action)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="space-y-10">
          {featureBlocks.map((block, index) => (
            <div
              key={block.title}
              className={`grid gap-8 rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm lg:grid-cols-[1fr_1fr] lg:items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Funcionalidad</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-900">{block.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{block.description}</p>
                <ul className="mt-5 space-y-2 text-sm text-slate-600">
                  {block.bullets.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-200" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <img src={block.image} alt={block.title} className="h-64 w-full rounded-2xl object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-[32px] bg-slate-900 px-8 py-12 text-white">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-lg font-semibold">AgendaFlow para {business.name}</p>
            <p className="text-sm text-white/70">
              Plataforma integral para coordinar profesionales, horarios y servicios sin fricción.
            </p>
          </div>
          <div className="mt-8 grid gap-6 text-center sm:grid-cols-3">
            {[
              { value: '4.9/5', label: 'Satisfacción' },
              { value: '+20k', label: 'Negocios activos' },
              { value: '150M', label: 'Citas agendadas' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-2xl font-semibold">{item.value}</p>
                <p className="text-sm text-white/60">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-900">
            Listo para digitalizar tu {business.name.toLowerCase()}?
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            AgendaFlow centraliza reservas, pagos y comunicación para que tu equipo se concentre en tus clientes.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="rounded-full bg-[var(--af-action)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Crear cuenta
            </Link>
            <Link
              href={getBusinessLink(business.slug)}
              className="rounded-full border border-slate-200 px-6 py-3 text-sm text-slate-700 transition hover:border-slate-300"
            >
              Ver demo
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
