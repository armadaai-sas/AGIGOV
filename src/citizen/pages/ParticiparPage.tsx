import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { submitProposal, type ProposalReceipt } from '../api.js';
import { ActionReceipt } from '../components/ActionReceipt.js';
import { DictamenBadge } from '../components/DictamenBadge.js';
import { DeskPageHeader } from '../components/desk/DeskPageHeader.js';
import { PageShell, DsSpinner } from '../components/PageShell.js';
import { getDeskPageMeta } from '../platform/deskPageMeta.js';

const SECTORS = [
  { value: 'salud', label: 'Salud' },
  { value: 'educacion', label: 'Educación' },
  { value: 'infraestructura', label: 'Infraestructura' },
  { value: 'economia', label: 'Economía' },
  { value: 'gobernanza', label: 'Gobernanza' },
  { value: 'otro', label: 'Otro' },
] as const;

const meta = getDeskPageMeta('/participar')!;

export default function ParticiparPage() {
  const [title, setTitle] = useState('');
  const [sector, setSector] = useState('infraestructura');
  const [fact1, setFact1] = useState('');
  const [fact2, setFact2] = useState('');
  const [source1, setSource1] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ProposalReceipt | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setReceipt(null);
    setLoading(true);
    try {
      const result = await submitProposal({
        title,
        sector,
        facts: [
          { text: fact1, source: source1 || undefined },
          { text: fact2 },
        ],
      });
      setReceipt(result.receipt);
      setTitle('');
      setFact1('');
      setFact2('');
      setSource1('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell shell narrow>
      <div className="desk-page">
        <DeskPageHeader title="Participar" result={meta.result} dataHint={meta.dataHint} />

        <ol className="desk-form-steps" aria-label="Pasos del formulario">
          <li className="desk-form-step">
            <span className="desk-form-step-num">1</span>
            <div className="desk-form-step-fields">
              <label className="os-field">
                <span className="os-form-label">Título de la propuesta</span>
                <input
                  type="text"
                  maxLength={120}
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="os-form-input"
                  placeholder="Ej. Mejorar suministro de agua en mi comunidad"
                />
              </label>
              <label className="os-field">
                <span className="os-form-label">Sector</span>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="os-form-input"
                >
                  {SECTORS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </li>

          <li className="desk-form-step">
            <span className="desk-form-step-num">2</span>
            <div className="desk-form-step-fields">
              <span className="os-form-label">Primer hecho verificable</span>
              <textarea
                required
                rows={2}
                value={fact1}
                onChange={(e) => setFact1(e.target.value)}
                className="os-form-input resize-none"
                placeholder="Qué ocurre, dónde, cuándo"
              />
              <input
                type="text"
                value={source1}
                onChange={(e) => setSource1(e.target.value)}
                className="os-form-input"
                placeholder="Fuente opcional (URL o acta)"
              />
            </div>
          </li>

          <li className="desk-form-step">
            <span className="desk-form-step-num">3</span>
            <div className="desk-form-step-fields">
              <span className="os-form-label">Segundo hecho verificable</span>
              <textarea
                required
                rows={2}
                value={fact2}
                onChange={(e) => setFact2(e.target.value)}
                className="os-form-input resize-none"
                placeholder="Otro hecho que respalde la propuesta"
              />
            </div>
          </li>
        </ol>

        <form id="propuesta-form" onSubmit={(e) => void handleSubmit(e)} className="desk-form-actions">
          <button type="submit" disabled={loading} className="ds-btn-app">
            {loading ? <DsSpinner /> : null}
            Enviar propuesta
            <ArrowRight className="h-4 w-4" />
          </button>

          {error ? <p className="desk-form-error">{error}</p> : null}

          {receipt ? (
            <ActionReceipt
              title="Propuesta registrada"
              monoId={receipt.processId}
              action={{ label: 'Ver dictámenes', to: '/propuestas' }}
              onDismiss={() => setReceipt(null)}
            >
              <p className="flex flex-wrap items-center gap-2">
                <DictamenBadge dictamen={receipt.dictamen} />
              </p>
              <p>{receipt.citizenSummary}</p>
            </ActionReceipt>
          ) : null}
        </form>

        <p className="desk-page-secondary-link">
          <Link to="/propuestas">Ver dictámenes publicados →</Link>
        </p>
      </div>
    </PageShell>
  );
}
