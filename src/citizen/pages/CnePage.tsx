import { useState } from 'react';

import { castCneVote, fetchCneConsultation, type CneConsultation } from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import {
  PageShell,
  SectionHeader,
  LoadingState,
  DsSpinner,
} from '../components/PageShell.js';
import { ActionReceipt } from '../components/ActionReceipt.js';

export default function CnePage() {
  const { data, error, state, reload } = useCachedFetch('cne-consultation', fetchCneConsultation, 10_000);
  const [voting, setVoting] = useState<string | null>(null);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [receiptHash, setReceiptHash] = useState<string | null>(null);
  const [localConsultation, setLocalConsultation] = useState<CneConsultation | null>(null);

  const consultation = localConsultation ?? data?.consultation;

  async function vote(optionId: string) {
    setVoteError(null);
    setReceiptHash(null);
    setVoting(optionId);
    try {
      const result = await castCneVote(optionId);
      setLocalConsultation(result.consultation);
      setReceiptHash(result.receipt.receiptHash);
      void reload();
    } catch (err) {
      setVoteError(err instanceof Error ? err.message : 'Error al votar');
    } finally {
      setVoting(null);
    }
  }

  return (
    <PageShell narrow breadcrumbs={breadcrumbsForPath('/cne')}>
      <SectionHeader
        eyebrow="AGIGOV · Consulta Ciudadana Verificable"
        title="Consulta ciudadana demo"
        lead="Boleta cifrada, commit firmado Ed25519 y recuento reproducible — demo SET-CNE-1-beta, no elección nacional."
      />

      {error && state === 'error' && !data ? (
        <DataConnectionState
          module="cne"
          error={error}
          onRetry={() => void reload()}
        />
      ) : null}

      {!consultation && state !== 'error' ? <LoadingState /> : null}

      {consultation ? (
        <div className="space-y-6 agigov-stagger-list">
          <section className="agigov-card">
            <h2 className="font-display text-lg font-semibold">{consultation.title}</h2>
            <p className="agigov-lead mt-2">{consultation.description}</p>
            <p className="mt-3 text-xs text-agigov-text-muted">
              Fase {consultation.phase} · {consultation.territoryCode} · Estado: {consultation.status}
            </p>
          </section>

          <section className="agigov-card">
            <h2 className="font-display text-lg font-semibold">¿Qué priorizamos?</h2>
            <ul className="mt-4 space-y-3">
              {consultation.options.map((opt) => {
                const total = consultation.options.reduce((s, o) => s + o.votes, 0) || 1;
                const pct = Math.round((opt.votes / total) * 100);
                return (
                  <li key={opt.id} className="agigov-vote-option">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="font-medium">{opt.label}</span>
                      <span className="text-sm text-agigov-text-muted">
                        {opt.votes} votos · {pct}%
                      </span>
                    </div>
                    <div className="agigov-progress-track mt-2">
                      <div className="agigov-progress-fill agigov-progress-fill--vote" style={{ width: `${pct}%` }} />
                    </div>
                    {consultation.status === 'open' ? (
                      <button
                        type="button"
                        className="ds-btn-secondary ds-btn-app-shape mt-3"
                        disabled={voting !== null}
                        onClick={() => void vote(opt.id)}
                      >
                        {voting === opt.id ? <DsSpinner /> : null}
                        Votar por esta opción
                      </button>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            {voteError ? <p className="mt-3 text-sm text-red-300 agigov-enter-up">{voteError}</p> : null}
            {receiptHash ? (
              <ActionReceipt
                className="mt-4"
                title="Voto registrado"
                monoId={`${receiptHash.slice(0, 24)}…`}
                onDismiss={() => setReceiptHash(null)}
              >
                <p>Recuento agregado actualizado — sin identidad en ledger público.</p>
              </ActionReceipt>
            ) : null}
          </section>
        </div>
      ) : null}
    </PageShell>
  );
}
