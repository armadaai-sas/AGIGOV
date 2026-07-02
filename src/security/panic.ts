/** Estado global de pánico — FREEZE de mutaciones al ledger. */

export class PanicActiveError extends Error {
  constructor(message = 'Ledger en modo FREEZE (PANIC_MODE activo)') {
    super(message);
    this.name = 'PanicActiveError';
  }
}

export function isPanicMode(): boolean {
  return process.env.PANIC_MODE === 'true';
}

export function isFreezeApproved(): boolean {
  return process.env.FREEZE_APPROVED === 'true';
}

/** Rechaza escrituras al ledger salvo operaciones de recuperación explícitas. */
export function assertLedgerWritable(options?: {
  allowFreeze?: boolean;
}): void {
  if (!isPanicMode()) return;
  if (options?.allowFreeze) return;
  throw new PanicActiveError();
}

export interface PanicSnapshot {
  panicMode: boolean;
  freezeApproved: boolean;
  capturedAt: string;
}

export function capturePanicSnapshot(): PanicSnapshot {
  return {
    panicMode: isPanicMode(),
    freezeApproved: isFreezeApproved(),
    capturedAt: new Date().toISOString(),
  };
}
