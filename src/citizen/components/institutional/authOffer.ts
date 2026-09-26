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
  open: string;
  enter: string;
  emailHint: string;
  nameHint: string;
};

export type AuthOffer = {
  product: string;
  choose: string;
  innovationLabel: string;
  innovation: string;
  whyLabel: string;
  why: string;
  canLabel: string;
  roles: AuthRoleOffer[];
};

const ES: AuthOffer = {
  product: 'AGIGOV es el escritorio donde una institución publica lo que hace, y se puede revisar.',
  choose: 'Elija su escritorio',
  innovationLabel: 'La innovación',
  innovation: 'El cierre, el contrato y la propuesta salen del mismo lugar. No de un informe aparte.',
  whyLabel: 'Por qué AGIGOV',
  why: 'Si una cifra no cuadra, una persona la detiene antes de publicarla.',
  canLabel: 'Qué puede hacer aquí',
  roles: [
    {
      id: 'state',
      label: 'Estado',
      tile: 'Cierre y contratos',
      headline: 'Publique el trimestre. Defiéndalo con hechos.',
      purpose: 'Para un ministerio o ente que cierra un rubro y lo muestra.',
      can: 'Ver el ahorro, preparar el piloto y pedir un plan.',
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
      purpose: 'Para una empresa que evidencia un contrato o lee cifras agregadas.',
      can: 'Evidenciar un hito, ver el sector y pedir licencia.',
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
      purpose: 'Para quien quiere ver la gestión y enviar una propuesta. Su nombre no va al registro público.',
      can: 'Ver la gestión, participar y seguir una propuesta.',
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
      purpose: 'Para un equipo que integra la API y deja rastro de cada llamada.',
      can: 'Ver la salud del servicio, leer los modelos y pedir acceso.',
      open: 'Abra el escritorio de integración',
      enter: 'Entre al escritorio de integración',
      emailHint: 'api@organizacion.com',
      nameHint: 'Nombre de la organización',
    },
  ],
};

const EN: AuthOffer = {
  product: 'AGIGOV is the desk where an institution publishes what it does, and anyone can check it.',
  choose: 'Choose your desk',
  innovationLabel: 'The innovation',
  innovation: 'The close, the contract, and the proposal come from the same place. Not from a separate report.',
  whyLabel: 'Why AGIGOV',
  why: 'If a figure does not match, a person stops it before it is published.',
  canLabel: 'What you can do here',
  roles: [
    {
      id: 'state',
      label: 'State',
      tile: 'Close and contracts',
      headline: 'Publish the quarter. Defend it with facts.',
      purpose: 'For a ministry or agency that closes a line and shows it.',
      can: 'See savings, prepare the pilot, and request a plan.',
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
      purpose: 'For a company that files a contract or reads aggregate figures.',
      can: 'File a milestone, see the sector, and request a license.',
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
      purpose: 'For someone who wants to see management and send a proposal. Your name stays off the public record.',
      can: 'See management, take part, and follow a proposal.',
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
      purpose: 'For a team that integrates the API and leaves a trail of each call.',
      can: 'See service health, read the models, and request access.',
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
