import type { ReactNode } from 'react';

import { DeskPageHeader } from '../desk/DeskPageHeader.js';

type Props = {
  eyebrow?: string;
  title: string;
  result: string;
  dataHint?: string;
  action?: ReactNode;
  children: ReactNode;
};

/** Canvas centrado para consolas de modelo — simetría y aire. */
export function ModelConsoleLayout({
  eyebrow,
  title,
  result,
  dataHint,
  action,
  children,
}: Props) {
  return (
    <div className="desk-console">
      <DeskPageHeader
        eyebrow={eyebrow}
        title={title}
        result={result}
        dataHint={dataHint}
        action={action}
      />
      <div className="desk-console-body">{children}</div>
    </div>
  );
}

/** Zona semántica dentro de consola — espaciado uniforme. */
export function ModelConsoleZone({
  label,
  children,
  className = '',
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`desk-console-zone ${className}`.trim()} aria-label={label}>
      {label ? <h2 className="desk-console-zone-label">{label}</h2> : null}
      {children}
    </section>
  );
}
