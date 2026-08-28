/** Ruta interactiva — pantalla 2 del hero. */
export const HERO_ROUTE_KICKER = 'Nuestra ruta';
export const HERO_ROUTE_TITLE = 'Un motor. Modelos que encajan en su gestión.';
export const HERO_ROUTE_LEAD = 'Empiece por el piloto fiscal; el catálogo crece con actas.';

export const HERO_ROUTE_WHY_KICKER = 'Por qué';
export const HERO_ROUTE_WHY =
  'No sustituimos al servidor público — le damos una capa común de evidencia verificable para decidir y rendir cuentas.';

export const HERO_ROUTE_STEPS = [
  {
    id: 'os',
    label: 'Motor AGIGOV',
    hint: 'Flujo institucional',
    path: '/institucional',
    detail: 'Recibido → validado → decidido → comprometido → publicado. Centinela congela si algo no cuadra.',
    stat: '5 estados · ledger inmutable',
  },
  {
    id: 'catalog',
    label: 'Catálogo modular',
    hint: 'Un motor, muchas funciones',
    path: '/modelos',
    detail: 'EGS, SET, nodos territoriales — cada modelo con acta, badge honesto y consola propia.',
    stat: 'Modelos por audiencia B2G/B2B/B2C',
  },
  {
    id: 'pilot',
    label: 'Trust Pilot Fiscal',
    hint: 'Primer modelo disponible',
    path: '/modelos/egs',
    detail: 'Cierre verificable de un rubro en 90 días. Comisión AGIGOV solo si hay ahorro real verificado.',
    stat: 'Piloto 3× validado en el entorno de prueba',
  },
  {
    id: 'close',
    label: 'Cierre publicado',
    hint: 'Gestión + ciudadanía',
    path: '/modelos/egs/consola',
    detail: 'Acta firmada, hashes reproducibles y panel publicable sin exponer datos personales.',
    stat: 'Ed25519 · decisión humana',
  },
] as const;
