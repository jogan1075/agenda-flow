import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MarketingLayout } from '@/components/marketing-layout';
import { BUSINESS_ITEMS, getBusinessBySlug, getBusinessLink } from '@/lib/marketing-data';

type PageProps = {
  params: { slug: string; page: string };
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

export function generateStaticParams() {
  return BUSINESS_ITEMS.map((item) => ({
    slug: item.slug,
    page: `software-para-${item.slug}`,
  }));
}

export function generateMetadata({ params }: PageProps) {
  const business = getBusinessBySlug(params.slug);
  if (!business) return {};
  return {
    title: `Software para ${business.name} | AgendaFlow`,
    description: `Optimiza la agenda, pagos y comunicación en ${business.name.toLowerCase()} con AgendaFlow.`,
  };
}

export default function BusinessSoftwarePage({ params }: PageProps) {
  const business = getBusinessBySlug(params.slug);
  const expected = `software-para-${params.slug}`;

  if (!business || params.page !== expected) {
    notFound();
  }

  return (
    <MarketingLayout>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-4">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">AgendaFlow</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900 md:text-5xl">
              Software para {business.name.toLowerCase()}
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-600 md:text-base">
              Gestiona citas, pagos y recordatorios en un solo lugar. Mejora la experiencia de tus clientes y aumenta
              tu ocupación con automatizaciones inteligentes.
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
                className="rounded-full border border-slate-200 px-6 py-3 text-sm text-slate-700 transition hover:border-slate-300"
              >
                Ver demo de reservas
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { value: '+35%', label: 'Más ocupación' },
                { value: '3x', label: 'Menos no-show' },
                { value: '24/7', label: 'Reservas online' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <img src={business.heroImage} alt={business.name} className="h-full w-full rounded-2xl object-cover" />
          </div>
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

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {featureBlocks.map((block) => (
            <div key={block.title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <img src={block.image} alt={block.title} className="h-40 w-full rounded-2xl object-cover" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{block.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{block.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-500">
                {block.bullets.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-200" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-900">Listo para digitalizar tu {business.name.toLowerCase()}?</h2>
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
