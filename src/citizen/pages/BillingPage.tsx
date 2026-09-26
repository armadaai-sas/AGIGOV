import { useState, type FormEvent } from 'react';

import { createBillingOrder, fetchBillingPlans, type BillingOrderReceipt, type PublicBillingPlan } from '../api.js';
import { DeskPageHeader } from '../components/desk/DeskPageHeader.js';
import { PageShell } from '../components/PageShell.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { getDeskPageMeta } from '../platform/deskPageMeta.js';

const meta = getDeskPageMeta('/facturacion')!;

function money(amount: number): string {
  if (amount === 0) return '0 USD';
  return `${amount.toLocaleString('en-US')} USD / año`;
}

export default function BillingPage() {
  const plans = useCachedFetch('billing-plans', fetchBillingPlans, 60_000);
  const [planId, setPlanId] = useState<PublicBillingPlan['id']>('saas');
  const [institutionName, setInstitutionName] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<BillingOrderReceipt | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const order = await createBillingOrder({ plan: planId, institutionName, email });
      setReceipt(order);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo registrar el pedido.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell shell>
      <div className="desk-page">
        <DeskPageHeader title="Plan" result={meta.result} dataHint={meta.dataHint} />

        <ul className="desk-page-list">
          {(plans.data?.plans ?? []).map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="desk-page-row"
                aria-pressed={planId === item.id}
                onClick={() => setPlanId(item.id)}
              >
                <span className="desk-page-row-copy">
                  <span className="desk-page-row-title">{item.name}</span>
                  <span className="desk-page-row-summary">{item.summary}</span>
                </span>
                <span className="desk-page-row-meta">{money(item.amountUsd)}</span>
              </button>
            </li>
          ))}
        </ul>

        <form className="desk-billing-form" onSubmit={(event) => void onSubmit(event)}>
          <h2 className="desk-page-title">Su pedido</h2>
          <label className="os-field">
            <span className="os-form-label">Institución</span>
            <input
              className="os-form-input"
              value={institutionName}
              onChange={(event) => setInstitutionName(event.target.value)}
              autoComplete="organization"
              required
            />
          </label>
          <label className="os-field">
            <span className="os-form-label">Correo</span>
            <input
              className="os-form-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <button type="submit" className="desk-page-primary-btn" disabled={busy}>
            {busy ? 'Registrando' : 'Pedir este plan'}
          </button>
        </form>

        {error ? <p className="desk-page-data-hint">{error}</p> : null}
        {receipt ? (
          <p className="desk-page-result">
            {receipt.message} Referencia {receipt.id}.
          </p>
        ) : null}
      </div>
    </PageShell>
  );
}
