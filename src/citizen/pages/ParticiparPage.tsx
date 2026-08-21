import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { submitProposal, type ProposalReceipt } from '../api.js';
import { ActionReceipt } from '../components/ActionReceipt.js';
import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { PageShell, SectionHeader, DsSpinner } from '../components/PageShell.js';
import { DictamenBadge } from '../components/DictamenBadge.js';

const SECTORS = [
  { value: 'salud', label: 'Salud' },
  { value: 'educacion', label: 'Educación' },
  { value: 'infraestructura', label: 'Infraestructura' },
  { value: 'economia', label: 'Economía' },
  { value: 'gobernanza', label: 'Gobernanza' },
  { value: 'otro', label: 'Otro' },
] as const;

/** Participar — una acción: enviar propuesta con hechos (sin tarjetas de ruido). */
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
    <PageShell narrow breadcrumbs={breadcrumbsForPath('/participar')}>
      <SectionHeader
        eyebrow="AGIGOV · Ciudadano"
        title="Participar"
        lead="Envía una propuesta con hechos. Sin datos personales en campos públicos."
        helpTopic="participar"
        action={
          <Link to="/propuestas" className="ds-btn-secondary ds-btn-app-shape">
            Ver propuestas
          </Link>
        }
      />

      <form
        id="propuesta-form"
        onSubmit={(e) => void handleSubmit(e)}
        className="agigov-card mb-8 space-y-5"
      >
        <label className="block space-y-2">
          <span className="text-sm font-medium text-agigov-text">Título</span>
          <input
            type="text"
            maxLength={120}
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="agigov-input"
            placeholder="Ej. Mejorar suministro de agua en mi comunidad"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-agigov-text">Sector</span>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="agigov-input"
          >
            {SECTORS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="space-y-4">
          <legend className="text-sm font-medium text-agigov-text">
            Dos hechos verificables
          </legend>
          <div className="space-y-2">
            <textarea
              required
              rows={2}
              value={fact1}
              onChange={(e) => setFact1(e.target.value)}
              className="agigov-input resize-none"
              placeholder="Hecho 1 — qué ocurre, dónde, cuándo"
            />
            <input
              type="text"
              value={source1}
              onChange={(e) => setSource1(e.target.value)}
              className="agigov-input text-sm"
              placeholder="Fuente opcional (URL o acta)"
            />
          </div>
          <textarea
            required
            rows={2}
            value={fact2}
            onChange={(e) => setFact2(e.target.value)}
            className="agigov-input resize-none"
            placeholder="Hecho 2"
          />
        </fieldset>

        <button type="submit" disabled={loading} className="ds-btn-app w-full sm:w-auto">
          {loading ? <DsSpinner /> : null}
          Enviar propuesta
          <ArrowRight className="h-4 w-4" />
        </button>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        {receipt ? (
          <ActionReceipt
            title="Propuesta registrada"
            monoId={receipt.processId}
            action={{ label: 'Ver en propuestas', to: '/propuestas' }}
            onDismiss={() => setReceipt(null)}
          >
            <p className="flex flex-wrap items-center gap-2">
              <DictamenBadge dictamen={receipt.dictamen} />
            </p>
            <p>{receipt.citizenSummary}</p>
          </ActionReceipt>
        ) : null}
      </form>
    </PageShell>
  );
}
