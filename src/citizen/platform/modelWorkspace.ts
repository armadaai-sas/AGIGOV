import { getModelDeployExplanation } from './modelDeployActions.js';

export { getModelDeployExplanation };

/** Ruta del espacio de trabajo tras «Desplegar». */
export function modelWorkspacePath(modelId: string): string {
  return `/modelos/${modelId}/espacio`;
}

/** Consola operativa — reportes y datos en vivo del modelo. */
export function modelConsolePath(modelId: string): string {
  return `/modelos/${modelId}/consola`;
}
