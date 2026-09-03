/** Rutas y puntos de entrada del flujo institucional. */
export const INSTITUTION_ROUTES = {
  hub: '/institucional',
  register: '/institucional/registro',
  login: '/institucional/acceso',
  pilot: '/institucional/piloto',
  /** Escritorio OS — home tras login (tipo consola de escritorio). */
  desk: '/escritorio',
  modelBrief: '/modelos/egs',
  console: '/modelos/egs/consola',
  /** Anclas del hub: sandbox self-serve vs canal humano. */
  sandbox: '/institucional#sandbox',
  talk: '/institucional#hablar',
} as const;

/** Hero / marketing — probar el modelo empieza en registro institucional. */
export const TRY_MODEL_ENTRY = INSTITUTION_ROUTES.register;

/** Canal humano (ventas / piloto guiado). No es un alias de registro. */
export const TEAM_CONTACT_MAILTO = 'mailto:contacto@agigov.org';

