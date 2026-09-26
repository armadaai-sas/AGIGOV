import type { DeskPersonaId } from '../../platform/deskNav.js';

export type AuthRoleOffer = {
  id: DeskPersonaId;
  label: string;
  /** Una línea en la ficha del rol. */
  tile: string;
  /** Titular que cambia al elegir el rol. */
  headline: string;
  purpose: string;
  can: string;
  /** Tres acciones cortas, en el orden en que el usuario las usa. */
  actions: [string, string, string];
  open: string;
  enter: string;
  emailHint: string;
  nameHint: string;
};

export type AuthOffer = {
  product: string;
  choose: string;
  assurance: string;
  innovationLabel: string;
  innovation: string;
  whyLabel: string;
  why: string;
  canLabel: string;
  roles: AuthRoleOffer[];
};

const ES: AuthOffer = {
  product: 'El cierre, el contrato y la propuesta quedan en el mismo registro.',
  choose: 'Su escritorio',
  assurance: 'Una persona verifica la cuenta. El correo de alta no sale solo.',
  innovationLabel: 'La innovación',
  innovation: 'El cierre, el contrato y la propuesta salen del mismo registro.',
  whyLabel: 'Por qué AGIGOV',
  why: 'Si una cifra no cuadra, una persona la detiene.',
  canLabel: 'Qué puede hacer aquí',
  roles: [
    {
      id: 'state',
      label: 'Estado',
      tile: 'Cierre y contratos',
      headline: 'Publique el trimestre. Defiéndalo con hechos.',
      purpose: 'Publique el cierre del trimestre y los contratos. Cada cifra se puede revisar.',
      can: 'Ver el ahorro, preparar el piloto y pedir un plan.',
      actions: ['Ver el ahorro', 'Preparar el piloto', 'Pedir un plan'],
      open: 'Abra el escritorio del Estado',
      enter: 'Entre al escritorio del Estado',
      emailHint: 'finanzas@ministerio.gob.ve',
      nameHint: 'Ministerio de Hacienda',
    },
    {
      id: 'enterprise',
      label: 'Empresa',
      tile: 'Hitos y sector',
      headline: 'Certifique un hito. Lea el sector sin datos personales.',
      purpose: 'Certifique un hito y lea las cifras del sector, sin datos personales.',
      can: 'Evidenciar un hito, ver el sector y pedir licencia.',
      actions: ['Evidenciar un hito', 'Ver el sector', 'Pedir licencia'],
      open: 'Abra el escritorio de su empresa',
      enter: 'Entre al escritorio de su empresa',
      emailHint: 'contratos@empresa.com',
      nameHint: 'Nombre legal de la empresa',
    },
    {
      id: 'citizen',
      label: 'Ciudadano',
      tile: 'Gestión y propuestas',
      headline: 'Lea lo publicado. Participe con hechos.',
      purpose: 'Vea lo publicado y envíe una propuesta. Su nombre no va al registro público.',
      can: 'Ver la gestión, participar y seguir una propuesta.',
      actions: ['Ver la gestión', 'Enviar una propuesta', 'Seguir una propuesta'],
      open: 'Abra su escritorio',
      enter: 'Entre a su escritorio',
      emailHint: 'usted@correo.com',
      nameHint: 'Su nombre',
    },
    {
      id: 'integrator',
      label: 'Integrador',
      tile: 'API y modelos',
      headline: 'Conecte su sistema. Compruebe que responde.',
      purpose: 'Conecte su sistema y compruebe que la API responde, con rastro.',
      can: 'Ver la salud del servicio, leer los modelos y pedir acceso.',
      actions: ['Ver la salud del servicio', 'Leer los modelos', 'Pedir acceso'],
      open: 'Abra el escritorio de integración',
      enter: 'Entre al escritorio de integración',
      emailHint: 'api@organizacion.com',
      nameHint: 'Nombre de la organización',
    },
  ],
};

const EN: AuthOffer = {
  product: 'The close, the contract, and the proposal stay in the same record.',
  choose: 'Your desk',
  assurance: 'A person verifies the account. The signup email is not sent on its own.',
  innovationLabel: 'The innovation',
  innovation: 'The close, the contract, and the proposal come from the same record.',
  whyLabel: 'Why AGIGOV',
  why: 'If a figure does not match, a person stops it.',
  canLabel: 'What you can do here',
  roles: [
    {
      id: 'state',
      label: 'State',
      tile: 'Close and contracts',
      headline: 'Publish the quarter. Defend it with facts.',
      purpose: 'Publish the quarter close and the contracts. Every figure can be checked.',
      can: 'See savings, prepare the pilot, and request a plan.',
      actions: ['See savings', 'Prepare the pilot', 'Request a plan'],
      open: 'Open the state desk',
      enter: 'Sign in to the state desk',
      emailHint: 'finance@ministry.gov',
      nameHint: 'Ministry of Finance',
    },
    {
      id: 'enterprise',
      label: 'Enterprise',
      tile: 'Milestones and sector',
      headline: 'Certify a milestone. Read the sector without personal data.',
      purpose: 'Certify a milestone and read the sector figures, without personal data.',
      can: 'File a milestone, see the sector, and request a license.',
      actions: ['File a milestone', 'See the sector', 'Request a license'],
      open: 'Open your company desk',
      enter: 'Sign in to your company desk',
      emailHint: 'contracts@company.com',
      nameHint: 'Legal company name',
    },
    {
      id: 'citizen',
      label: 'Citizen',
      tile: 'Management and proposals',
      headline: 'Read what is published. Take part with facts.',
      purpose: 'See what is published and send a proposal. Your name stays off the public record.',
      can: 'See management, take part, and follow a proposal.',
      actions: ['See management', 'Send a proposal', 'Follow a proposal'],
      open: 'Open your desk',
      enter: 'Sign in to your desk',
      emailHint: 'you@email.com',
      nameHint: 'Your name',
    },
    {
      id: 'integrator',
      label: 'Integrator',
      tile: 'API and models',
      headline: 'Connect your system. Check that it responds.',
      purpose: 'Connect your system and check that the API responds, with a trail.',
      can: 'See service health, read the models, and request access.',
      actions: ['See service health', 'Read the models', 'Request access'],
      open: 'Open the integration desk',
      enter: 'Sign in to the integration desk',
      emailHint: 'api@organization.com',
      nameHint: 'Organization name',
    },
  ],
};

export function authOffer(locale: string): AuthOffer {
  return locale.toLowerCase().startsWith('en') ? EN : ES;
}

export function accountNameLabel(persona: DeskPersonaId, locale: string): string {
  const en = locale.toLowerCase().startsWith('en');
  if (persona === 'citizen') return en ? 'Your name' : 'Su nombre';
  if (persona === 'enterprise') return en ? 'Company name' : 'Nombre de la empresa';
  if (persona === 'integrator') return en ? 'Organization' : 'Organización';
  return en ? 'Institution name' : 'Nombre de la institución';
}
