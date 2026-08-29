import type { TFunction } from '../../i18n/index.js';
import { LANDING_OPEN_SOURCE } from './landingOutcomes.js';

export const GITHUB_RELEASES_URL = 'https://github.com/armadaai-sas/Armada-VZLA/releases';

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
