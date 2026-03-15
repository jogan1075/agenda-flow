export type BusinessItem = {
  name: string;
  slug: string;
  heroImage: string;
};

export type BusinessCategory = {
  title: string;
  items: BusinessItem[];
};

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    title: 'Estética y Belleza',
    items: [
      {
        name: 'Centros de estética',
        slug: 'centros-de-estetica',
        heroImage: 'https://images.pexels.com/photos/34930097/pexels-photo-34930097.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Spas',
        slug: 'spas',
        heroImage: 'https://images.pexels.com/photos/5793681/pexels-photo-5793681.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Salones de belleza',
        slug: 'salones-de-belleza',
        heroImage: 'https://images.pexels.com/photos/8834099/pexels-photo-8834099.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Barberías',
        slug: 'barberias',
        heroImage: 'https://images.pexels.com/photos/3105409/pexels-photo-3105409.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Peluquerías',
        slug: 'peluquerias',
        heroImage: 'https://images.pexels.com/photos/8834077/pexels-photo-8834077.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Manicure y pedicure',
        slug: 'manicure-y-pedicure',
        heroImage: 'https://images.pexels.com/photos/7446912/pexels-photo-7446912.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Cejas y pestañas',
        slug: 'cejas-y-pestanas',
        heroImage: 'https://images.pexels.com/photos/34930118/pexels-photo-34930118.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Salones de maquillaje',
        slug: 'salones-de-maquillaje',
        heroImage: 'https://images.pexels.com/photos/33580449/pexels-photo-33580449.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
    ],
  },
  {
    title: 'Salud',
    items: [
      {
        name: 'Centros médicos',
        slug: 'centros-medicos',
        heroImage: 'https://images.pexels.com/photos/5452254/pexels-photo-5452254.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Clínicas',
        slug: 'clinicas',
        heroImage: 'https://images.pexels.com/photos/5452254/pexels-photo-5452254.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Fisioterapia',
        slug: 'fisioterapia',
        heroImage: 'https://images.pexels.com/photos/30483023/pexels-photo-30483023.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Kinesiólogos',
        slug: 'kinesiologos',
        heroImage: 'https://images.pexels.com/photos/20860594/pexels-photo-20860594.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Psicólogos',
        slug: 'psicologos',
        heroImage: 'https://images.pexels.com/photos/7579312/pexels-photo-7579312.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Consultas médicas',
        slug: 'consultas-medicas',
        heroImage: 'https://images.pexels.com/photos/5452254/pexels-photo-5452254.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Medicina alternativa',
        slug: 'medicina-alternativa',
        heroImage: 'https://images.pexels.com/photos/8312875/pexels-photo-8312875.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Centro de Podología',
        slug: 'centro-de-podologia',
        heroImage: 'https://images.pexels.com/photos/17056221/pexels-photo-17056221.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
    ],
  },
  {
    title: 'Salud y educación',
    items: [
      {
        name: 'Neurodesarrollo',
        slug: 'neurodesarrollo',
        heroImage: 'https://images.pexels.com/photos/8653974/pexels-photo-8653974.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Inclusión social',
        slug: 'inclusion-social',
        heroImage: 'https://images.pexels.com/photos/20437178/pexels-photo-20437178.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Fonoaudiología',
        slug: 'fonoaudiologia',
        heroImage: 'https://images.pexels.com/photos/7447264/pexels-photo-7447264.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Terapia Ocupacional',
        slug: 'terapia-ocupacional',
        heroImage: 'https://images.pexels.com/photos/4506071/pexels-photo-4506071.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Psicopedagogía',
        slug: 'psicopedagogia',
        heroImage: 'https://images.pexels.com/photos/6502733/pexels-photo-6502733.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Refuerzo Escolar',
        slug: 'refuerzo-escolar',
        heroImage: 'https://images.pexels.com/photos/8617728/pexels-photo-8617728.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
    ],
  },
  {
    title: 'Bienestar',
    items: [
      {
        name: 'Nutricionistas',
        slug: 'nutricionistas',
        heroImage: 'https://images.pexels.com/photos/8844392/pexels-photo-8844392.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Centros deportivos',
        slug: 'centros-deportivos',
        heroImage: 'https://images.pexels.com/photos/3757376/pexels-photo-3757376.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Centros de Crossfit',
        slug: 'centros-de-crossfit',
        heroImage: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Estudios de pilates',
        slug: 'estudios-de-pilates',
        heroImage: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
      {
        name: 'Estudios de yoga',
        slug: 'estudios-de-yoga',
        heroImage: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
    ],
  },
];

export const FEATURE_SECTIONS = [
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

export const BUSINESS_ITEMS = BUSINESS_CATEGORIES.flatMap((category) => category.items);

export const getBusinessBySlug = (slug: string) => BUSINESS_ITEMS.find((item) => item.slug === slug);

export const getBusinessLink = (slug: string) => `/negocios/${slug}/software-para-${slug}`;
