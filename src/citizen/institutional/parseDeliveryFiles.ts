export type DeliveryRow = {
  contractRef: string;
  milestoneIndex: number;
  amount: string;
  evidenceRef?: string;
  sourceLine?: number;
};

export type ParsedCsvDelivery = {
  fileName: string;
  rows: DeliveryRow[];
  warnings: string[];
};

export type PdfDeliveryMeta = {
  fileName: string;
  sizeBytes: number;
  sha256Prefix: string;
};

export type CrossFileValidation = {
  ok: boolean;
  errors: string[];
  warnings: string[];
  skipReasons: string[];
};

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ',' && !inQuotes) {
      out.push(cur.trim());
      cur = '';
      continue;
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function normalizeHeader(h: string): string {
  return h
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]/g, '');
}

export function parseCsvDelivery(text: string, fileName: string): ParsedCsvDelivery {
  const warnings: string[] = [];
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    return { fileName, rows: [], warnings: ['Archivo vacío'] };
  }

  const headerCells = splitCsvLine(lines[0]!);
  const headerMap = headerCells.map(normalizeHeader);

  const idxContract =
    headerMap.findIndex((h) => h.includes('contrato') || h.includes('contract') || h === 'ref') ??
    -1;
  const idxMilestone =
    headerMap.findIndex((h) => h.includes('hito') || h.includes('milestone') || h.includes('indice')) ??
    -1;
  const idxAmount =
    headerMap.findIndex((h) => h.includes('monto') || h.includes('amount') || h.includes('importe')) ??
    -1;

  const usePositional = idxContract < 0 || idxMilestone < 0 || idxAmount < 0;
  if (usePositional) {
    warnings.push('Encabezados no reconocidos — usando columnas 1·2·3 como contrato · hito · monto');
  }

  const rows: DeliveryRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]!);
    if (cells.every((c) => !c.trim())) continue;

    const contractRef = (usePositional ? cells[0] : cells[idxContract])?.trim() ?? '';
    const milestoneRaw = usePositional ? cells[1] : cells[idxMilestone];
    const amount = (usePositional ? cells[2] : cells[idxAmount])?.trim() ?? '';

    if (!contractRef || !amount) {
      warnings.push(`Línea ${i + 1}: fila incompleta omitida`);
      continue;
    }

    const milestoneIndex = Number.parseInt(String(milestoneRaw ?? '0'), 10);
    if (!Number.isFinite(milestoneIndex)) {
      warnings.push(`Línea ${i + 1}: hito inválido`);
      continue;
    }

    rows.push({
      contractRef,
      milestoneIndex,
      amount: amount.replace(/[^\d.,-]/g, '').replace(',', '.'),
      evidenceRef: `csv:${fileName}:L${i + 1}`,
      sourceLine: i + 1,
    });
  }

  return { fileName, rows, warnings };
}

export async function hashFilePrefix(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function readPdfMeta(file: File): Promise<PdfDeliveryMeta> {
  return {
    fileName: file.name,
    sizeBytes: file.size,
    sha256Prefix: await hashFilePrefix(file),
  };
}

export function validateCrossDeliveryFiles(input: {
  csv?: ParsedCsvDelivery | null;
  pdf?: PdfDeliveryMeta | null;
  skipReasons?: string[];
}): CrossFileValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const skipReasons = [...(input.skipReasons ?? [])];

  if (!input.csv || input.csv.rows.length === 0) {
    errors.push('Falta planilla CSV con al menos una fila de hito.');
  }

  if (!input.pdf) {
    warnings.push('Sin informe PDF adjunto — centinela marcará revisión manual.');
    skipReasons.push('pdf_missing');
  } else if (input.pdf.sizeBytes < 512) {
    errors.push('El PDF parece vacío o corrupto (< 512 bytes).');
  }

  if (input.csv) {
    warnings.push(...input.csv.warnings);
    const dup = new Set<string>();
    for (const row of input.csv.rows) {
      const key = `${row.contractRef}:${row.milestoneIndex}`;
      if (dup.has(key)) {
        errors.push(`Hito duplicado en CSV: ${key}`);
      }
      dup.add(key);
      if (!row.amount || Number(row.amount) <= 0) {
        errors.push(`Monto inválido en línea ${row.sourceLine ?? '?'}`);
      }
    }
  }

  if (input.csv && input.pdf) {
    const csvTotal = input.csv.rows.reduce((s, r) => s + (Number(r.amount) || 0), 0);
    if (csvTotal <= 0) {
      errors.push('Total CSV es cero — revise montos.');
    } else {
      warnings.push(`Total CSV: ${csvTotal.toLocaleString()} — verificar contra informe PDF.`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    skipReasons,
  };
}
