export const DEFAULT_BUSINESS_TYPE_CATALOG: Array<{ key: string; label: string; subcategories: string[] }> = [
  {
    key: 'ESTETICA_Y_BELLEZA',
    label: 'Estetica y Belleza',
    subcategories: [
      'Centros de estetica',
      'Spas',
      'Salones de belleza',
      'Barberias',
      'Peluquerias',
      'Manicure y pedicure',
      'Cejas y pestanas',
    ],
  },
  {
    key: 'SALUD',
    label: 'Salud',
    subcategories: [
      'Centros medicos',
      'Clinicas',
      'Fisioterapia',
      'Kinesiologos',
      'Psicologos',
      'Consultas medicas',
      'Medicina alternativa',
      'Centro de Podologia',
    ],
  },
  {
    key: 'BIENESTAR',
    label: 'Bienestar',
    subcategories: ['Nutricionistas', 'Centros deportivos', 'Centros de Crossfit', 'Estudios de pilates', 'Estudios de yoga'],
  },
  {
    key: 'SALUD_Y_EDUCACION',
    label: 'Salud y educacion',
    subcategories: [
      'Neurodesarrollo',
      'Inclusion social',
      'Fonoaudiologia',
      'Terapia Ocupacional',
      'Psicopedagogia',
      'Refuerzo Escolar',
    ],
  },
];
