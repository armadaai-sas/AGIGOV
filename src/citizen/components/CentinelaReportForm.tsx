import { useState, type FormEvent } from 'react';
import { ShieldAlert } from 'lucide-react';

import { submitIrregularityReport } from '../api.js';
import { ActionReceipt } from './ActionReceipt.js';
import { DsSpinner } from './PageShell.js';

const CATEGORIES = [
  { value: 'escrow', label: 'Custodia / fondos' },
  { value: 'ledger', label: 'Integridad ledger' },
  { value: 'propuesta', label: 'Propuesta / dictamen' },
  { value: 'suministro', label: 'Suministros' },
  { value: 'otro', label: 'Otro' },
] as const;

/** Reporte irregularidad → conciliador (Paso 13). */
export function CentinelaReportForm() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('ledger');
  const [description, setDescription] = useState('');
  const [evidenceRef, setEvidenceRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processId, setProcessId] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setProcessId(null);

    if (description.trim().length < 20) {
      setError('Describe la irregularidad con al menos 20 caracteres');
      return;
    }

    setLoading(true);
    try {
      const result = await submitIrregularityReport({
        category,
        description,
        evidenceRef: evidenceRef || undefined,
      });
      setProcessId(result.receipt.processId);
      setDescription('');
      setEvidenceRef('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        className="agigov-centinela-trigger"
        onClick={() => setOpen(true)}
      >
        <ShieldAlert className="h-4 w-4" aria-hidden />
        Reportar irregularidad
      </button>
    );
  }

  return (
    <div className="agigov-panel-expand">
      <form onSubmit={(e) => void handleSubmit(e)} className="os-panel">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-zinc-900">Centinela ciudadano</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Describe hechos verificables — sin datos personales. Conciliador revisará el proceso.
            </p>
          </div>
          <button
            type="button"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            onClick={() => {
              setOpen(false);
              setProcessId(null);
              setError(null);
            }}
          >
            Cerrar
          </button>
        </div>

        <label className="mt-4 block text-sm">
          <span className="text-agigov-text-muted">Categoría</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="agigov-input mt-1 w-full"
          >
            {CATEGORIES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-3 block text-sm">
          <span className="text-agigov-text-muted">Descripción (mín. 20 caracteres)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            minLength={20}
            required
            className="agigov-input mt-1 w-full"
            placeholder="Qué observaste, con referencia verificable (ID proceso, hash, fecha)…"
          />
        </label>

        <label className="mt-3 block text-sm">
          <span className="text-agigov-text-muted">Referencia evidencia (opcional)</span>
          <input
            value={evidenceRef}
            onChange={(e) => setEvidenceRef(e.target.value)}
            className="agigov-input mt-1 w-full"
            placeholder="processId o URL pública"
          />
        </label>

        <button type="submit" disabled={loading} className="ds-btn-secondary ds-btn-app-shape mt-4">
          {loading ? <DsSpinner /> : null}
          Enviar reporte
        </button>

        {error ? <p className="mt-2 text-sm text-zinc-600 agigov-enter-up">{error}</p> : null}
        {processId ? (
          <ActionReceipt
            className="mt-4"
            title="Reporte registrado"
            monoId={processId}
            onDismiss={() => setProcessId(null)}
          >
            <p>Centinela y conciliador revisarán la evidencia — sin publicar datos personales.</p>
          </ActionReceipt>
        ) : null}
      </form>
    </div>
  );
}
