import { useState } from 'react';
import { Link } from 'react-router-dom';

import { castCneVote, fetchCneConsultation, type CneConsultation } from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import {
  PageShell,
  LoadingState,
  DsSpinner,
} from '../components/PageShell.js';
import { ActionReceipt } from '../components/ActionReceipt.js';
import { modelWorkspacePath } from '../platform/modelWorkspace.js';

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
    <PageShell shell narrow>
      <div className="os-workspace">
        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">Consulta ciudadana</h1>
            <p className="os-workspace-sub">
              Boleta cifrada y recuento reproducible.
            </p>
          </div>
          <div className="os-workspace-cta flex flex-wrap gap-2">
            <Link to={modelWorkspacePath('consulta-ciudadana')} className="ds-btn-secondary ds-btn-app-shape">
              Espacio consulta
            </Link>
            <Link to="/modelos/set/consola" className="os-btn-text text-[13px]">
              Panel SET
            </Link>
          </div>
        </header>

        {error && state === 'error' && !data ? (
          <DataConnectionState module="cne" error={error} onRetry={() => void reload()} />
        ) : null}

        {!consultation && state !== 'error' ? <LoadingState /> : null}

        {consultation ? (
          <>
            <section className="os-panel">
              <h2 className="text-[13px] font-semibold text-zinc-900">{consultation.title}</h2>
              <p className="mt-2 text-[13px] text-zinc-600">{consultation.description}</p>
              <p className="mt-2 text-xs text-zinc-500">
                Fase {consultation.phase} · {consultation.territoryCode} · {consultation.status}
              </p>
            </section>

            <section className="os-workspace-section">
              <h2 className="os-workspace-section-title">Opciones</h2>
              <ul className="os-workspace-list">
                {consultation.options.map((opt) => {
                  const total = consultation.options.reduce((s, o) => s + o.votes, 0) || 1;
                  const pct = Math.round((opt.votes / total) * 100);
                  return (
                    <li key={opt.id}>
                      <div className="os-workspace-row os-workspace-row--static flex-col items-stretch gap-2 py-3">
                        <div className="flex w-full items-center justify-between gap-3">
                          <span className="os-workspace-row-name">{opt.label}</span>
                          <span className="os-workspace-row-status">
                            {opt.votes} · {pct}%
                          </span>
                        </div>
                        <div className="agigov-progress-track h-1.5">
                          <div
                            className="agigov-progress-fill h-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        {consultation.status === 'open' ? (
                          <button
                            type="button"
                            className="ds-btn-secondary ds-btn-app-shape mt-1 self-start"
                            disabled={voting !== null}
                            onClick={() => void vote(opt.id)}
                          >
                            {voting === opt.id ? <DsSpinner /> : null}
                            Votar
                          </button>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
              {voteError ? <p className="mt-2 text-[13px] text-zinc-600">{voteError}</p> : null}
              {receiptHash ? (
                <ActionReceipt
                  className="mt-4"
                  title="Voto registrado"
                  monoId={`${receiptHash.slice(0, 24)}…`}
                  onDismiss={() => setReceiptHash(null)}
                >
                  <p>Recuento agregado — sin identidad en ledger público.</p>
                </ActionReceipt>
              ) : null}
            </section>
          </>
        ) : null}
      </div>
    </PageShell>
  );
}
