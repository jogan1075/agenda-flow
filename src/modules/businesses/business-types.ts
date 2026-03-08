export const BUSINESS_TYPE_CATALOG = {
  ESTETICA_Y_BELLEZA: [
    'Centros de estetica',
    'Spas',
    'Salones de belleza',
    'Barberias',
    'Peluquerias',
    'Manicure y pedicure',
    'Cejas y pestanas',
  ],
  SALUD: [
    'Centros medicos',
    'Clinicas',
    'Fisioterapia',
    'Kinesiologos',
    'Psicologos',
    'Consultas medicas',
    'Medicina alternativa',
    'Centro de Podologia',
  ],
  BIENESTAR: [
    'Nutricionistas',
    'Centros deportivos',
    'Centros de Crossfit',
    'Estudios de pilates',
    'Estudios de yoga',
  ],
} as const;

export type BusinessCategory = keyof typeof BUSINESS_TYPE_CATALOG;

export const BUSINESS_CATEGORIES = Object.keys(BUSINESS_TYPE_CATALOG) as BusinessCategory[];
