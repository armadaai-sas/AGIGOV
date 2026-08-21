# Escrutinio ventanas — Sprint ciudadano / apps (live)

**Fecha:** 2026-08-21 · **Host:** `http://137.184.66.163` · **SHA:** `50cc8f7`  
**Método:** checklist PLAN-PULIDO + HEAD smoke + health JSON

## Smoke live (2026-08-21T16:01Z)

| Check | Resultado |
|-------|-----------|
| Health | `ok:true` · `postgres:true` · `panicMode:false` |
| Rutas PWA (HEAD) | `/` escritorio gestión participar propuestas modelos contratos ayuda contacto institucional registro acceso piloto → **200** |
| CSV Trust Pack | `/docs/sample-ingest-3-hitos.csv` → **200** |
| Operador B pack | **0/9** screenshots · `g20Gate: NO-GO (PENDING evidence)` @ 16:01:43Z |

## Veredictos

| ID | Ventana | Veredicto | Notas |
|----|---------|-----------|-------|
| G1–G4, G7–G19 | Nav/UX/apps | **GO** (código + smoke HTTP) | Deployed; E2E humano parcial |
| G5/G6 | Registro/Login | **GO-CONDICIONADO** | API live register 201 + login 200; UI E2E = B 1–2 |
| G14/G18/G19 | Hub/empty/mobile | **GO** (código + live) | Hub corto; sin npm público; dock OS |
| **G20** | Trust Pack B | **NO-GO** | API pipeline PASS (`11-API-PROBE.md`); falta UI humano |

## Gates adyacentes (2026-08-21T16:13Z)

| Gate | Resultado | Nota |
|------|-----------|------|
| `npm run p9:go` | **GO-CONDICIONADO** | Residual explícito: Trust Pack Operador B humano |
| `GET /api/public/pilot` | `ok:false` | `multisigVerified:false` (0/3 sigs) — residual nacional, no sustituye G20 |

## Gap Board (≤12)

| ID | Sev | Gap | Next |
|----|-----|-----|------|
| **G20** | P0 | Sesión UI rota en HTTP + sin PNG pack | Deploy fix cookie/Bearer → re-correr B |
| G5/G6 | P0 | Cookie Secure en HTTP borra sesión | Mismo deploy |
| Pilot nacional | P2 | multisig 0/3 | post-G20 |
| Dom | P2 | HTTPS fijo | Opcional post-G20 |

## Próximo movimiento

**Solo G20:** ventana privada → http://137.184.66.163/institucional/registro → checklist `01-operador-b-checklist.md` → PNGs en `artifacts/` → `npm run verify:operador-b`.
