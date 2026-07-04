/** Nodos del pipeline IAP — sincronizados con actos del hero. */
export const GOVERNANCE_NODES = [
  { id: 'sensores', label: 'Sensores', sub: 'Evidencia' },
  { id: 'centinela', label: 'Centinela', sub: 'Validación' },
  { id: 'soberano', label: 'Soberano', sub: 'Dictamen' },
  { id: 'ledger', label: 'Ledger', sub: 'Inmutable' },
  { id: 'comunicador', label: 'Comunicador', sub: 'Ciudadanía' },
] as const;

/** Posiciones en círculo (viewBox 400×400, centro 200,200). */
export function nodePosition(index: number, total = GOVERNANCE_NODES.length) {
  const angle = (-Math.PI / 2) + (index * 2 * Math.PI) / total;
  const r = 118;
  return {
    x: 200 + r * Math.cos(angle),
    y: 200 + r * Math.sin(angle),
  };
}
