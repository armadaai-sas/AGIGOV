import { fetchMinistryHealth, fetchTenantOnboarding } from '../api.js';
import type { PilotSession } from './institutionPilotSession.js';

/** Paso sugerido según sesión local + onboarding (0–6). */
export function computeSuggestedStep(
  session: PilotSession,
  onboardingStatus: string | null | undefined,
): number {
  if (!session.slug) return 0;
  if (!session.modelId) return 1;
  if (onboardingStatus !== 'ingest_ready') return 2;
  if (session.ingestAccepted < 3) return 3;
  if (session.reconcileOk !== true) return 4;
  if (!session.published) return 5;
  return 6;
}

/** Sincroniza sesión local con estado real del tenant en API (reanudar wizard). */
export async function hydratePilotSessionFromServer(
  session: PilotSession,
): Promise<Partial<PilotSession>> {
  if (!session.slug) return {};

  const patch: Partial<PilotSession> = {};

  try {
    const onboarding = await fetchTenantOnboarding(session.slug);
    if (!session.ministryCode) patch.ministryCode = onboarding.ministryCode;

    const ministry = session.ministryCode ?? onboarding.ministryCode;
    const health = await fetchMinistryHealth(ministry);

    if (health.available) {
      patch.reconcileOk = health.reconcileOk;
      patch.reconcileStatus = health.quarterCloseStatus;
      patch.calculoAhorroFinal = Number(health.calculoAhorroFinal);
      patch.discrepancies = health.discrepancies ?? [];
      patch.published = health.published;
      if (health.releaseCount > 0 && session.ingestAccepted <= 0) {
        patch.ingestAccepted = health.releaseCount;
      }
    }

    if (onboarding.onboardingStatus === 'ingest_ready' && !session.modelId) {
      patch.modelId = 'egs';
    }

    const merged = { ...session, ...patch };
    const suggested = computeSuggestedStep(merged, onboarding.onboardingStatus);
    patch.maxStepReached = Math.max(session.maxStepReached, suggested);
  } catch {
    /* API offline — conservar sesión local */
  }

  return patch;
}
