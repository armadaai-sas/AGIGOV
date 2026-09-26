import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BookOpen,
  Briefcase,
  Code2,
  Database,
  FileCheck,
  FileText,
  HelpCircle,
  Package,
  Receipt,
  Rocket,
  Scale,
  ScrollText,
  Server,
  TrendingDown,
  Users,
} from 'lucide-react';

import type { DeskPersonaId } from './deskNav.js';
import { ENTERPRISE_ROUTES } from './enterpriseRoutes.js';
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

export type DeskHubZone = {
  id: string;
  label: string;
  items: readonly DeskHomeAction[];
};

export type DeskPersonaHome = {
  hubBadge: string;
  resultFocus: string;
  dataLead: string;
  steps: readonly [DeskHomeStep, DeskHomeStep, DeskHomeStep];
  primary: DeskHomeAction;
  secondary?: DeskHomeAction;
  zones: readonly DeskHubZone[];
};

const CITIZEN_HOME: DeskPersonaHome = {
  hubBadge: 'Ciudadano',
  resultFocus: 'Mira lo publicado y envía una propuesta con hechos.',
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
  zones: [
    {
      id: 'mirar',
      label: 'Mirar',
      items: [
        {
          to: '/gestion',
          label: 'Gestión pública',
          outcome: 'Actos publicados',
          icon: Activity,
        },
        {
          to: '/propuestas',
          label: 'Propuestas',
          outcome: 'Lo que ya se publicó',
          icon: FileText,
        },
        {
          to: '/transparencia',
          label: 'Transparencia',
          outcome: 'Marco legal publicado',
          icon: Scale,
        },
      ],
    },
    {
      id: 'introducir',
      label: 'Introducir',
      items: [
        {
          to: '/participar',
          label: 'Participar',
          outcome: 'Propuesta con hechos',
          icon: Users,
        },
      ],
    },
    {
      id: 'aprender',
      label: 'Aprender',
      items: [
        {
          to: '/ayuda',
          label: 'Ayuda',
          outcome: 'Tutoriales paso a paso',
          icon: HelpCircle,
        },
        {
          to: '/aprender/glosario',
          label: 'Glosario',
          outcome: 'Conceptos en lenguaje claro',
          icon: BookOpen,
        },
      ],
    },
  ],
};

const ENTERPRISE_HOME: DeskPersonaHome = {
  hubBadge: 'Empresa',
  resultFocus: 'Certifica un hito y consulta datos agregados.',
  dataLead: 'Tres pasos para conectar tus datos operativos.',
  steps: [
    { title: 'Recorre el catálogo', detail: 'Modelos B2B alineados a tu sector.' },
    { title: 'Introduce evidencia', detail: 'API o carga por hito de contrato.' },
    { title: 'Verifica liberación', detail: 'Custodia confirma — menos fricción al cobrar.' },
  ],
  primary: {
    to: '/modelos/evidencia-certificada',
    label: 'Certificar un hito',
    outcome: 'Evidencia del contrato',
    icon: Receipt,
  },
  secondary: {
    to: '/modelos/evidencia-certificada',
    label: 'Evidencia API',
    outcome: 'Certificar hitos',
    icon: Receipt,
  },
  zones: [
    {
      id: 'descubrir',
      label: 'Descubrir',
      items: [
        {
          to: ENTERPRISE_ROUTES.hub,
          label: 'Recorrido empresas',
          outcome: 'A→Z B2B',
          icon: Briefcase,
        },
        {
          to: '/modelos/data-trust',
          label: 'DATA Trust',
          outcome: 'Agregados verificables',
          icon: Database,
        },
      ],
    },
    {
      id: 'operar',
      label: 'Operar',
      items: [
        {
          to: '/modelos/evidencia-certificada',
          label: 'Evidencia API',
          outcome: 'Certificar hitos',
          icon: Receipt,
        },
      ],
    },
    {
      id: 'resultado',
      label: 'Resultado',
      items: [
        {
          to: '/contratos',
          label: 'Contratos',
          outcome: 'Custodia por hito',
          icon: FileCheck,
        },
        {
          to: '/modelos/iaau',
          label: 'IaaU',
          outcome: 'Infra por uso',
          icon: Server,
        },
      ],
    },
  ],
};

const STATE_HOME: DeskPersonaHome = {
  hubBadge: 'Estado',
  resultFocus: 'Revisa el ahorro publicado y los contratos.',
  dataLead: 'Tres pasos para desplegar con datos institucionales.',
  steps: [
    { title: 'Registra institución', detail: 'Correo oficial — sesión vinculada.' },
    { title: 'Activa el piloto de ahorro', detail: 'Datos fiscales en entorno seguro.' },
    { title: 'Publica resultado', detail: 'Telemetría visible en gestión pública.' },
  ],
  primary: {
    to: '/gestion',
    label: 'Ver el ahorro',
    outcome: 'Actos publicados',
    icon: Activity,
  },
  secondary: {
    to: modelWorkspacePath('egs'),
    label: 'Operar el ahorro',
    outcome: 'Ahorro certificado',
    icon: TrendingDown,
  },
  zones: [
    {
      id: 'desplegar',
      label: 'Desplegar',
      items: [
        {
          to: INSTITUTION_ROUTES.pilot,
          label: 'Piloto fiscal',
          outcome: 'Asistente de ahorro',
          icon: Rocket,
        },
        {
          to: modelWorkspacePath('egs'),
          label: 'Ahorro',
          outcome: 'Operar ahorro',
          icon: TrendingDown,
        },
      ],
    },
    {
      id: 'publicar',
      label: 'Publicar',
      items: [
        {
          to: '/gestion',
          label: 'Gestión pública',
          outcome: 'Actos publicados',
          icon: ScrollText,
        },
      ],
    },
    {
      id: 'custodiar',
      label: 'Custodiar',
      items: [
        {
          to: '/contratos',
          label: 'Contratos',
          outcome: 'Hitos con evidencia',
          icon: FileCheck,
        },
        {
          to: INSTITUTION_ROUTES.register,
          label: 'Registro',
          outcome: 'Cuenta institucional',
          icon: Rocket,
        },
      ],
    },
  ],
};

const INTEGRATOR_HOME: DeskPersonaHome = {
  hubBadge: 'Integrador',
  resultFocus: 'Abre la API y prueba un contrato.',
  dataLead: 'Tres pasos para integrar tu stack.',
  steps: [
    { title: 'Revisa la API', detail: 'Health, OpenAPI y rutas.' },
    { title: 'Firma envelopes IAP', detail: 'Cifrado y anti-replay entre agentes.' },
    { title: 'Prueba custodia', detail: 'Flujo de hitos en sandbox.' },
  ],
  primary: {
    to: '/desarrolladores',
    label: 'Abrir API',
    outcome: 'Health y OpenAPI',
    icon: Code2,
  },
  secondary: {
    to: '/contratos',
    label: 'Probar custodia',
    outcome: 'Hitos en cadena',
    icon: FileCheck,
  },
  zones: [
    {
      id: 'conectar',
      label: 'Conectar',
      items: [
        {
          to: '/desarrolladores',
          label: 'API',
          outcome: 'Health e integración',
          icon: Code2,
        },
        {
          to: '/modelos',
          label: 'Modelos',
          outcome: 'Catálogo de modelos',
          icon: Package,
        },
      ],
    },
    {
      id: 'probar',
      label: 'Probar',
      items: [
        {
          to: '/contratos',
          label: 'Custodia',
          outcome: 'Flujo de hitos',
          icon: FileCheck,
        },
      ],
    },
    {
      id: 'aprender',
      label: 'Aprender',
      items: [
        {
          to: '/aprender/glosario',
          label: 'Glosario',
          outcome: 'Términos en claro',
          icon: BookOpen,
        },
        {
          to: '/ayuda',
          label: 'Ayuda',
          outcome: 'Tutoriales técnicos',
          icon: HelpCircle,
        },
      ],
    },
  ],
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
