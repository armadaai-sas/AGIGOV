import { fetchHealth, fetchMinistryHealth } from '../api.js';
import { EGS_CONSOLE_PATH, EGS_MODEL_PATH } from '../platform/agigovModels.js';

/** @deprecated Usar EGS_MODEL_PATH */
export const EGS_VIAL_PRODUCT_PATH = EGS_MODEL_PATH;
/** @deprecated Usar EGS_CONSOLE_PATH */
export const EGS_VIAL_CONSOLE_PATH = EGS_CONSOLE_PATH;

export { EGS_MODEL_PATH, EGS_CONSOLE_PATH };

export type EgsServiceStatus = {
  apiOk: boolean;
  postgresOk: boolean;
  egsDataOk: boolean;
  ready: boolean;
  checkedAt: string;
};

/** Verifica API pública + datos EGS en nodo conectado. */
export async function checkEgsVialService(): Promise<EgsServiceStatus> {
  const checkedAt = new Date().toISOString();
  let apiOk = false;
  let postgresOk = false;
  let egsDataOk = false;

  try {
    const health = await fetchHealth();
    apiOk = health.ok;
    postgresOk = Boolean(health.postgres);
  } catch {
    apiOk = false;
  }

  try {
    await fetchMinistryHealth('MPPI');
    egsDataOk = true;
  } catch {
    egsDataOk = false;
  }

  return {
    apiOk,
    postgresOk,
    egsDataOk,
    ready: apiOk && egsDataOk,
    checkedAt,
  };
}
