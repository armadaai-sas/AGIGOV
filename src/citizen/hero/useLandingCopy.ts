import { useMemo } from 'react';

import type { MessageKey } from '../../i18n/index.js';
import { usePlatform } from '../context/PlatformContext.js';
import { TRY_MODEL_ENTRY, INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';

const ROUTE_STEP_IDS = ['os', 'catalog', 'pilot', 'close'] as const;
const COMPARE_DIM_IDS = ['efficiency', 'results', 'security', 'citizens'] as const;
const PIPELINE_STEP_IDS = ['received', 'validated', 'decided', 'committed', 'published'] as const;

const PROGRAM_KEYS: Record<string, MessageKey> = {
  ven: 'demo.program.ven',
  col: 'demo.program.col',
  usa: 'demo.program.usa',
  sbx: 'demo.program.gen',
  gen: 'demo.program.gen',
};

export function useLandingCopy() {
  const { t, sovereign } = usePlatform();

  return useMemo(() => {
    const programKey = PROGRAM_KEYS[sovereign.iso.toLowerCase()] ?? 'demo.program.gen';

    return {
      HERO_SCREEN_LABELS: [
        t('hero.screen.demo'),
        t('hero.screen.route'),
        t('hero.screen.pilot'),
      ] as const,
      HERO_CINEMATIC_TITLE: t('hero.cinematic.title'),
      HERO_CINEMATIC_TAGLINE: t('hero.cinematic.tagline'),
      HERO_CINEMATIC_SUBLINE: t('hero.cinematic.subline'),
      HERO_CINEMATIC_LIVE_CAPTION: t('hero.cinematic.liveCaption', {
        jurisdiction: sovereign.jurisdictionCode,
      }),
      HERO_CTA_MICRO: t('hero.cinematic.micro'),
      HERO_TRUST_LINE: t('hero.cinematic.trust'),
      HERO_CTA_PRIMARY: { label: t('hero.cta.primary'), path: TRY_MODEL_ENTRY },
      HERO_CTA_SECONDARY: { label: t('hero.cta.secondary'), path: '/#gobernanza-2' },
      HERO_FLOW_EYEBROW: t('hero.flow.eyebrow'),
      HERO_FLOW_RESULT_LABEL: t('hero.flow.resultLabel'),
      HERO_FLOW_WINDOW_PATH: t('hero.flow.windowPath'),
      HERO_FLOW_STAGES: [
        { id: 'in', label: t('hero.flow.stage.in') },
        { id: 'process', label: t('hero.flow.stage.process') },
        { id: 'gate', label: t('hero.flow.stage.gate') },
        { id: 'out', label: t('hero.flow.stage.out') },
      ] as const,
      HERO_FLOW_SCENARIOS: (['treasury', 'audit', 'escrow', 'citizen'] as const).map((id) => ({
        id,
        who: t(`hero.flow.${id}.who` as MessageKey),
        can: t(`hero.flow.${id}.can` as MessageKey),
        canvasTitle: t(`hero.flow.${id}.canvas` as MessageKey),
        result: t(`hero.flow.${id}.result` as MessageKey),
        nodes: ([1, 2, 3, 4] as const).map((n) => ({
          phase: t(`hero.flow.${id}.n${n}.phase` as MessageKey),
          title: t(`hero.flow.${id}.n${n}.title` as MessageKey),
          detail: t(`hero.flow.${id}.n${n}.detail` as MessageKey),
        })),
      })),
      HERO_CTA_STAGE_TITLE: t('hero.cta.stage.title'),
      HERO_CTA_STAGE_LEAD: t('hero.cta.stage.lead'),
      HERO_CTA_STAGE_KICKER: t('hero.cta.stage.kicker'),
      HERO_ROUTE_WHY_KICKER: t('route.why.kicker'),
      HERO_ROUTE_WHY: t('route.why'),
      HERO_ROUTE_TITLE: t('route.title'),
      HERO_ROUTE_LEAD: t('route.lead'),
      HERO_ROUTE_STEPS: ROUTE_STEP_IDS.map((id) => ({
        id,
        label: t(`route.step.${id}.label` as MessageKey),
        hint: t(`route.step.${id}.hint` as MessageKey),
        path:
          id === 'os'
            ? '/institucional'
            : id === 'catalog'
              ? '/modelos'
              : id === 'pilot'
                ? TRY_MODEL_ENTRY
                : INSTITUTION_ROUTES.pilot,
        detail: t(`route.step.${id}.detail` as MessageKey),
        stat: t(`route.step.${id}.stat` as MessageKey),
      })),
      HERO_FIRST_MODEL: {
        kicker: t('model.first.kicker'),
        name: t('model.first.name'),
        subtitle: t('model.first.subtitle'),
        description: t('model.first.description'),
        demoLabel: t('model.first.demo'),
        path: '/modelos/egs',
        demoPath: INSTITUTION_ROUTES.pilot,
      },
      HERO_GOVERNANCE_COMPARE: {
        kicker: t('compare.kicker'),
        title: t('compare.title'),
        lead: t('compare.lead'),
        traditionalLabel: t('compare.traditional'),
        governance2Label: t('compare.governance2'),
        cta: t('compare.cta'),
        ctaPath: '/modelos/egs',
        dimensions: COMPARE_DIM_IDS.map((id) => ({
          id,
          label: t(`compare.dim.${id}` as MessageKey),
          traditional: t(`compare.dim.${id}.traditional` as MessageKey),
          governance2: t(`compare.dim.${id}.g2` as MessageKey),
        })),
      },
      LANDING_MODELS_KICKER: t('landing.models.kicker'),
      LANDING_MODELS_TITLE: t('landing.models.title'),
      LANDING_MODELS_BODY: t('landing.models.body'),
      LANDING_CTA_TITLE: t('landing.cta.title'),
      LANDING_CTA_LEAD: t('landing.cta.lead'),
      LANDING_CTA_MICRO: t('landing.cta.micro'),
      LANDING_CTA_ACTION: t('landing.cta.action'),
      LANDING_CTA_CONTACT: t('landing.cta.contact'),
      LANDING_MODELS_CATALOG: t('landing.models.catalog'),
      LANDING_CHALLENGE_KICKER: t('landing.models.kicker'),
      LANDING_CHALLENGE_TITLE: t('landing.models.title'),
      LANDING_CHALLENGE_LEAD: t('landing.models.body'),
      LANDING_CHALLENGE_BODY: '',
      HERO_PIPELINE_STEPS: PIPELINE_STEP_IDS.map((id) => ({
        id,
        label: t(`pipeline.step.${id}` as MessageKey),
      })),
      HERO_PIPELINE_CAPTION: t('pipeline.caption'),
      HERO_PIPELINE_KICKER: t('pipeline.kicker'),
      demoProgramName: t(programKey),
    };
  }, [t, sovereign.iso, sovereign.jurisdictionCode]);
}
