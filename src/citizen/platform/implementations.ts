export type ImplementationId = 'generic' | 'ven' | 'sbx';

export type ImplementationOption = {
  id: ImplementationId;
  label: string;
  territory: string;
  description: string;
  institutionalPath: string;
};

export const IMPLEMENTATIONS: readonly ImplementationOption[] = [
  {
    id: 'generic',
    label: 'Modelo genérico',
    territory: 'AGIGOV',
    description: 'Protocolo base — catálogo de modelos gubernamental, empresarial y ciudadano.',
    institutionalPath: '/institucional#protocolo',
  },
  {
    id: 'sbx',
    label: 'Sandbox',
    territory: 'SBX',
    description: 'Entorno de interoperabilidad y pruebas institucionales.',
    institutionalPath: '/institucional#protocolo',
  },
] as const;

export function getImplementation(id: ImplementationId): ImplementationOption {
  return IMPLEMENTATIONS.find((i) => i.id === id) ?? IMPLEMENTATIONS[0];
}
