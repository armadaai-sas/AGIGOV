import type { CoreDb } from '../client.js';
import { computeQuarterClose, sumVerifiedReleases } from './quarter-close.js';

export type ReconcileResult = {
  ok: boolean;
  quarterCloseId: string;
  gastosVerificados: number;
  calculoAhorroFinal: number;
  reinversionAmount: number;
  meritPoolAmount: number;
  agigovFeeAmount: number;
  releaseCount: number;
  discrepancies: string[];
};

/** centinela — reconcilia releases ↔ escrow RELEASED antes de calcular Δ. */
export async function reconcileQuarterClose(
  db: CoreDb,
  quarterCloseId: string,
): Promise<ReconcileResult> {
  const discrepancies: string[] = [];

  const qc = await db.quarterClose.findUniqueOrThrow({
    where: { id: quarterCloseId },
    include: {
      verifiedReleases: { include: { escrow: true } },
      forceMajeureAdjustments: true,
    },
  });

  if (qc.status === 'FROZEN') {
    return {
      ok: false,
      quarterCloseId,
      gastosVerificados: 0,
      calculoAhorroFinal: 0,
      reinversionAmount: 0,
      meritPoolAmount: 0,
      agigovFeeAmount: 0,
      releaseCount: qc.verifiedReleases.length,
      discrepancies: ['QuarterClose FROZEN — cierre bloqueado'],
    };
  }

  for (const release of qc.verifiedReleases) {
    if (release.escrow.status !== 'RELEASED') {
      discrepancies.push(
        `Release ${release.id}: escrow ${release.escrow.processId} status=${release.escrow.status}, expected RELEASED`,
      );
    }
  }

  const gastosFromReleases = sumVerifiedReleases(
    qc.verifiedReleases.map((r) => ({ amount: Number(r.amount) })),
  );
  const ajustes = qc.forceMajeureAdjustments.reduce((acc, a) => acc + Number(a.amount), 0);
  const baseline = Number(qc.baselineTrimestral);

  let computed: ReturnType<typeof computeQuarterClose>;
  try {
    computed = computeQuarterClose({
      baselineTrimestral: baseline,
      gastosVerificados: gastosFromReleases,
      ajustesFuerzaMayor: ajustes,
    });
  } catch (error) {
    discrepancies.push(error instanceof Error ? error.message : 'Error cálculo Δ');
    return {
      ok: false,
      quarterCloseId,
      gastosVerificados: gastosFromReleases,
      calculoAhorroFinal: 0,
      reinversionAmount: 0,
      meritPoolAmount: 0,
      agigovFeeAmount: 0,
      releaseCount: qc.verifiedReleases.length,
      discrepancies,
    };
  }

  if (discrepancies.length > 0) {
    await db.quarterClose.update({
      where: { id: quarterCloseId },
      data: { status: 'FROZEN' },
    });
    return {
      ok: false,
      quarterCloseId,
      gastosVerificados: gastosFromReleases,
      calculoAhorroFinal: computed.calculoAhorroFinal,
      reinversionAmount: computed.reinversionAmount,
      meritPoolAmount: computed.meritPoolAmount,
      agigovFeeAmount: computed.agigovFeeAmount,
      releaseCount: qc.verifiedReleases.length,
      discrepancies,
    };
  }

  await db.quarterClose.update({
    where: { id: quarterCloseId },
    data: {
      gastosVerificados: gastosFromReleases,
      ajustesFuerzaMayor: ajustes,
      calculoAhorroFinal: computed.calculoAhorroFinal,
      reinversionAmount: computed.reinversionAmount,
      meritPoolAmount: computed.meritPoolAmount,
      agigovFeeAmount: computed.agigovFeeAmount,
      status: 'DELTA_CALCULATED',
    },
  });

  return {
    ok: true,
    quarterCloseId,
    gastosVerificados: gastosFromReleases,
    calculoAhorroFinal: computed.calculoAhorroFinal,
    meritPoolAmount: computed.meritPoolAmount,
    reinversionAmount: computed.reinversionAmount,
    agigovFeeAmount: computed.agigovFeeAmount,
    releaseCount: qc.verifiedReleases.length,
    discrepancies: [],
  };
}
