# BLOCKED — G20 (2026-08-21T16:28Z)

## Estado

| Parte | Estado | Evidencia |
|-------|--------|-----------|
| G1–G19 smoke | **GO** | HEAD 200 |
| Backend Trust Pack | **PASS (API)** | `11-API-PROBE.md` |
| UI B1 registro | Parcial | `artifacts/01-registro.png` |
| Sesión post-registro | **FAIL / P0** | Cookie Secure en HTTP |
| G20 | **NO-GO** | `present:1/9` · verdict BLOCKED |

## Bug P0 (bloquea Operador B)

Registro redirige a `/escritorio` pero sesión no persiste (`hasSessionLs:false`).  
Causa: cookie `Secure` bajo `NODE_ENV=production` en `http://137.184.66.163`.

**Fix local listo** (sin deploy aún):
- `src/server/session-cookie.ts`
- `src/citizen/institutional/institutionAuth.ts`

## Próximo movimiento

1. Commit + deploy prod-light del fix  
2. Re-correr Operador B UI 1–9  
3. `npm run verify:operador-b` → exit 0  
