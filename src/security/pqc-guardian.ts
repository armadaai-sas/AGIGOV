/**
 * PQC guardian — inventario y readiness (P6).
 * Modos: off | inventory | hybrid-pilot (piloto futuro IAP v2).
 * No implementa ML-DSA/ML-KEM aún; documenta superficie y bloquea claims falsos.
 */
export type PqcMode = 'off' | 'inventory' | 'hybrid-pilot';

export type CryptoSurfaceRow = {
  layer: string;
  algorithm: string;
  pqcTarget: string;
  status: 'classic' | 'documented' | 'pilot-pending';
};

export type PqcReadiness = {
  mode: PqcMode;
  ok: boolean;
  hybridClaimAllowed: boolean;
  surface: CryptoSurfaceRow[];
  notes: string[];
  docRef: string;
};

const SURFACE: CryptoSurfaceRow[] = [
  {
    layer: 'IAP / ledger signatures',
    algorithm: 'Ed25519',
    pqcTarget: 'Ed25519 + ML-DSA-65 (híbrido)',
    status: 'classic',
  },
  {
    layer: 'Envelope KEM',
    algorithm: 'X25519 + XChaCha20-Poly1305',
    pqcTarget: 'X25519 + ML-KEM-768 (híbrido)',
    status: 'classic',
  },
  {
    layer: 'LoRaWAN payload',
    algorithm: 'Ed25519',
    pqcTarget: 'ML-DSA-65 (edge piloto)',
    status: 'documented',
  },
  {
    layer: 'Institution passwords',
    algorithm: 'scrypt',
    pqcTarget: 'n/a (no PQC claim)',
    status: 'classic',
  },
];

export function resolvePqcMode(env: NodeJS.ProcessEnv = process.env): PqcMode {
  const raw = (env.AGIGOV_PQC_MODE ?? 'inventory').trim().toLowerCase();
  if (raw === 'off' || raw === 'hybrid-pilot') return raw;
  return 'inventory';
}

export function assessPqcReadiness(env: NodeJS.ProcessEnv = process.env): PqcReadiness {
  const mode = resolvePqcMode(env);
  const notes: string[] = [];

  if (mode === 'hybrid-pilot') {
    notes.push(
      'hybrid-pilot declarado pero IAP v2 + @noble/post-quantum no están en runtime — no afirmar PQC productivo',
    );
  }
  if (mode === 'off') {
    notes.push('PQC desactivado — solo criptografía clásica documentada');
  } else {
    notes.push('Inventario P6 completo; migración dual-stack = piloto territorial (Fase B doc)');
  }

  return {
    mode,
    ok: mode !== 'hybrid-pilot', // hybrid-pilot sin impl = no-ok para claims
    hybridClaimAllowed: false,
    surface: SURFACE,
    notes,
    docRef: 'docs/PQC-GUARDIAN-CUANTICO.md',
  };
}
