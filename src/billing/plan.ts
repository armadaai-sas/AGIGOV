/**
 * Plan comercial P0 — Free sin costo AGIGOV · SaaS · Sovereign.
 * Free = BYO infra; no Resend/IA en cuenta de la compañía.
 */
export type AgigovPlan = 'free' | 'saas' | 'sovereign';

export type HostingMode = 'byo' | 'agigov';

const FREE_MAX_DAYS = 90;
const FREE_MAX_TENANTS = 1;
const FREE_MAX_API_CALLS_PER_DAY = 500;
const FREE_MAX_Q_CLOSES = 2;

export function resolvePlan(env: NodeJS.ProcessEnv = process.env): AgigovPlan {
  const raw = (env.AGIGOV_PLAN ?? 'free').trim().toLowerCase();
  if (raw === 'saas' || raw === 'sovereign') return raw;
  return 'free';
}

export function resolveHosting(env: NodeJS.ProcessEnv = process.env): HostingMode {
  const raw = (env.AGIGOV_HOSTING ?? 'byo').trim().toLowerCase();
  return raw === 'agigov' ? 'agigov' : 'byo';
}

export type FreeGuardResult = {
  ok: boolean;
  plan: AgigovPlan;
  hosting: HostingMode;
  violations: string[];
  /** Misconfig que el runtime corrige (p. ej. Resend → outbox en Free). */
  warnings: string[];
  /** Modo de email efectivo tras coerción Free. */
  effectiveEmailMode: 'outbox' | 'resend' | string;
  caps: {
    maxDays: number;
    maxTenants: number;
    maxApiCallsPerDay: number;
    maxQCloses: number;
    email: 'outbox_or_byo' | 'resend_allowed';
    aiAddons: boolean;
  };
};

/** Mismo criterio que `src/server/email/dispatch.ts` — Free sin BYO nunca usa Resend compañía. */
export function resolveEffectiveEmailMode(env: NodeJS.ProcessEnv = process.env): string {
  const mode = (env.AGIGOV_EMAIL_MODE ?? 'outbox').trim().toLowerCase();
  const plan = resolvePlan(env);
  const emailByo = (env.AGIGOV_EMAIL_BYO ?? '0').trim() === '1';
  if (plan === 'free' && mode === 'resend' && !emailByo) return 'outbox';
  return mode || 'outbox';
}

/**
 * Free en hosting AGIGOV de pago = violación (costo para la compañía).
 * Free + Resend sin BYO = warning (runtime coacciona a outbox; no falla el gate).
 */
export function assertFreeCostZero(env: NodeJS.ProcessEnv = process.env): FreeGuardResult {
  const plan = resolvePlan(env);
  const hosting = resolveHosting(env);
  const violations: string[] = [];
  const warnings: string[] = [];

  const emailMode = (env.AGIGOV_EMAIL_MODE ?? 'outbox').trim().toLowerCase();
  const emailByo = (env.AGIGOV_EMAIL_BYO ?? '0').trim() === '1';
  const hasResendKey = Boolean(env.AGIGOV_RESEND_API_KEY?.trim());
  const effectiveEmailMode = resolveEffectiveEmailMode(env);

  if (plan === 'free' && hosting === 'agigov') {
    violations.push(
      'AGIGOV_PLAN=free no puede usar AGIGOV_HOSTING=agigov (Free es BYO; infra de pago = costo compañía)',
    );
  }

  if (plan === 'free' && emailMode === 'resend' && hasResendKey && !emailByo) {
    warnings.push(
      'Free + Resend sin AGIGOV_EMAIL_BYO=1 → runtime usa outbox (sin costo compañía). Fijar MODE=outbox o BYO=1.',
    );
  }

  if (plan === 'free' && (env.AGIGOV_AI_ENABLED ?? '0').trim() === '1') {
    violations.push('Free: AGIGOV_AI_ENABLED debe ser 0 (IA es add-on de pago)');
  }

  return {
    ok: violations.length === 0,
    plan,
    hosting,
    violations,
    warnings,
    effectiveEmailMode,
    caps: {
      maxDays: FREE_MAX_DAYS,
      maxTenants: FREE_MAX_TENANTS,
      maxApiCallsPerDay: FREE_MAX_API_CALLS_PER_DAY,
      maxQCloses: FREE_MAX_Q_CLOSES,
      email: plan === 'free' && !emailByo ? 'outbox_or_byo' : 'resend_allowed',
      aiAddons: plan !== 'free',
    },
  };
}

export function freePlanCaps() {
  return {
    maxDays: FREE_MAX_DAYS,
    maxTenants: FREE_MAX_TENANTS,
    maxApiCallsPerDay: FREE_MAX_API_CALLS_PER_DAY,
    maxQCloses: FREE_MAX_Q_CLOSES,
  };
}
