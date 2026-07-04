/** Badge semántico CONFORME / REVISAR (Fase E4). */
export function DictamenBadge({ dictamen }: { dictamen: 'CONFORME' | 'REVISAR' }) {
  const meta =
    dictamen === 'CONFORME'
      ? {
          label: 'CONFORME',
          className: 'agigov-dictamen agigov-dictamen--conforme',
        }
      : {
          label: 'REVISAR',
          className: 'agigov-dictamen agigov-dictamen--revisar',
        };

  return <span className={meta.className}>{meta.label}</span>;
}

/** Inferir dictamen desde resumen ciudadano cuando no hay campo explícito. */
export function inferDictamen(text: string): 'CONFORME' | 'REVISAR' | null {
  if (/\bCONFORME\b/i.test(text)) return 'CONFORME';
  if (/\bREVISAR\b/i.test(text)) return 'REVISAR';
  return null;
}
