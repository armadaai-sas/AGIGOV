import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  Vote,
  Handshake,
  Code2,
  ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { submitProposal, type ProposalReceipt } from '../api.js';
import { ActionReceipt } from '../components/ActionReceipt.js';
import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { PageShell, SectionHeader, DsSpinner } from '../components/PageShell.js';
import { DictamenBadge } from '../components/DictamenBadge.js';

const channels = [
  {
    icon: Megaphone,
    title: 'Propuestas ciudadanas',
    text: 'Presenta ideas con hechos verificables. Pipeline: received → validated → dictamen.',
    status: 'Activo',
    active: true,
    href: '#propuesta-form',
  },
  {
    icon: Vote,
    title: 'Campañas y respaldo',
    text: 'Registra campañas con metadatos públicos y financiamiento transparente.',
    status: 'Próximamente',
    active: false,
    href: '/institucional',
  },
  {
    icon: Handshake,
    title: 'Nodos comunitarios',
    text: 'Opera un nodo territorial y sincroniza gestión offline-first.',
    status: 'Demo disponible',
    active: false,
    href: '/institucional',
  },
  {
    icon: Code2,
    title: 'Desarrolladores',
    text: 'Contribuye al protocolo AGIGOV: API, agentes, seguridad PQC.',
    status: 'Abierto',
    active: true,
    href: '/desarrolladores',
  },
] as const;

const SECTORS = [
  { value: 'salud', label: 'Salud' },
  { value: 'educacion', label: 'Educación' },
  { value: 'infraestructura', label: 'Infraestructura' },
  { value: 'economia', label: 'Economía' },
  { value: 'gobernanza', label: 'Gobernanza' },
  { value: 'otro', label: 'Otro' },
] as const;

export default function ParticiparPage() {
  const [title, setTitle] = useState('');
  const [sector, setSector] = useState('infraestructura');
  const [fact1, setFact1] = useState('');
  const [fact2, setFact2] = useState('');
  const [source1, setSource1] = useState('');
  const [source2, setSource2] = useState('');
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
          { text: fact2, source: source2 || undefined },
        ],
      });
      setReceipt(result.receipt);
      setTitle('');
      setFact1('');
      setFact2('');
      setSource1('');
      setSource2('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell narrow breadcrumbs={breadcrumbsForPath('/participar')}>
      <SectionHeader
        eyebrow="AGIGOV · Participación Ciudadana"
        title="Participa en la transformación"
        lead={
          <>
            Construye el modelo con propuestas verificables. Piloto{' '}
            <strong className="text-agigov-text">MAR_NORTH_01</strong> — sin datos personales en
            campos públicos.
          </>
        }
        helpTopic="participar"
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-2 agigov-stagger-list">
        {channels
          .filter((c) => c.active)
          .map(({ icon, title: channelTitle, text, status, active, href }) => (
            <ChannelCard
              key={channelTitle}
              icon={icon}
              title={channelTitle}
              text={text}
              status={status}
              active={active}
              href={href}
            />
          ))}
      </div>
      <p className="mb-8 text-sm text-agigov-text-muted">
        Campañas y nodos comunitarios: próximamente. Mientras tanto use propuestas o el{' '}
        <Link to="/desarrolladores" className="agigov-link">
          portal de desarrolladores
        </Link>
        .
      </p>

      <form
        id="propuesta-form"
        onSubmit={(e) => void handleSubmit(e)}
        className="agigov-card mb-8 space-y-5 scroll-mt-24"
      >
        <div>
          <h2 className="font-display text-xl font-semibold text-agigov-text">
            Nueva propuesta ciudadana
          </h2>
          <p className="mt-1 text-sm text-agigov-text-muted">
            Nivel A — opinión registrada. Mínimo 2 hechos verificables.
          </p>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-agigov-text">Título de la propuesta</span>
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
          <legend className="text-sm font-medium text-agigov-text">Hechos verificables</legend>
          <div className="space-y-2">
            <textarea
              required
              rows={3}
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
              placeholder="Fuente opcional (URL, acta, informe)"
            />
          </div>
          <div className="space-y-2">
            <textarea
              required
              rows={3}
              value={fact2}
              onChange={(e) => setFact2(e.target.value)}
              className="agigov-input resize-none"
              placeholder="Hecho 2"
            />
            <input
              type="text"
              value={source2}
              onChange={(e) => setSource2(e.target.value)}
              className="agigov-input text-sm"
              placeholder="Fuente opcional"
            />
          </div>
        </fieldset>

        <button type="submit" disabled={loading} className="ds-btn-app w-full sm:w-auto">
          {loading ? <DsSpinner /> : null}
          Enviar propuesta
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

      <section className="agigov-card">
        <h2 className="font-semibold text-agigov-text">Seguir explorando</h2>
        <p className="mt-2 text-sm text-agigov-text-muted">
          Vea propuestas registradas o vuelva al catálogo de modelos.
        </p>
        <Link to="/propuestas" className="ds-btn-secondary ds-btn-app-shape mt-4 inline-flex">
          Ver propuestas
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </PageShell>
  );
}

function ChannelCard({
  icon: Icon,
  title,
  text,
  status,
  active,
  href,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  status: string;
  active: boolean;
  href: string;
  key?: string;
}) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className={`agigov-pillar-icon ${!active ? 'opacity-50' : ''}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={`agigov-badge ${
            active ? 'bg-emerald-500/15 text-emerald-200' : 'bg-white/10 text-agigov-text-muted'
          }`}
        >
          {status}
        </span>
      </div>
      <h3 className="mt-3 font-semibold text-agigov-text">{title}</h3>
      <p className="mt-1 text-sm text-agigov-text-muted">{text}</p>
    </>
  );

  if (href.startsWith('#')) {
    return (
      <a href={href} className="agigov-card-interactive block">
        {inner}
      </a>
    );
  }

  return (
    <Link to={href} className="agigov-card-interactive block">
      {inner}
    </Link>
  );
}
