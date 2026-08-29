import type { LucideIcon } from 'lucide-react';
import { Briefcase, Code2, Database, Mail, Package, Receipt, Server } from 'lucide-react';

import type { MessageKey } from '../../i18n/index.js';
import { TEAM_CONTACT_MAILTO } from '../platform/institutionalRoutes.js';
import { ENTERPRISE_ROUTES } from '../platform/enterpriseRoutes.js';

export type EnterpriseJourneyStepId =
  | 'discover'
  | 'data'
  | 'evidence'
  | 'iaau'
  | 'integrate'
  | 'contact';

export type EnterpriseJourneyStep = {
  id: EnterpriseJourneyStepId;
  order: string;
  to: string;
  icon: LucideIcon;
  external?: boolean;
  titleKey: MessageKey;
  metaKey: MessageKey;
  pricingKey: MessageKey;
};

export const ENTERPRISE_JOURNEY_STEPS: readonly EnterpriseJourneyStep[] = [
  {
    id: 'discover',
    order: '01',
    to: ENTERPRISE_ROUTES.catalog,
    icon: Package,
    titleKey: 'enterprise.journey.discover.title',
    metaKey: 'enterprise.journey.discover.meta',
    pricingKey: 'enterprise.journey.pricing.free',
  },
  {
    id: 'data',
    order: '02',
    to: ENTERPRISE_ROUTES.dataTrust,
    icon: Database,
    titleKey: 'enterprise.journey.data.title',
    metaKey: 'enterprise.journey.data.meta',
    pricingKey: 'enterprise.journey.pricing.usage',
  },
  {
    id: 'evidence',
    order: '03',
    to: ENTERPRISE_ROUTES.evidenceApi,
    icon: Receipt,
    titleKey: 'enterprise.journey.evidence.title',
    metaKey: 'enterprise.journey.evidence.meta',
    pricingKey: 'enterprise.journey.pricing.usage',
  },
  {
    id: 'iaau',
    order: '04',
    to: ENTERPRISE_ROUTES.iaau,
    icon: Server,
    titleKey: 'enterprise.journey.iaau.title',
    metaKey: 'enterprise.journey.iaau.meta',
    pricingKey: 'enterprise.journey.pricing.usage',
  },
  {
    id: 'integrate',
    order: '05',
    to: ENTERPRISE_ROUTES.developers,
    icon: Code2,
    titleKey: 'enterprise.journey.integrate.title',
    metaKey: 'enterprise.journey.integrate.meta',
    pricingKey: 'enterprise.journey.pricing.free',
  },
  {
    id: 'contact',
    order: '06',
    to: TEAM_CONTACT_MAILTO,
    icon: Mail,
    external: true,
    titleKey: 'enterprise.journey.contact.title',
    metaKey: 'enterprise.journey.contact.meta',
    pricingKey: 'enterprise.journey.pricing.contact',
  },
] as const;

export const ENTERPRISE_HUB_ICON = Briefcase;
