/** Rutas y puntos de entrada del flujo institucional. */
export const INSTITUTION_ROUTES = {
  hub: '/institucional',
  register: '/institucional/registro',
  login: '/institucional/acceso',
  pilot: '/institucional/piloto',
  modelBrief: '/modelos/egs',
  console: '/modelos/egs/consola',
} as const;

/** Hero / marketing — probar el modelo empieza en registro institucional. */
export const TRY_MODEL_ENTRY = INSTITUTION_ROUTES.register;
