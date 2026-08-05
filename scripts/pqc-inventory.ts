/**
 * PQC inventario CLI — P6 Fase A.
 * Uso: npm run pqc:inventory
 */
import { assessPqcReadiness } from '../src/security/pqc-guardian.js';

const r = assessPqcReadiness();
console.log('[PQC] mode=', r.mode);
console.log('[PQC] hybridClaimAllowed=', r.hybridClaimAllowed);
console.log('[PQC] ok=', r.ok);
console.table(r.surface);
for (const n of r.notes) console.log(' ·', n);
console.log('[PQC] doc:', r.docRef);
if (!r.ok) process.exitCode = 1;
else console.log('[PQC] inventory OK — sin claim PQC productivo');
