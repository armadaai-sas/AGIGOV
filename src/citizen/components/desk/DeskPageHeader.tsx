import type { ReactNode } from 'react';

type DeskPageHeaderProps = {
  title: string;
  result: string;
  dataHint?: string;
  eyebrow?: string;
  action?: ReactNode;
};

/** Cabecera ergonómica — resultado primero, acción única opcional. */
export function DeskPageHeader({ title, result, dataHint, eyebrow, action }: DeskPageHeaderProps) {
  return (
    <header className="desk-page-head">
      <div className="desk-page-head-text">
        {eyebrow ? <p className="desk-page-eyebrow">{eyebrow}</p> : null}
        <h1 className="desk-page-title">{title}</h1>
        <p className="desk-page-result">{result}</p>
        {dataHint ? <p className="desk-page-data-hint">{dataHint}</p> : null}
      </div>
      {action ? <div className="desk-page-action">{action}</div> : null}
    </header>
  );
}
