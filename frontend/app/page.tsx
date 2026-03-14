import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MarketingLayout } from '@/components/marketing-layout';

const highlightTags = [
  'Marketplace',
  'Agenda',
  'Sitio de reservas',
  'WhatsApp',
  'Inteligencia Artificial',
  'Clientes',
  'Ventas',
  'Pagos',
  'Marketing',
  'Reportes avanzados',
  'Google Reserve',
];

const highlightCarousel = [...highlightTags, ...highlightTags];

const businessCards = [
  {
    label: 'Nutrición',
    image:
      'https://images.pexels.com/photos/8844553/pexels-photo-8844553.jpeg?cs=srgb&dl=pexels-yaroslav-shuraev-8844553.jpg&fm=jpg',
  },
  {
    label: 'Medicina alternativa',
    image:
      'https://images.pexels.com/photos/8312875/pexels-photo-8312875.jpeg?cs=srgb&dl=pexels-rdne-8312875.jpg&fm=jpg',
  },
  {
    label: 'Podología',
    image:
      'https://images.pexels.com/photos/17056221/pexels-photo-17056221.jpeg?cs=srgb&dl=pexels-andreamostiphotography-17056221.jpg&fm=jpg',
  },
  {
    label: 'Clínicas',
    image:
      'https://images.pexels.com/photos/19675470/pexels-photo-19675470.jpeg?cs=srgb&dl=pexels-krini-kon-867186580-19675470.jpg&fm=jpg',
  },
  {
    label: 'Centros de estética',
    image:
      'https://images.pexels.com/photos/7697320/pexels-photo-7697320.jpeg?cs=srgb&dl=pexels-rdne-7697320.jpg&fm=jpg',
  },
];

const businessCarousel = [...businessCards, ...businessCards];

const avatarChips = [
  'Salones de belleza',
  'Spa',
  'Barberías',
  'Peluquerías',
  'Cejas y pestañas',
  'Fisioterapia',
  'Psicología',
  'Nutrición',
  'Podología',
  'Clínicas',
];

const supportItems = [
  'Academia online',
  'Equipo de soporte 24/7',
  'Centro de ayuda online',
  'Equipo de onboarding',
];

const faqItems = [
  '¿Qué es un sistema de agendamiento?',
  '¿Cómo hacer un control de citas?',
  '¿Qué es el agendamiento de citas en línea?',
  '¿Cuáles son las ventajas de una app para agendar horas?',
  '¿Cuánto cuesta un software de gestión de citas?',
  '¿Son recomendables las aplicaciones para agendar citas online?',
  '¿Cuál es el mejor software de reservas?',
  '¿Hay un sistema de agendamiento online gratis?',
];

const toolColumns = [
  {
    title: 'Gestión de citas',
    items: [
      'Reserva de citas online',
      'Recordatorios por WhatsApp y email',
      'Agenda online',
      'Sitio web de reservas 24/7',
    ],
  },
  {
    title: 'Gestión de clientes CRM',
    items: [
      'Base de datos',
      'Ficha del cliente',
      'Campañas de mailing',
      'Giftcards',
      'Control de sesiones',
    ],
  },
  {
    title: 'Marketing y fidelización',
    items: [
      'Integración con Google Reserve',
      'Campañas de email',
      'Promociones personalizadas',
      'Marketplace',
      'Programas de lealtad',
    ],
  },
];

export default function HomePage() {
  const appMode = process.env.NEXT_PUBLIC_APP_MODE;
  if (appMode === 'reservas') redirect('/reservas');
  if (appMode === 'manager') redirect('/login');

  return (
    <MarketingLayout>
      <style jsx global>{`
        .af-marquee-track {
          display: flex;
          gap: 12px;
          align-items: center;
          width: max-content;
          animation: af-marquee 26s linear infinite;
        }
        .af-marquee-tags {
          justify-content: flex-start;
        }
        .af-marquee-cards {
          gap: 16px;
        }
        @keyframes af-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (max-width: 768px) {
          .af-marquee-track {
            animation-duration: 34s;
          }
          .af-marquee-cards > div {
            min-width: 200px;
          }
        }
      `}</style>
      <section className="relative mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">
              AgendaFlow
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
              Agenda, pagos y comunicación en un solo lugar para tu negocio.
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-600 md:text-lg">
              Centraliza reservas, recordatorios y comisiones. Reduce ausencias y mejora la experiencia del cliente con
              automatizaciones inteligentes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
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
                Ver reserva online
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
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

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <img
              src="https://images.pexels.com/photos/12935077/pexels-photo-12935077.jpeg?cs=srgb&dl=pexels-imin-technology-276315592-12935077.jpg&fm=jpg"
              alt="Pago con terminal POS"
              className="h-full w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[32px] bg-slate-900 px-8 py-14 text-white shadow-2xl">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-lg font-semibold">AgendaFlow hace crecer tu negocio</p>
            <div className="relative overflow-hidden">
              <div className="af-marquee-track af-marquee-tags">
                {highlightCarousel.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: '+ 20.000', label: 'Empresas' },
              { value: '+ 135.000', label: 'Profesionales' },
              { value: '150 M', label: 'Citas agendadas' },
              { value: '+20', label: 'Países' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-2xl font-semibold">{item.value}</p>
                <p className="text-sm text-white/60">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 overflow-hidden">
            <div className="af-marquee-track af-marquee-cards">
              {businessCarousel.map((card, index) => (
                <div key={`${card.label}-${index}`} className="relative min-w-[240px] overflow-hidden rounded-2xl">
                  <img src={card.image} alt={card.label} className="h-40 w-full object-cover" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-sm font-semibold text-white">
                    <span>{card.label}</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900">AgendaFlow se adapta a tu negocio</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {avatarChips.map((label, index) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div
                  className="h-12 w-12 rounded-full border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200"
                  style={{ opacity: 0.6 + (index % 5) * 0.08 }}
                />
                <span className="text-xs text-slate-500">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 text-sm text-slate-400">
            <span className="font-semibold text-slate-500">Impulsado por</span>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-8 text-xs uppercase tracking-[0.3em] text-slate-400">
              <span>Y Combinator</span>
              <span>KAYYAI Ventures</span>
              <span>Riverwood Capital</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[32px] bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 p-10 text-white">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="rounded-2xl bg-white/10 p-6">
              <img
                src="https://images.pexels.com/photos/3183161/pexels-photo-3183161.jpeg?cs=srgb&dl=pexels-fauxels-3183161.jpg&fm=jpg"
                alt="Soporte AgendaFlow"
                className="h-56 w-full rounded-2xl object-cover"
              />
              <div className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/70">
                ¿Cómo podemos ayudarte? Escribe un mensaje…
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Soporte 24/7 y acompañamiento gratis por siempre</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {supportItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {item}
                  </div>
                ))}
              </div>
              <Link href="/faq" className="mt-6 inline-flex text-sm font-semibold text-white/80">
                Con AgendaFlow vas de la mano →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-sm text-slate-500">
              Cada cita es crecimiento. Organiza tu negocio y alcanza tu versión pro.
            </p>
            <h3 className="mt-4 text-2xl font-semibold text-slate-900">Hazlo simple, hazlo Pro.</h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {[
                { value: '82%', label: 'Crecen nuestros clientes en 24 meses.' },
                { value: '90%', label: 'Menos inasistencias.' },
                { value: '30 hrs', label: 'De ahorro en gestión.' },
                { value: '320%', label: 'De aumento en retorno de inversión.' },
                { value: '40%', label: 'Más clientes recurrentes.' },
                { value: '70%', label: 'Más reservas fuera de horario.' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
            <Link
              href="/login"
              className="mt-8 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
            >
              Crea tu cuenta gratis
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                label: 'Cobro con POS',
                image:
                  'https://images.pexels.com/photos/9304565/pexels-photo-9304565.jpeg?cs=srgb&dl=pexels-mikhail-nilov-9304565.jpg&fm=jpg',
              },
              {
                label: 'Agenda inteligente',
                image:
                  'https://images.pexels.com/photos/19675470/pexels-photo-19675470.jpeg?cs=srgb&dl=pexels-krini-kon-867186580-19675470.jpg&fm=jpg',
              },
              {
                label: 'App móvil',
                image:
                  'https://images.pexels.com/photos/3183161/pexels-photo-3183161.jpeg?cs=srgb&dl=pexels-fauxels-3183161.jpg&fm=jpg',
              },
              {
                label: 'Gestión de clientes',
                image:
                  'https://images.pexels.com/photos/8844553/pexels-photo-8844553.jpeg?cs=srgb&dl=pexels-yaroslav-shuraev-8844553.jpg&fm=jpg',
              },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <img src={item.image} alt={item.label} className="h-24 w-full rounded-xl object-cover" />
                <p className="mt-3 text-sm font-semibold text-slate-900">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {toolColumns.map((column) => (
            <div key={column.title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">{column.title}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-500">
                {column.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <div className="mt-6 h-32 rounded-2xl bg-gradient-to-br from-violet-100 via-indigo-100 to-slate-100" />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Preguntas frecuentes</h2>
          <p className="mt-2 text-sm text-slate-500">Si no encuentras la respuesta, contáctanos.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {faqItems.map((item) => (
            <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-4 text-sm text-slate-700">
              <span>{item}</span>
              <span className="text-lg text-slate-400">+</span>
            </div>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}
