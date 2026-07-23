import type { JurisdictionIso } from '../../config/sovereign/jurisdictions.js';

export type ImplementationId = 'generic' | 'ven' | 'col' | 'usa' | 'sbx';

export type ImplementationOption = {
  id: ImplementationId;
  label: string;
  territory: string;
  iso: JurisdictionIso;
  description: string;
  institutionalPath: string;
};

export const IMPLEMENTATIONS: readonly ImplementationOption[] = [
  {
    id: 'generic',
    label: 'Global model',
    territory: 'AGIGOV',
    iso: 'GEN',
    description: 'Base protocol — catalog of government, enterprise, and citizen models.',
    institutionalPath: '/institucional#protocolo',
  },
  {
    id: 'ven',
    label: 'Venezuela',
    territory: 'AGIGOV-VEN',
    iso: 'VEN',
    description: 'National implementation — ratified charter and territorial pilot.',
    institutionalPath: '/institucional#carta',
  },
  {
    id: 'col',
    label: 'Colombia',
    territory: 'AGIGOV-COL',
    iso: 'COL',
    description: 'Institutional pilot — COP currency, es-CO locale.',
    institutionalPath: '/institucional#protocolo',
  },
  {
    id: 'usa',
    label: 'United States',
    territory: 'AGIGOV-USA',
    iso: 'USA',
    description: 'Institutional pilot — USD currency, en-US locale.',
    institutionalPath: '/institucional#protocolo',
  },
  {
    id: 'sbx',
    label: 'Sandbox',
    territory: 'AGIGOV-SBX',
    iso: 'SBX',
    description: 'Interop and institutional test environment.',
    institutionalPath: '/institucional#protocolo',
  },
] as const;

export function getImplementation(id: ImplementationId): ImplementationOption {
  return IMPLEMENTATIONS.find((i) => i.id === id) ?? IMPLEMENTATIONS[0];
}

export function implementationIdFromIso(iso: string): ImplementationId {
  const found = IMPLEMENTATIONS.find((i) => i.iso === iso.toUpperCase());
  return found?.id ?? 'generic';
}
