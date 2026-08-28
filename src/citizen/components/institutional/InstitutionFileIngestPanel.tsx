import { useCallback, useState } from 'react';
import { FileSpreadsheet, FileText, Upload, X } from 'lucide-react';

import { useSovereignConfig } from '../../context/PlatformContext.js';
import {
  parseCsvDelivery,
  readPdfMeta,
  validateCrossDeliveryFiles,
  type DeliveryRow,
  type ParsedCsvDelivery,
  type PdfDeliveryMeta,
} from '../../institutional/parseDeliveryFiles.js';

type Props = {
  onRowsReady: (rows: DeliveryRow[], skipReasons: string[]) => void;
};

/** Carga planilla CSV + informe PDF como entrega de alcaldía. */
export function InstitutionFileIngestPanel({ onRowsReady }: Props) {
  const { t } = useSovereignConfig();
  const [csv, setCsv] = useState<ParsedCsvDelivery | null>(null);
  const [pdf, setPdf] = useState<PdfDeliveryMeta | null>(null);
  const [validation, setValidation] = useState<ReturnType<typeof validateCrossDeliveryFiles> | null>(
    null,
  );
  const [busy, setBusy] = useState(false);

  const runValidation = useCallback(
    (nextCsv: ParsedCsvDelivery | null, nextPdf: PdfDeliveryMeta | null) => {
      const result = validateCrossDeliveryFiles({ csv: nextCsv, pdf: nextPdf });
      setValidation(result);
      if (result.ok && nextCsv) {
        onRowsReady(nextCsv.rows, result.skipReasons);
      }
      return result;
    },
    [onRowsReady],
  );

  async function onCsvFile(file: File) {
    setBusy(true);
    try {
      const text = await file.text();
      const parsed = parseCsvDelivery(text, file.name);
      setCsv(parsed);
      runValidation(parsed, pdf);
    } finally {
      setBusy(false);
    }
  }

  async function onPdfFile(file: File) {
    setBusy(true);
    try {
      const meta = await readPdfMeta(file);
      setPdf(meta);
      runValidation(csv, meta);
    } finally {
      setBusy(false);
    }
  }

  function clearCsv() {
    setCsv(null);
    setValidation(null);
  }

  function clearPdf() {
    setPdf(null);
    if (csv) runValidation(csv, null);
    else setValidation(null);
  }

  return (
    <div className="inst-file-ingest">
      <p className="text-sm text-agigov-text-muted">{t('pilot.ingest.filesLead')}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="inst-file-drop">
          <input
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onCsvFile(f);
            }}
          />
          <FileSpreadsheet className="h-8 w-8 text-zinc-500" aria-hidden />
          <span className="font-medium text-agigov-text">{t('pilot.ingest.csvLabel')}</span>
          <span className="text-xs text-agigov-text-muted">{t('pilot.ingest.csvHint')}</span>
          <Upload className="mt-2 h-4 w-4 text-agigov-text-muted" aria-hidden />
        </label>

        <label className="inst-file-drop">
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onPdfFile(f);
            }}
          />
          <FileText className="h-8 w-8 text-zinc-500" aria-hidden />
          <span className="font-medium text-agigov-text">{t('pilot.ingest.pdfLabel')}</span>
          <span className="text-xs text-agigov-text-muted">{t('pilot.ingest.pdfHint')}</span>
          <Upload className="mt-2 h-4 w-4 text-agigov-text-muted" aria-hidden />
        </label>
      </div>

      {csv ? (
        <div className="inst-file-chip">
          <FileSpreadsheet className="h-4 w-4 text-zinc-500" aria-hidden />
          <span>
            {csv.fileName} · {csv.rows.length} {t('pilot.ingest.rows')}
          </span>
          <button type="button" className="inst-file-chip-x" onClick={clearCsv} aria-label="Quitar CSV">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {pdf ? (
        <div className="inst-file-chip">
          <FileText className="h-4 w-4 text-zinc-500" aria-hidden />
          <span>
            {pdf.fileName} · {(pdf.sizeBytes / 1024).toFixed(1)} KB
          </span>
          <button type="button" className="inst-file-chip-x" onClick={clearPdf} aria-label="Quitar PDF">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {validation ? (
        <div className="mt-4 space-y-2 text-sm">
          {validation.errors.map((e) => (
            <p key={e} className="text-zinc-600">
              · {e}
            </p>
          ))}
          {validation.warnings.map((w) => (
            <p key={w} className="text-zinc-500">
              · {w}
            </p>
          ))}
          {validation.ok ? (
            <p className="text-zinc-500">{t('pilot.ingest.filesOk')}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
