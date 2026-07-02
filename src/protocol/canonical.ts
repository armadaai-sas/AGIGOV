/**
 * Serialización JSON canónica (claves ordenadas, UTF-8).
 * Usada para material firmado del envelope IAP.
 */

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return Object.keys(record)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortValue(record[key]);
        return acc;
      }, {});
  }
  return value;
}

export function canonicalize(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

/** Campos externos incluidos en la firma Ed25519 (excluye `signature`). */
export function signableEnvelopeFields(
  envelope: Omit<import('./types.js').SignedAgentEnvelope, 'signature'>,
): string {
  return canonicalize(envelope);
}
