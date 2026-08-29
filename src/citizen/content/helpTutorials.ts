export type HelpTopicSlug =
  | 'gestion'
  | 'propuestas'
  | 'proyectos'
  | 'suministros'
  | 'participar'
  | 'institucional'
  | 'modelo';

export type HelpTopic = {
  slug: HelpTopicSlug;
  title: string;
  tagline: string;
  category: 'explorar' | 'participar' | 'institucional' | 'modelo';
  whatIs: string;
  whoFor: string;
  youCan: readonly string[];
  steps: readonly { title: string; text: string }[];
  actionRoute: string;
  actionLabel: string;
};

export const HELP_TOPICS: readonly HelpTopic[] = [
  {
    slug: 'gestion',
    title: 'Gestión pública',
    tagline: 'Telemetría agregada del ledger — sin datos personales.',
    category: 'explorar',
    whatIs:
      'Panel de transparencia con reportes ya publicados. Cada entrada pasó validación centinela antes de ser visible.',
    whoFor: 'Ciudadanos, periodistas y equipos que quieren verificar qué se publicó, no opiniones sin evidencia.',
    youCan: [
      'Consultar entradas del registro inmutable',
      'Leer resúmenes de gestión recientes',
      'Ir a suministros o propuestas relacionadas',
    ],
    steps: [
      { title: 'Abre Gestión', text: 'Entra desde Explorar → Gestión pública o el botón Explorar plataforma.' },
      { title: 'Revisa métricas', text: 'Entradas ledger y reportes indican volumen de gestión publicada.' },
      { title: 'Lee publicaciones', text: 'Cada tarjeta muestra estado, ID de proceso y fecha — trazable en ledger.' },
    ],
    actionRoute: '/gestion',
    actionLabel: 'Abrir gestión',
  },
  {
    slug: 'propuestas',
    title: 'Propuestas',
    tagline: 'Ideas ciudadanas con dictamen soberano en lenguaje claro.',
    category: 'explorar',
    whatIs:
      'Listado de propuestas que entraron al pipeline AGIGOV: recibidas, validadas y con resumen ciudadano.',
    whoFor: 'Quienes quieren seguir el debate público verificable o contrastar un dictamen CONFORME / REVISAR.',
    youCan: [
      'Ver título y resumen accesible de cada propuesta',
      'Identificar dictamen y estado del proceso',
      'Enviar la tuya desde Participar',
    ],
    steps: [
      { title: 'Explora propuestas', text: 'Desde Explorar → Propuestas ves las publicadas en el piloto.' },
      { title: 'Entiende el dictamen', text: 'CONFORME avanza; REVISAR pide ajustes antes de efecto normativo.' },
      { title: 'Participa', text: 'Si tienes hechos verificables, envía una propuesta nueva.' },
    ],
    actionRoute: '/propuestas',
    actionLabel: 'Ver propuestas',
  },
  {
    slug: 'proyectos',
    title: 'Proyectos DAO',
    tagline: 'Prosperidad compartida con fondos en escrow programático.',
    category: 'explorar',
    whatIs:
      'Proyectos aprobados con metas, hitos y recaudación transparente. El escrow retiene fondos hasta cumplir condiciones.',
    whoFor: 'Comunidades y aportantes que buscan impacto trazable — el monto no compra privilegio político.',
    youCan: [
      'Ver avance de recaudación y hitos',
      'Registrar aportes en el piloto (VES demo)',
      'Comprobar estado del escrow',
    ],
    steps: [
      { title: 'Elige un proyecto', text: 'Revisa sector, territorio y porcentaje recaudado.' },
      { title: 'Consulta hitos', text: 'Cada hito indica progreso verificable del proyecto.' },
      { title: 'Aporta con trazabilidad', text: 'Tu aporte genera recibo en ledger — sin datos personales en campos públicos.' },
    ],
    actionRoute: '/proyectos',
    actionLabel: 'Ver proyectos',
  },
  {
    slug: 'suministros',
    title: 'Suministros',
    tagline: 'Agregados del agente Logístico — agua, energía, granos.',
    category: 'explorar',
    whatIs:
      'Inventario público agregado de recursos esenciales. Datos del agente Logístico, sin información personal.',
    whoFor: 'Ciudadanos y nodos territoriales que monitorean recursos críticos en el piloto.',
    youCan: [
      'Ver totales por categoría de suministro',
      'Contrastar con gestión publicada',
      'Detectar vacíos de datos (modo demo sin seed)',
    ],
    steps: [
      { title: 'Abre Suministros', text: 'Explorar → Suministros muestra agregados por estado.' },
      { title: 'Interpreta cifras', text: 'Montos y conteos son agregados — no identifican personas.' },
      { title: 'Cruza con gestión', text: 'Usa Gestión pública para contexto de reportes relacionados.' },
    ],
    actionRoute: '/suministros',
    actionLabel: 'Ver suministros',
  },
  {
    slug: 'participar',
    title: 'Participar',
    tagline: 'Tu voz con hechos verificables — pipeline institucional.',
    category: 'participar',
    whatIs:
      'Canal para enviar propuestas ciudadanas. Centinela valida evidencia; Soberano emite dictamen; lo publicado aparece en Propuestas.',
    whoFor: 'Ciudadanos activos, organizaciones y desarrolladores que aportan al modelo con trazabilidad.',
    youCan: [
      'Enviar propuesta con hechos y fuentes',
      'Recibir dictamen CONFORME o REVISAR al instante (demo)',
      'Explorar otros canales: campañas, nodos, código (próximamente)',
    ],
    steps: [
      { title: 'Redacta con evidencia', text: 'Título, sector y al menos dos hechos verificables con fuente opcional.' },
      { title: 'Envía la propuesta', text: 'El pipeline registra received → validated → dictamen.' },
      { title: 'Sigue el resultado', text: 'Consulta tu propuesta en Propuestas con su ID de proceso.' },
    ],
    actionRoute: '/participar',
    actionLabel: 'Ir a Participar',
  },
  {
    slug: 'institucional',
    title: 'Institucional y gobiernos',
    tagline: 'Adopción del modelo: entorno de prueba autoservicio o hablar con el equipo.',
    category: 'institucional',
    whatIs:
      'Hub para instituciones que adoptan AGIGOV: abrir entorno de prueba (registro) o escribir al equipo para piloto guiado. Implementaciones nacionales (ej. Venezuela) viven aquí, no en el logo global.',
    whoFor: 'Equipos gubernamentales, jurídico, operadores de nodo y aliados institucionales.',
    youCan: [
      'Abrir un entorno de prueba autoservicio (registro)',
      'Hablar con el equipo para piloto guiado',
      'Acceder a API y docs para desarrolladores',
    ],
    steps: [
      { title: 'Conoce el marco', text: 'Carta, pilares y roadmap de ejecución del piloto.' },
      {
        title: 'Elige el camino',
        text: 'Entorno de prueba = te registras solo. Hablar = correo humano. No son lo mismo.',
      },
      {
        title: 'Implementación',
        text: 'Elige jurisdicción en el selector del header sin confundir marca AGIGOV.',
      },
    ],
    actionRoute: '/institucional',
    actionLabel: 'Abrir institucional',
  },
  {
    slug: 'modelo',
    title: 'Gobernanza 2.0',
    tagline: 'Por qué el modelo tradicional ya no alcanza en la era post-IA.',
    category: 'modelo',
    whatIs:
      'Marco conceptual AGIGOV: Estado verificable, agentes institucionales, ledger inmutable y participación con evidencia.',
    whoFor: 'Quienes llegan por primera vez y necesitan contexto antes de explorar datos o participar.',
    youCan: [
      'Comparar modelo tradicional vs Gobernanza 2.0 en la home',
      'Recorrer el flujo received → published',
      'Profundizar con glosario y tutoriales por sección',
    ],
    steps: [
      { title: 'Lee la comparación', text: 'En la home, la sección multi-agente explica la diferencia.' },
      { title: 'Sigue el flujo', text: 'Recibido → validado → decidido → comprometido → publicado.' },
      {
        title: 'Elige tu camino',
        text: 'Explorar datos, participar, abrir entorno de prueba o hablar con el equipo.',
      },
    ],
    actionRoute: '/#que-es',
    actionLabel: 'Ver en la home',
  },
] as const;

export function getHelpTopic(slug: string): HelpTopic | undefined {
  return HELP_TOPICS.find((t) => t.slug === slug);
}

export const HELP_CATEGORIES = [
  { id: 'explorar' as const, label: 'Explorar la plataforma', description: 'Gestión, propuestas, proyectos y suministros' },
  { id: 'participar' as const, label: 'Participar', description: 'Propuestas ciudadanas y canales activos' },
  { id: 'institucional' as const, label: 'Institucional', description: 'Gobiernos, Carta y protocolo' },
  { id: 'modelo' as const, label: 'Entender el modelo', description: 'Gobernanza 2.0 y conceptos base' },
] as const;
