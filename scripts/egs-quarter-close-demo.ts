#!/usr/bin/env tsx
/** Demo: consulta cierre trimestral EGS piloto vial. */
import 'dotenv/config';

import { disconnectCoreDb, getCoreDb } from '../src/db/client.js';
import { reconcileQuarterClose } from '../src/db/egs/reconcile-quarter-close.js';
import { toTreasuryPayload } from '../src/db/egs/quarter-close.js';

async function main() {
  const db = getCoreDb();
  const qc = await db.quarterClose.findFirst({
    where: { budgetLinePilot: { ministryCode: 'MPPI' } },
    orderBy: { createdAt: 'desc' },
    include: {
      budgetLinePilot: true,
      verifiedReleases: true,
    },
  });

  if (!qc) {
    console.error('Sin QuarterClose piloto. Ejecuta: npm run db:seed:egs-pilot');
    process.exit(1);
  }

  const result = await reconcileQuarterClose(db, qc.id);

  console.log('\n=== Cierre trimestral EGS — Piloto Vial VE ===\n');
  console.log(`Ministerio: ${qc.budgetLinePilot.ministryCode} · ${qc.budgetLinePilot.programName}`);
  console.log(`Trimestre: ${qc.fiscalYear} Q${qc.quarter} · Estado: ${result.ok ? 'DELTA_CALCULATED' : 'FROZEN/BLOCKED'}`);
  console.log(`Baseline trimestral:     ${Number(qc.baselineTrimestral).toLocaleString('es-VE')} VES`);
  console.log(`Gastos verificados:      ${result.gastosVerificados.toLocaleString('es-VE')} VES`);
  console.log(`Ahorro (Δ):              ${result.calculoAhorroFinal.toLocaleString('es-VE')} VES`);
  console.log(`  → Re-inversión (70%):  ${result.reinversionAmount.toLocaleString('es-VE')} VES`);
  console.log(`  → Incentivos (20%):    ${result.meritPoolAmount.toLocaleString('es-VE')} VES`);
  console.log(`  → Fee AGIGOV (10%):    ${result.agigovFeeAmount.toLocaleString('es-VE')} VES`);
  console.log(`Hitos contabilizados:    ${result.releaseCount}`);

  if (result.discrepancies.length) {
    console.log('\nDiscrepancias centinela:');
    result.discrepancies.forEach((d) => console.log(`  - ${d}`));
  }

  if (qc.ledgerProcessId) {
    const payload = toTreasuryPayload(
      qc.id,
      qc.fiscalYear,
      qc.quarter,
      qc.currency,
      qc.ledgerProcessId,
      {
        baselineTrimestral: Number(qc.baselineTrimestral),
        gastosVerificados: result.gastosVerificados,
        ajustesFuerzaMayor: Number(qc.ajustesFuerzaMayor),
        calculoAhorroFinal: result.calculoAhorroFinal,
        reinversionAmount: result.reinversionAmount,
        meritPoolAmount: result.meritPoolAmount,
        agigovFeeAmount: result.agigovFeeAmount,
      },
    );
    console.log('\nPayload tesorería (JSON):');
    console.log(JSON.stringify(payload, null, 2));
  }

  await disconnectCoreDb();
}

main().catch(async (e) => {
  console.error(e);
  await disconnectCoreDb();
  process.exit(1);
});
