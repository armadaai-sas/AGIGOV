import { jsPDF } from 'jspdf';

import type { MinistryHealthResponse } from '../api.js';

function line(doc: jsPDF, y: number, label: string, value: string): number {
  doc.setFont('helvetica', 'bold');
  doc.text(label, 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(value, 72, y);
  return y + 7;
}

/** Informe trimestral EGS — PDF institucional (acción U2). */
export function downloadEgsMinistryPdf(data: MinistryHealthResponse): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const currency = data.currency;
  let y = 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Informe trimestral EGS', 14, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('AGIGOV — Reparto del ahorro por eficiencia', 14, y);
  y += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.ministryCode} · Q${data.quarter} ${data.fiscalYear}`, 14, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(data.programName, 14, y);
  y += 10;

  doc.setDrawColor(220, 220, 220);
  doc.line(14, y, 196, y);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.text('Resultado fiscal', 14, y);
  y += 7;
  doc.setFont('helvetica', 'normal');

  y = line(doc, y, 'Línea base trimestral', `${data.baselineTrimestral} ${currency}`);
  y = line(doc, y, 'Gasto verificado', `${data.gastosVerificados} ${currency}`);
  y = line(doc, y, 'Ahorro verificado (Δ)', `${data.calculoAhorroFinal} ${currency}`);
  y = line(doc, y, 'Estado centinela', data.reconcileOk ? 'Conforme' : 'FREEZE — discrepancia');
  y = line(doc, y, 'Cierre trimestral', data.quarterCloseStatus);
  y = line(doc, y, 'Publicado', data.published ? 'Sí' : 'No');
  y += 4;

  doc.setFont('helvetica', 'bold');
  doc.text('Reparto del ahorro (70 / 20 / 10)', 14, y);
  y += 7;
  doc.setFont('helvetica', 'normal');

  y = line(doc, y, '70% reinversión obras', `${data.split.reinversion} ${currency}`);
  y = line(doc, y, '20% mérito', `${data.split.meritPool} ${currency}`);
  y = line(doc, y, '10% protocolo AGIGOV', `${data.split.agigovFee} ${currency}`);
  y += 4;

  doc.setFont('helvetica', 'bold');
  doc.text('Ejecución', 14, y);
  y += 7;
  doc.setFont('helvetica', 'normal');

  y = line(doc, y, 'Hitos verificados', String(data.releaseCount));
  y = line(doc, y, 'Ejecución presupuesto', `${data.executionPct}%`);
  y = line(doc, y, 'Contratos en custodia', String(data.contracts.length));
  y += 4;

  if (data.discrepancies.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 0, 0);
    doc.text('Discrepancias', 14, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    for (const d of data.discrepancies) {
      const wrapped = doc.splitTextToSize(`• ${d}`, 180);
      doc.text(wrapped, 14, y);
      y += wrapped.length * 5;
    }
    doc.setTextColor(0, 0, 0);
    y += 4;
  }

  if (data.ledgerProcessId) {
    y = line(doc, y, 'Proceso ledger', data.ledgerProcessId);
  }

  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generado ${new Date(data.updatedAt).toLocaleString('es-VE')} · AGIGOV`, 14, y);
  doc.text('Documento derivado de telemetría fiscal verificada — no sustituye acta legal firmada.', 14, y + 5);

  const slug = `${data.ministryCode.toLowerCase()}-q${data.quarter}-${data.fiscalYear}`;
  doc.save(`informe-egs-${slug}.pdf`);
}
