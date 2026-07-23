export type PilotSession = {
  slug: string | null;
  ingestToken: string | null;
  firstEscrowRef: string | null;
  ministryCode: string | null;
  modelId: string | null;
  ingestAccepted: number;
  reconcileOk: boolean | null;
  reconcileStatus: string | null;
  calculoAhorroFinal: number | null;
  discrepancies: string[];
  published: boolean;
  maxStepReached: number;
};

const STORAGE_KEY = 'agigov-pilot-session-v1';

export const EMPTY_PILOT_SESSION: PilotSession = {
  slug: null,
  ingestToken: null,
  firstEscrowRef: null,
  ministryCode: null,
  modelId: null,
  ingestAccepted: 0,
  reconcileOk: null,
  reconcileStatus: null,
  calculoAhorroFinal: null,
  discrepancies: [],
  published: false,
  maxStepReached: 0,
};

export function loadPilotSession(): PilotSession {
  if (typeof window === 'undefined') return { ...EMPTY_PILOT_SESSION };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_PILOT_SESSION };
    return { ...EMPTY_PILOT_SESSION, ...JSON.parse(raw) } as PilotSession;
  } catch {
    return { ...EMPTY_PILOT_SESSION };
  }
}

export function savePilotSession(session: PilotSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function patchPilotSession(patch: Partial<PilotSession>): PilotSession {
  const next = { ...loadPilotSession(), ...patch };
  savePilotSession(next);
  return next;
}
