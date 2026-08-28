import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';

import {
  deployActionIcon,
  type DeployAction,
  type ModelWorkspaceExperience,
  type ModelWorkspaceSection,
} from '../../platform/modelDeployActions.js';

type Props = {
  experience: ModelWorkspaceExperience;
};

/** Funciones del modelo arriba · conectar/subir abajo — sin mezclar acciones. */
export function ModelWorkspaceActions({ experience }: Props) {
  return (
    <div className="os-workspace-actions">
      <p className="os-workspace-assurance">
        <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden />
        {experience.assurance}
      </p>
      <p className="os-workspace-intro">{experience.intro}</p>

      <ActionSection section={experience.functions} primary />

      {experience.connect && experience.connect.actions.length > 0 ? (
        <ActionSection section={experience.connect} />
      ) : null}
    </div>
  );
}

function ActionSection({ section, primary = false }: { section: ModelWorkspaceSection; primary?: boolean }) {
  return (
    <section
      className={`os-workspace-action-block${primary ? ' os-workspace-action-block--primary' : ''}`}
    >
      <header className="os-workspace-action-head">
        <h2 className="os-workspace-action-title">{section.title}</h2>
        {section.lead ? <p className="os-workspace-action-lead">{section.lead}</p> : null}
      </header>
      <ActionList actions={section.actions} />
    </section>
  );
}

function ActionList({ actions }: { actions: DeployAction[] }) {
  return (
    <ul className="os-workspace-list">
      {actions.map((action) => {
        const Icon = deployActionIcon(action.icon);
        return (
          <li key={`${action.to}-${action.label}`}>
            <Link to={action.to} className="os-workspace-row">
              <span className="os-workspace-row-icon" aria-hidden>
                <Icon className="h-4 w-4" />
              </span>
              <span className="os-workspace-row-body">
                <span className="os-workspace-row-name">{action.label}</span>
                <span className="os-workspace-row-meta">{action.meta}</span>
              </span>
              <ChevronRight className="os-workspace-row-chevron h-4 w-4" aria-hidden />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
