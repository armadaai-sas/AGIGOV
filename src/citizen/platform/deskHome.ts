import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Code2,
  Database,
  FileCheck,
  Rocket,
  TrendingDown,
  Users,
} from 'lucide-react';

import type { DeskPersonaId } from './deskNav.js';
import { INSTITUTION_ROUTES } from './institutionalRoutes.js';
import { modelWorkspacePath } from './modelWorkspace.js';

export type DeskHomeStep = {
  title: string;
  detail: string;
};

export type DeskHomeAction = {
  to: string;
  label: string;
  outcome: string;
  icon: LucideIcon;
};

export type DeskPersonaHome = {
  /** Enfoque en el resultado — una frase tranquila y clara. */
  resultFocus: string;
  /** Cómo entra la data — subtítulo breve. */
  dataLead: string;
  /** Tres pasos simples — introducir datos sin fricción. */
  steps: readonly [DeskHomeStep, DeskHomeStep, DeskHomeStep];
  primary: DeskHomeAction;
  secondary?: DeskHomeAction;
};

const CITIZEN_HOME: DeskPersonaHome = {
  resultFocus: 'Tu aporte queda en el registro público con hechos verificables.',
  dataLead: 'Tres pasos para introducir tu propuesta.',
  steps: [
    { title: 'Abre Participar', detail: 'Describe la utilidad concreta que buscas.' },
    { title: 'Introduce hechos', detail: 'Cifras, fuentes o evidencia que respalden la propuesta.' },
    { title: 'Publica y sigue', detail: 'Queda en dictámenes — consulta el estado cuando quieras.' },
  ],
  primary: {
    to: '/participar',
    label: 'Participar',
    outcome: 'Enviar propuesta con hechos',
    icon: Users,
  },
  secondary: {
    to: '/gestion',
    label: 'Ver registro',
    outcome: 'Gestión pública en vivo',
    icon: Activity,
  },
};

const ENTERPRISE_HOME: DeskPersonaHome = {
  resultFocus: 'Certifica hitos y libera cobros con evidencia demostrable.',
  dataLead: 'Tres pasos para conectar tus datos operativos.',
  steps: [
    { title: 'Define el hito', detail: 'Contrato o modelo con criterio medible de cumplimiento.' },
    { title: 'Introduce evidencia', detail: 'API, archivo o registro que prueba el hito.' },
    { title: 'Verifica liberación', detail: 'Custodia confirma — menos fricción al cobrar.' },
  ],
  primary: {
    to: '/modelos/evidencia-certificada',
    label: 'Evidencia API',
    outcome: 'Certificar hitos de contrato',
    icon: Database,
  },
  secondary: {
    to: '/contratos',
    label: 'Ver contratos',
    outcome: 'Custodia y liberación por hito',
    icon: FileCheck,
  },
};

const STATE_HOME: DeskPersonaHome = {
  resultFocus: 'Opera ahorro fiscal con telemetría publicada para la ciudadanía.',
  dataLead: 'Tres pasos para desplegar con datos institucionales.',
  steps: [
    { title: 'Registra institución', detail: 'Correo oficial — la sesión queda vinculada.' },
    { title: 'Activa piloto EGS', detail: 'Introduce datos fiscales en entorno seguro.' },
    { title: 'Publica resultado', detail: 'Telemetría y ledger visibles en gestión pública.' },
  ],
  primary: {
    to: INSTITUTION_ROUTES.pilot,
    label: 'Piloto fiscal',
    outcome: 'Desplegar EGS con asistencia',
    icon: Rocket,
  },
  secondary: {
    to: modelWorkspacePath('egs'),
    label: 'Operar EGS',
    outcome: 'Ahorro certificado en consola',
    icon: TrendingDown,
  },
};

const INTEGRATOR_HOME: DeskPersonaHome = {
  resultFocus: 'Integra sistemas con trazabilidad firmada en cadena.',
  dataLead: 'Tres pasos para conectar tu stack.',
  steps: [
    { title: 'Revisa la API', detail: 'Health, OpenAPI y rutas de integración.' },
    { title: 'Firma envelopes IAP', detail: 'Datos entre agentes — cifrado y anti-replay.' },
    { title: 'Prueba custodia', detail: 'Flujo de hitos en sandbox antes de producción.' },
  ],
  primary: {
    to: '/desarrolladores',
    label: 'Abrir API',
    outcome: 'Health, OpenAPI e integración',
    icon: Code2,
  },
  secondary: {
    to: '/contratos',
    label: 'Probar custodia',
    outcome: 'Hitos y evidencia en cadena',
    icon: FileCheck,
  },
};

export function getDeskPersonaHome(persona: DeskPersonaId): DeskPersonaHome {
  switch (persona) {
    case 'citizen':
      return CITIZEN_HOME;
    case 'enterprise':
      return ENTERPRISE_HOME;
    case 'state':
      return STATE_HOME;
    case 'integrator':
      return INTEGRATOR_HOME;
  }
}
