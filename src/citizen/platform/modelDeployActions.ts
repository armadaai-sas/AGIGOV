import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BookOpen,
  FileUp,
  FolderOpen,
  MessageSquare,
  Plug,
  Shield,
  UserPlus,
  Vote,
} from 'lucide-react';

import type { AgigovModel } from './agigovModels.js';
import { INSTITUTION_ROUTES } from './institutionalRoutes.js';
import { modelConsolePath } from './modelWorkspace.js';

export const WORKSPACE_ASSURANCE =
  'Ambiente de trabajo verificable: sus datos quedan en el registro con trazabilidad y revisión centinela antes de publicarse.';

export type DeployActionIcon =
  | 'api'
  | 'upload'
  | 'health'
  | 'contracts'
  | 'docs'
  | 'participate'
  | 'vote'
  | 'projects'
  | 'account';

export type DeployAction = {
  to: string;
  label: string;
  meta: string;
  icon: DeployActionIcon;
};

export type ModelWorkspaceSection = {
  title: string;
  lead?: string;
  actions: DeployAction[];
};

export type ModelWorkspaceExperience = {
  assurance: string;
  intro: string;
  functions: ModelWorkspaceSection;
  connect?: ModelWorkspaceSection;
};

const ICONS: Record<DeployActionIcon, LucideIcon> = {
  api: Plug,
  upload: FileUp,
  health: Activity,
  contracts: Shield,
  docs: BookOpen,
  participate: MessageSquare,
  vote: Vote,
  projects: FolderOpen,
  account: UserPlus,
};

export function deployActionIcon(icon: DeployActionIcon): LucideIcon {
  return ICONS[icon];
}

export function getModelWorkspaceExperience(model: AgigovModel): ModelWorkspaceExperience {
  switch (model.id) {
    case 'egs':
      return {
        assurance: WORKSPACE_ASSURANCE,
        intro: 'Opera el cierre trimestral, revisa contratos y consulta el marco legal.',
        functions: {
          title: 'Obtener resultados',
          actions: [
            healthAction(modelConsolePath('egs'), 'Reporte trimestral · baseline y ahorro'),
            contractsAction('Cadena de custodia por hito'),
            docsAction(),
          ],
        },
        connect: connectSection('Baseline, contratos e hitos'),
      };

    case 'escrow-institucional':
      return {
        assurance: WORKSPACE_ASSURANCE,
        intro: 'Consulte contratos en custodia y el detalle de cada hito verificado.',
        functions: {
          title: 'Obtener resultados',
          actions: [
            contractsAction('Listado y detalle de hitos'),
            healthAction(modelConsolePath('egs'), 'Salud presupuestaria vinculada'),
          ],
        },
        connect: connectSection('Contratos, hitos y evidencia'),
      };

    case 'gestion-verificable':
      return {
        assurance: WORKSPACE_ASSURANCE,
        intro: 'Telemetría publicada del registro y canal de reporte ciudadano.',
        functions: {
          title: 'Obtener resultados',
          actions: [
            {
              to: '/gestion',
              label: 'Ver registro publicado',
              meta: 'Actas y métricas sin PII',
              icon: 'health',
            },
            {
              to: '/gestion#reportar',
              label: 'Reportar irregularidad',
              meta: 'Canal centinela',
              icon: 'participate',
            },
          ],
        },
        connect: connectSectionOptional(),
      };

    case 'participacion':
      return {
        assurance: WORKSPACE_ASSURANCE,
        intro: 'Consulte dictámenes publicados o envíe una propuesta con hechos verificables.',
        functions: {
          title: 'Obtener resultados',
          actions: [
            {
              to: '/propuestas',
              label: 'Ver propuestas',
              meta: 'Dictámenes en el registro',
              icon: 'docs',
            },
            {
              to: '/participar',
              label: 'Enviar propuesta',
              meta: 'Recibo con hash de ledger',
              icon: 'participate',
            },
          ],
        },
        connect: connectSectionOptional(),
      };

    case 'consulta-ciudadana':
      return {
        assurance: WORKSPACE_ASSURANCE,
        intro: 'Participe en la consulta activa y obtenga recibo verificable de su voto.',
        functions: {
          title: 'Obtener resultados',
          actions: [
            {
              to: '/cne',
              label: 'Abrir consulta',
              meta: 'Voto cifrado · recuento en vivo',
              icon: 'vote',
            },
          ],
        },
        connect: connectSectionOptional(),
      };

    case 'set':
      return {
        assurance: WORKSPACE_ASSURANCE,
        intro: 'Audite recuento, commits en registro y estado del despliegue electoral.',
        functions: {
          title: 'Obtener resultados',
          actions: [
            {
              to: modelConsolePath('set'),
              label: 'Panel de recuento',
              meta: 'Resultados parciales y ledger SET',
              icon: 'health',
            },
            {
              to: '/cne',
              label: 'Emitir voto',
              meta: 'Boleta cifrada · recibo hash',
              icon: 'vote',
            },
          ],
        },
        connect: connectSection('Proceso electoral institucional'),
      };

    case 'dao-ciudadano':
      return {
        assurance: WORKSPACE_ASSURANCE,
        intro: 'Explore proyectos con escrow visible y registre aportes trazables.',
        functions: {
          title: 'Obtener resultados',
          actions: [
            {
              to: '/proyectos?tab=dao',
              label: 'Ver proyectos',
              meta: 'Avance por hito y recaudación',
              icon: 'projects',
            },
            {
              to: '/proyectos?tab=dao',
              label: 'Detalle y aporte',
              meta: 'Recibo en ledger al aportar',
              icon: 'health',
            },
          ],
        },
        connect: connectSectionOptional(),
      };

    case 'evidencia-certificada':
      return {
        assurance: WORKSPACE_ASSURANCE,
        intro: 'Consulte evidencia publicada y su vínculo con contratos en custodia.',
        functions: {
          title: 'Obtener resultados',
          actions: [
            {
              to: modelConsolePath('evidencia-certificada'),
              label: 'Registro de evidencia',
              meta: 'Actas, hitos y dictámenes',
              icon: 'docs',
            },
            contractsAction('Contratos ligados a evidencia'),
          ],
        },
        connect: {
          title: 'Alimentar el modelo',
          lead: 'Envíe hitos firmados o suba archivos.',
          actions: [apiAction('API evidencia IAP'), uploadAction('PDF, actas y fotos por hito')],
        },
      };

    case 'iaau':
      return {
        assurance: WORKSPACE_ASSURANCE,
        intro: 'Revise consumo por unidad, conciliación con ledger y factura estimada.',
        functions: {
          title: 'Obtener resultados',
          actions: [
            {
              to: modelConsolePath('iaau'),
              label: 'Panel de uso',
              meta: 'Metering y conciliación centinela',
              icon: 'health',
            },
            {
              to: '/desarrolladores',
              label: 'Referencia API',
              meta: 'Endpoints de integración',
              icon: 'api',
            },
          ],
        },
        connect: {
          title: 'Alimentar el modelo',
          lead: 'Conecte su sistema para registrar unidades consumidas.',
          actions: [apiAction(), accountAction()],
        },
      };

    case 'data-trust':
      return {
        assurance: WORKSPACE_ASSURANCE,
        intro: 'Explore datasets agregados k-anonymizados listos para licencia.',
        functions: {
          title: 'Obtener resultados',
          actions: [
            {
              to: modelConsolePath('data-trust'),
              label: 'Catálogo de datasets',
              meta: 'Métricas por sector · sin PII',
              icon: 'health',
            },
            {
              to: '/desarrolladores',
              label: 'API enterprise',
              meta: 'Consulta programática',
              icon: 'api',
            },
          ],
        },
        connect: {
          title: 'Alimentar el modelo',
          lead: 'Pipeline ETL desde telemetría institucional.',
          actions: [apiAction(), accountAction()],
        },
      };

    default:
      if (model.consolePath) {
        return {
          assurance: WORKSPACE_ASSURANCE,
          intro: model.tagline,
          functions: {
            title: 'Obtener resultados',
            actions: [
              {
                to: model.consolePath,
                label: 'Abrir consola',
                meta: model.tagline,
                icon: 'health',
              },
            ],
          },
          connect: connectSection(),
        };
      }
      return {
        assurance: WORKSPACE_ASSURANCE,
        intro: 'Registre su institución para empezar.',
        functions: {
          title: 'Empezar',
          actions: [accountAction()],
        },
        connect: {
          title: 'Alimentar el modelo',
          actions: [apiAction(), uploadAction()],
        },
      };
  }
}

function connectSection(uploadMeta?: string): ModelWorkspaceSection {
  return {
    title: 'Alimentar el modelo',
    lead: 'Conecte sus datos cuando esté listo para operar.',
    actions: [uploadAction(uploadMeta), apiAction()],
  };
}

function connectSectionOptional(): ModelWorkspaceSection {
  return {
    title: 'Integración',
    lead: 'Opcional — para equipos que automatizan consultas.',
    actions: [apiAction()],
  };
}

function apiAction(meta = 'Endpoints y health del nodo'): DeployAction {
  return { to: '/desarrolladores', label: 'Conectar API', meta, icon: 'api' };
}

function uploadAction(meta = 'CSV, PDF y actas'): DeployAction {
  return { to: INSTITUTION_ROUTES.pilot, label: 'Subir documentos', meta, icon: 'upload' };
}

function accountAction(): DeployAction {
  return {
    to: INSTITUTION_ROUTES.register,
    label: 'Crear cuenta',
    meta: 'Institución o integrador',
    icon: 'account',
  };
}

function healthAction(to: string, meta: string): DeployAction {
  return { to, label: 'Ver reporte', meta, icon: 'health' };
}

function contractsAction(meta = 'Hitos, escrow y liberaciones'): DeployAction {
  return { to: '/contratos', label: 'Contratos en custodia', meta, icon: 'contracts' };
}

function docsAction(): DeployAction {
  return {
    to: '/transparencia',
    label: 'Documentos del modelo',
    meta: 'Marco legal y dictamen',
    icon: 'docs',
  };
}

export function getModelDeployExplanation(model: AgigovModel): string {
  return getModelWorkspaceExperience(model).intro;
}
