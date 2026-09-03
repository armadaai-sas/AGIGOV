import type { TFunction } from '../../i18n/index.js';
import type { MessageKey } from '../../i18n/index.js';
import { LANDING_OPEN_SOURCE } from './landingOutcomes.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';
import { ENTERPRISE_ROUTES } from '../platform/enterpriseRoutes.js';

export const GITHUB_RELEASES_URL = 'https://github.com/armadaai-sas/AGIGOV/releases';

export type LandingPersonaId = 'state' | 'citizen' | 'enterprise' | 'integrator';

/** Orden alineado al hero y al footer. */
export const LANDING_PERSONA_IDS: readonly LandingPersonaId[] = [
  'state',
  'citizen',
  'enterprise',
  'integrator',
] as const;

export const ENTERPRISE_MODELS_PATH = ENTERPRISE_ROUTES.catalog;

export function landingPersonaPath(id: LandingPersonaId): string {
  switch (id) {
    case 'state':
      return INSTITUTION_ROUTES.hub;
    case 'citizen':
      return '/gestion';
    case 'enterprise':
      return ENTERPRISE_ROUTES.hub;
    case 'integrator':
      return '/desarrolladores';
  }
}

export function landingPersonaLabelKey(id: LandingPersonaId): MessageKey {
  return `landing.min.persona.${id}` as MessageKey;
}

export function landingPersonaHintKey(id: LandingPersonaId): MessageKey {
  return `landing.min.persona.hint.${id}` as MessageKey;
}

export function landingPersonaCtaKey(id: LandingPersonaId): MessageKey {
  return `landing.min.persona.cta.${id}` as MessageKey;
}

export function landingRoleMapCapabilitiesKey(id: LandingPersonaId): MessageKey {
  return `landing.min.roleMap.${id}.capabilities` as MessageKey;
}

export function landingRoleMapPricingKey(id: LandingPersonaId): MessageKey {
  return `landing.min.roleMap.${id}.pricing` as MessageKey;
}

export function landingRotorWords(t: TFunction): readonly string[] {
  return ['2.0', t('landing.min.rotor.state'), t('landing.min.rotor.citizenship'), t('landing.min.rotor.evidence')];
}

export function landingUtilityGeneral(t: TFunction) {
  return {
    title: t('landing.min.utility.title'),
    lead: t('landing.min.utility.lead'),
    subsectionTitle: t('landing.min.utility.subtitle'),
    subsectionLead: t('landing.min.utility.sublead'),
  };
}

export function landingOpenSourceCopy(t: TFunction) {
  return {
    title: t('landing.min.oss.title'),
    lead: t('landing.min.oss.lead'),
    repoUrl: LANDING_OPEN_SOURCE.repoUrl,
    repoLabel: t('landing.min.oss.repoLabel'),
    repoMeta: t('landing.min.oss.repoMeta'),
    devPath: LANDING_OPEN_SOURCE.devPath,
    devLabel: t('landing.min.oss.devLabel'),
    devMeta: t('landing.min.oss.devMeta'),
  };
}

export function landingModelOutcomes(t: TFunction) {
  const ids = [
    'egs',
    'escrow-institucional',
    'gestion-verificable',
    'evidencia-certificada',
    'participacion',
    'set',
  ] as const;

  return ids.map((modelId) => ({
    modelId,
    today: t(`landing.min.outcome.${modelId}.today`),
    outcome: t(`landing.min.outcome.${modelId}.outcome`),
    citizen: t(`landing.min.outcome.${modelId}.citizen`),
    state: t(`landing.min.outcome.${modelId}.state`),
  }));
}
